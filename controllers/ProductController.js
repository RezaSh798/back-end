const Product = require('../models/Product');

// Start upload image config
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (req, file, cb) => {
        const time = new Date();
        cb(null, myFileName(file));
    }
});
// Define storage
let imageName = '';
function myFileName(file) {
    const time = new Date();
    imageName =
        time.getFullYear() + '-' +
        time.getMonth() + '-' +
        time.getDate() + '-' +
        time.getHours() + '-' +
        time.getMinutes() + '-' +
        time.getSeconds() + '-' +
        time.getMilliseconds() + '-' +
        file.originalname
    
    return imageName;
}
// Upload method
var upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');
// Image validations
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype)
    if(extname && mimetype) {
        cb(null, true);
    }
    else {
        cb('لطفا یک عکس انتخاب کنید!');
    }
}
// End upload image config

module.exports = {
    getProducts: (req, res) => {
        Product.find()
        .then(products => {
            res.status(200).json({products});
        })
        .catch(err => console.log(err));
    },
    getProduct: (req, res) => {
        Product.findOne({_id: req.params.id})
        .then(product => {
            if(!product) {
                res.status(404).json({message: `محصولی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                res.status(200).json({product});
            }
        })
        .catch(err => console.log(err));
    },
    newProduct: (req, res) => {
        const product = req.body;
        let errors = [];
        if(!product.title) {
            errors.push({message: 'عنوان الزامی است!'});
        }
        if(product.price && typeof(product.price) === Number) {
            errors.push({message: 'قیمت باید یک عدد باشد!'});
        }
        if(errors.length > 0) {
            res.status(500).json(errors);
        }
        else {
            const newProduct = Product({
                title: product.title,
                description: product.description,
                body: product.body,
                price: product.price,
                category: product.categoryId,
                image: 'public/uploads/' + imageName,
            });
            
            newProduct.save()
            .then(() => {
                res.status(201).json({message: 'محصول با موفقیت ثبت گردید!'})
            })
            .catch(err => console.log(err));
        }
    },
    updateProduct: (req, res) => {
        Product.updateOne({_id: req.params.id}, req.body)
        .then(product => {
            if(!product) {
                res.json({message: `محصولی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                res.json({message: `محصول با id:${req.params.id} با موفقیت بروزرسانی شد!`});
            }
        });
    },
    deleteProduct: (req, res) => {
        Product.findOne({_id: req.params.id})
        .then(product => {
            if(!product) {
                res.json({message: `محصولی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                product.delete();
                res.json({message: `محصول با id:${req.params.id} با موفقیت حذف شد!`});
            }
        })
        .catch(err => console.log(err));
    },
    UploadImage: (req, res) => {
        upload(req, res, (err) => {
            if(err) {
                if(err.message) res.json({message: 'سایز تصویر بیش از حد مجاز است!'});
                res.json({message: err});
            }
            else {
                res.json({message: 'تصویر با موفقیت آپلود شد!'});
            }
        });
    },
    UpdateImage: (req, res) => {
        Product.findOne({_id: req.params.id})
        .then(product => {
            if(!product) {
                res.json({message: `محصولی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                fs.unlink(product.image, (err) => {
                    if(err) {
                        console.log('خطا هنگام حذف عکس محصول! \n' + err);
                    }
                    upload(req, res, (err) => {
                        if(err) {
                            if(err.message) res.json({message: 'سایز تصویر بیش از حد مجاز است!'});
                            res.json({message: err});
                        }
                        else {
                            console.log(imageName);
                            Product.updateOne({_id: req.params.id}, {image: 'public/uploads/' + imageName})
                            .then()
                            .catch(err => console.log(err));
                            res.json({message: 'تصویر با موفقیت آپلود شد!'});
                        }
                    });
                });
            }
        })
        .catch(err => console.log(err));
    }
}
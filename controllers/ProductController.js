const Product = require('../models/Product');
const Category = require('../models/Category');

// Start upload image config
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (req, file, cb) => {
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
    limits: {fileSize: 2000000},
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
        .populate('category')
        .exec((err, products) => {
            if(err) throw(err);
            res.status(200).json(products);
        });
    },
    getProduct: (req, res) => {
        Product.findOne({_id: req.params.id})
        .populate('category')
        .exec((err, product) => {
            if(err) throw(err);
            if(!product) {
                res.status(404).json({message: `محصولی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                res.status(200).json(product);
            }
        });
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
            Product.create({
                title: product.title,
                description: product.description,
                body: product.body,
                price: product.price,
                category: product.category,
                image: imageName ? 'public/uploads/' + imageName : '',
            })
            .then(async product => {
                await Category.updateOne(
                    {_id: product.category},
                    {$push: {products: product._id}}
                );
                imageName = '';
                res.status(201).json({message: 'محصول با موفقیت ثبت گردید!'});
            })
            .catch(err => console.log(err));
        }
    },
    updateProduct: (req, res) => {
        Product.findOne({_id: req.params.id})
        .then(product => {
            if(!product) {
                res.json({message: `محصولی با id:${req.params.id} پیدا نشد!`});
            }
            else if(req.body.category && (product.category != req.body.category)) {
                Category.updateOne(
                    {_id: product.category},
                    {$pull: {products: product._id}}
                )
                .then(() => {
                    Product.updateOne({_id: req.params.id}, {
                        title: req.body.title,
                        description: req.body.description,
                        body: req.body.body,
                        price: req.body.price,
                        category: req.body.category,
                        image: imageName ? 'public/uploads/' + imageName : '',
                    })
                    .then(async () => {
                        await Category.updateOne(
                            {_id: req.body.category},
                            {$push: {products: req.params.id}}
                        );
                        imageName = '';
                        res.json({message: `محصول با id:${req.params.id} با موفقیت بروزرسانی شد!`});
                    });
                })
                .catch(err => console.log(err));
            }
            else {
                Product.updateOne({_id: req.params.id}, {
                    title: req.body.title,
                    description: req.body.description,
                    body: req.body.body,
                    price: req.body.price,
                    image: imageName ? 'public/uploads/' + imageName : '',
                })
                .then(() => {
                    imageName = '';
                    res.json({message: `محصول با id:${req.params.id} با موفقیت بروزرسانی شد!`});
                });
            }
        })
    },
    deleteProduct: (req, res) => {
        Product.findOne({_id: req.params.id})
        .then(product => {
            if(!product) {
                res.json({message: `محصولی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                Category.updateOne(
                    {_id: product.category},
                    {$pull: {products: product._id}}
                )
                .then(() => {
                    product.deleteOne();
                    res.json({message: `محصول با id:${req.params.id} با موفقیت حذف شد!`});
                })
                .catch(err => console.log(err));
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
const Category = require('../models/Category');

module.exports = {
    getCategories: (req, res) => {
        Category.find()
        .then(cats => {
            res.status(200).json(cats);
        })
        .catch(err => console.log(err));
    },
    getCategory: (req, res) => {
        Category.findOne({_id: req.params.id})
        .then(cat => {
            if(!cat) {
                res.status(404).json({message: `دسته بندی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                res.status(200).json(cat);
            }
        })
        .catch(err => console.log(err));
    },
    newCategody: (req, res) => {
        const category = req.body;
        if(!category.title) {
            res.status(500).json({message: 'عنوان الزامی است!'});
        }
        else {
            Category.create({
                title: category.title
            })
            .then(cat => {
                res.status(201).json({message: 'دسته بندی با موفقیت ثبت شد!'});
            })
            .catch(err => console.log(err));
        }
    },
    updateCategory: (req, res) => {
        Category.findOne({_id: req.params.id})
        .then(cat => {
            if(!cat) {
                res.status(404).json({message: `دسته بندی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                Category.updateOne({_id: req.params.id}, req.body)
                .then(cat => {
                    res.status(200).json({message: `دسته بندی با id:${req.params.id} با موفقیت بروزرسانی شد!`});
                })
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
    },
    deleteCategory: (req, res) => {
        Category.findOne({_id: req.params.id})
        .then(cat => {
            if(!cat) {
                res.status(404).json({message: `دسته بندی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                cat.deleteOne();
                res.status(404).json({message: `دسته بندی با id:${req.params.id} با موفقیت حذف شد!`});
            }
        })
        .catch(err => console.log(err));
    }
}
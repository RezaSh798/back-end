const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
    getUsers: (req, res) => {
        User.find()
        .populate('factors')
        .exec((err, users) => {
            if(err) throw(err);
            res.json(users);
        });
    },
    getUser: (req, res) => {
        User.findOne({_id: req.params.id})
        .populate('factors')
        .exec((err, user) => {
            if(err) throw(err);
            if(!user) {
                res.status(404).json({message: `کاربری با id:${req.params.id} پیدا نشد!`});
            }
            else {
                res.status(200).json(user);
            }
        })
    },
    newUser: (req, res) => {
        const user = req.body;
        let errors = [];
        if(!user.phoneNumber) {
            errors.push({message: 'شماره همراه الزامی است!'});
        }
        if(!user.password) {
            errors.push({message: 'گذرواژه الزامی است!'});
        }
        const reGex = /^(\+98|0)?9\d{9}$/
        if(!reGex.test(user.phoneNumber)) {
            errors.push({message: 'شماره همراه باید معتبر باشد!'});
        }
        if(user.passwort && user.password.length < 8) {
            errors.push({message: 'گذرواژه حداقل باید 8 کاراکتر باشد!'});
        }
        if(user.password != user.confirmPassword) {
            errors.push({message: 'گذرواژه با تاییدیه اش برابر نیست!'});
        }
        if(errors.length > 0) {
            res.status(422).json({errors});
        }
        else {
            User.findOne({phoneNumber: user.phoneNumber})
            .then(isUser => {
                if(isUser) {
                    res.status(500).json({message: `شماره همراه : ${user.phoneNumber} قبلا ثبت شده است!`});
                }
                else {
                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) throw(err);
                        bcrypt.hash(user.password, salt, (err, hash) => {
                            if(err) throw(err);
                            user.password = hash;
                            User.create({
                                fullName: user.fullName,
                                phoneNumber: user.phoneNumber,
                                password: user.password,
                                address: user.address
                            })
                            .then(() => res.status(201).json({message: 'کاربر با موفقیت ثبت نام شد!'}))
                            .catch(err => console.log(err));
                        })
                    });
                }
            })
            .catch(err => console.log(err));
        }
    },
    updateUser: (req, res) => {
        let user = req.body;
        if(user.rol) {
            delete user.rol;
        }
        User.updateOne({_id: req.params.id}, user)
        .then(user => {
            if(!user) {
                res.status(404).json({message:  `کاربری با id:${req.params.id} پیدا نشد!`});
            }
            else {
                res.status(200).json({message: `کاربر با id:${req.params.id} با موفقیت بروزرسانی شد!`});
            }
        });
    },
    deleteUser: (req, res) => {
        User.findOne({_id: req.params.id})
        .then(user => {
            if(!user) {
                res.json({message: `کاربری با id:${req.params.id} پیدا نشد!`});
            }
            else {
                user.delete();
                res.status(200).json({message: `کاربر با id:${req.params.id} با موفقیت حذف شد!`});
            }
        });
    },
    userLogin: (req, res) => {
        res.status(200).json({message: 'خوش برگشتید!'});
    },
    userLogout: (req, res) => {
        req.logOut();
        res.status(200).json({message: 'به امید دیدار!'});
    }
}
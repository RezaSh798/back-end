const User = require('../models/User');

module.exports = {
    // isAuth ??
    ensureAuth: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        else {
            res.json({message: 'لطفا ابتدا وارد حساب کاربری خود شوید!'});
        }
    },
    // Rol Check!!
    rolAuth: (req, res, next) => {
        User.findOne({_id: req.query.userId})
        .then(user => {
            if(!user) {
                res.json({message: `کاربری با id:${req.query.userId} پیدا نشد!`});
            }
            else if(user.rol != 'admin') {
                res.json({message: 'شما اجازه دسترسی به این قسمت را ندارید!'});
            }
            else {
                return next();
            }
        });
    }
}
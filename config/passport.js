const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(
        new localStrategy({usernameField: 'phoneNumber'}, (phoneNumber, password, done) => {
            User.findOne({phoneNumber: phoneNumber})
            .then(user => {
                if(!user) {
                    return done(null, false, {message: 'ایمیل وارد شده، ثبت نشده است!'});
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw(err);
                    if(isMatch) return done(null, user);
                    return done(null, false, {message: 'گذرواژه اشتباه است!'});
                })
            })
            .catch(err => console.log(err));
        })
    );
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
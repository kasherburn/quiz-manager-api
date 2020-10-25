const User = require('./db/user');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    passport.use(
        // find user by email and then compare user password with entered password
        new localStrategy((email, password, done) => {
            User.findOne({ email: email }, (err, user) => {
                if (err) throw err;
                if (!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, res) => {
                    if (err) throw err;
                    if (result === true) {
                        done(null, user)
                    }
                    else {
                        return done(null, false)
                    }
                })
            })
        })
    )
    // creates a cookie with the users id
    passport.serializeUser((user, cb) => {
        cb(null, user.id)
    })
    // compare id in cookier and user id
    passport.deserializeUser((id, cb) => {
        User.findOne({ _id: id }, id), (err, user) => {
            cb(err, user)
        }
    })
}
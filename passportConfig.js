const User = require('./models/user');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport')
const { ExtractJwt } = require('passport-jwt');


passport.use(
    // find user by email and then compare user password with entered password
    new localStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) throw err;
            if (!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) throw err;
                if (res === true) {
                    done(null, user)
                }
                else {
                    return done(null, false)
                }
            })
        })
    })
)
passport.use(
    new JwtStrategy({ //authentication to check each http request contains a bearer token in the header
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secretkey'
    }, (payload, done) => {
        // find the user specified in token
        User.findById({ _id: payload.sub }, (err, user) => {
            if (err) return done(err, false);
            if (user) return done(null, user);
        });
    })
)




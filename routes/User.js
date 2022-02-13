const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user')
const JWT = require('jsonwebtoken');
const router = express.Router();



//login endpoint
router.post(
    "/auth",
    passport.authenticate("local", { session: false }),
    (req, res) => {
        if (req.isAuthenticated()) {
            const username = req.user.username
            const token = JWT.sign({ //and then generate a token
                iss: 'kelly', //issuer
                sub: req.user.id, //subject of the jwt
                iat: new Date().getTime(), //current time
                exp: new Date().setDate(new Date().getDate() + 1) //current time plus one day
            }, 'secretkey');
            res.status(200).json({ isAuthenticated: true, user: { username }, bearer_token: token });
        }
    }
);

//log out
router.get(
    "/logout",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ user: { username: "" }, bearer_token: '', session: true });
    }
);

// create user
router.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.json({ message: 'user already exists!' })
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10) //use bcrypt to hash password
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
                permissions: req.body.permissions
            });
            await newUser.save(); //save user
            res.status(200).json({
                message: 'user created!'
            })
        }
    })
})

module.exports = router;
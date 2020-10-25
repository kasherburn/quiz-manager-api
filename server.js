const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('./db/user')
const app = express();

// db connection
mongoose.connect("mongodb+srv://root:Grasmere1@qm-cluster.vu1a8.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log('Mongoose is connected!')
})

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}))
app.use(session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser('secretCode'))
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport); //import passport config file
//end of middleware

//routes
//login endpoint
app.post("/auth", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.json('user not found!');
        else {
            req.logIn(user, err => {
                if (err) throw err;
                res.json('successfully authenticated!')
            })
        }

    })(req, res, next);
})
// create user
app.post("/register", (req, res) => {
    User.findOne({ email: req.body.email }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.json('user already exists!')
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10) //use bcrypt to hash password
            const newUser = new User({
                email: req.body.email,
                password: hashedPassword
            });
            await newUser.save();
            res.json('user created!')
        }
    })
})
// get user details endpoint
app.get("/user", (req, res) => {
    res.send(req.user);
})
//start server
app.listen(3000, () => {
    console.log('server is running on port 3000')
})
//db connection

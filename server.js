
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const passport = require('passport');

// db connection
mongoose.connect("mongodb+srv://root:Grasmere1@qm-cluster.vu1a8.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log('Mongoose is connected!')
})

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// cors module so requests from front end aren't blocked
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}))
// session package
app.use(session({
    secret: "secretkey",
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser('secretkey'))
app.use(passport.initialize()); // initialize passport.js
app.use(passport.session());
app.use(express.json())
require('./passportConfig'); //import passport config file
//end of middleware

const userRouter = require("./routes/User");
const quizzesRouter = require("./routes/Quizzes.js");

app.use("", userRouter);
app.use("", quizzesRouter);


//start server
app.listen(3000, () => {
    console.log('server is running on port 3000')
})
//db connection

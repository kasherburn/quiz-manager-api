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
const Quiz = require('./db/quizQuestions');
const quizList = require('./db/quizList');

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
    User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.json('user already exists!')
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10) //use bcrypt to hash password
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword
            });
            await newUser.save();
            res.json('user created!')
        }
    })
})
// get user details endpoint
// app.get("/user", (req, res) => {
//     res.send(req.user);
// })

// create a quiz title
app.post(
    "/add-quiz-title",
    (req, res) => {
        const quiz_name = req.body.quiz_name;
        const quiz_id = req.body.quiz_id


        const quizName = new quizList({
            quiz_name,
            quiz_id
        });

        quizName
            .save()
            .then(() => res.json("Quiz Name Added!"))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );
    }
);
// create a quiz question
app.post(
    "/add-quiz",
    (req, res) => {
        const question = req.body.question;
        const answer_a = req.body.answer_a;
        const answer_b = req.body.answer_b;
        const answer_c = req.body.answer_c;
        const quiz_name = req.body.quiz_name

        const newQuizQuestion = new Quiz({
            question,
            answer_a,
            answer_b,
            answer_c,
            quiz_name
        });

        newQuizQuestion
            .save()
            .then(() => res.json("Quiz Added!"))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );
    }
);
//get quiz list
app.get(
    "/quiz-list",
    (req, res) => {
        quizList.find()
            .then((quizzes) => res.json(quizzes))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );
    }
);
//get quizzes by quiz id

//return one quiz using the quiz_name
app.get(
    "/questions/:quiz_id",
    (req, res) => {
        Quiz.find({ quiz_id: req.params.quiz_id })
            .then((quizzes) => res.json(quizzes))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );
    }
);

// update a quiz question
app.put(
    "/update-question",
    (req, res) => {
        Quiz.findById({ "_id": req.body.id })
            .then((quiz) => {
                quiz.question = req.body.question;
                quiz.answer_a = req.body.answer_a;
                quiz.answer_b = req.body.answer_b;
                quiz.answer_c = req.body.answer_c;
                quiz
                    .save()
                    .then(() => res.json("Quiz updated!"))
                    .catch((err) =>
                        res.status(400).json({
                            message: { messageBody: "ERROR:" + err, messageError: true },
                        })
                    );
            })
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );
    }
);



//start server
app.listen(3000, () => {
    console.log('server is running on port 3000')
})
//db connection

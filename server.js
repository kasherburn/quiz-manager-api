
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/user')
const app = express();
const Quiz = require('./models/quizQuestions');
const quizList = require('./models/quizList');
const JWT = require('jsonwebtoken')



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

//routes

//login endpoint
app.post(
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
app.get(
    "/logout",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ user: { username: "" }, bearer_token: '', session: true });
    }
);

// create user
app.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.json({ message: 'user already exists!' })
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10) //use bcrypt to hash password
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword
            });
            await newUser.save(); //save user
            res.status(200).json({
                message: 'user created!'
            })
        }
    })
})
// get user details endpoint
app.get("/user",
    (req, res) => {
        res.send(req.user);
    })

// create a quiz title
app.post(
    "/add-quiz-title",
    passport.authenticate('jwt', { session: false }),
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
    passport.authenticate('jwt', { session: false }),
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
    passport.authenticate('jwt', { session: false }),
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

//return a list of quiz questions using the quiz_name
app.get(
    "/questions/:quiz_id",
    passport.authenticate('jwt', { session: false }),
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
    passport.authenticate('jwt', { session: false }),
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

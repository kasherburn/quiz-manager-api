const Question = require('../models/quizQuestions');
const Answer = require('../models/quizAnswers');
const quizList = require('../models/quizList');
const { checkPermissions } = require('../permissions');
const express = require('express');
const passport = require('passport');
const router = express.Router();

// create a quiz title
router.post(
    "/add-quiz-title",
    passport.authenticate('jwt', { session: false }),
    checkPermissions('Edit'),
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
router.post(
    "/add-quiz",
    passport.authenticate('jwt', { session: false }),
    checkPermissions('Edit'),
    (req, res) => {
        const question = req.body.question;
        const answer_a = req.body.answer_a;
        const answer_b = req.body.answer_b;
        const answer_c = req.body.answer_c;
        const answer_d = req.body.answer_d ? req.body.answer_d : null;
        const answer_e = req.body.answer_e ? req.body.answer_e : null;
        const quiz_id = req.body.quiz_id;
        const question_id = req.body.question_id;

        const newQuizQuestion = new Question({
            question,
            quiz_id,
            question_id
        });

        const newQuizAnswer = new Answer({
            quiz_id,
            question_id,
            answer_a,
            answer_b,
            answer_c,
            answer_d,
            answer_e
        })

        newQuizQuestion.save()
        newQuizAnswer.save()
            .then(() => res.json("Quiz Added!"))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );
    }
);

//get quiz list
router.get(
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

//return a list of quiz questions using the quiz id
router.get(
    "/questions/:quiz_name",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Question.find({ quiz_id: req.params.quiz_name })
            .then((quizzes) =>
                res.json(quizzes))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );
    }
);

//return a list of quiz answers using the quiz id
router.get(
    "/answers/:quiz_name",
    passport.authenticate('jwt', { session: false }), checkPermissions('View'),
    (req, res) => {
        Answer.find({ quiz_id: req.params.quiz_name })
            .then((answers) =>
                res.json(answers))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );
    }
);

// update a quiz question
router.put(
    "/update-question",
    passport.authenticate('jwt', { session: false }), checkPermissions('Edit'),
    (req, res) => {
        Question.findById({ "_id": req.body.id })
            .then((question) => {
                question.question = req.body.question;
                question.save()
                    .then(() => res.json("Question updated!"))
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
// update a quiz answer
router.put(
    "/update-answer",
    passport.authenticate('jwt', { session: false }), checkPermissions('Edit'),
    (req, res) => {
        Answer.findById({ "_id": req.body.id })
            .then((answer) => {
                answer.answer_a = req.body.answer_a;
                answer.answer_b = req.body.answer_b;
                answer.answer_c = req.body.answer_c;
                answer.answer_d = req.body.answer_d;
                answer.answer_e = req.body.answer_e;
                answer.save()
                    .then(() => res.json("Answer updated!"))
                    .catch((err) =>
                        res.status(400).json({
                            message: { messageBody: "ERROR:" + err, messageError: true },
                        })
                    );
            })
    }
);
// remove quiz name
router.delete(
    "/delete-quiz-name/:name",
    passport.authenticate("jwt", { session: false }), checkPermissions('Edit'),
    (req, res) => {
        quizList.findOneAndDelete({ quiz_name: req.params.name })
            .then((
            ) => res.json("Quiz name deleted!"))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );

    }
);
// remove question
router.delete(
    "/delete-question/:id",
    passport.authenticate("jwt", { session: false }), checkPermissions('Edit'),
    (req, res) => {
        Question.findOneAndDelete({ question_id: req.params.id })
            .then((
            ) => res.json("Question deleted!"))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );

    }
);

// remove answers to a question
router.delete(
    "/delete-answers/:id",
    passport.authenticate("jwt", { session: false }), checkPermissions('Edit'),
    (req, res) => {
        Answer.findOneAndDelete({ question_id: req.params.id })
            .then(() => res.json("Answers deleted!"))
            .catch((err) =>
                res.status(400).json({
                    message: { messageBody: "ERROR:" + err, messageError: true },
                })
            );
    }
);

module.exports = router;


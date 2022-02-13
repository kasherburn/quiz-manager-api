const mongoose = require('mongoose');

const quizQuestions = new mongoose.Schema({
    question: { type: String, required: true },
    quiz_id: { type: Number, required: true },
    question_id: { type: String, required: true }

});



module.exports = mongoose.model("Question", quizQuestions);
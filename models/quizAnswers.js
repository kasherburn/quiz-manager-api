const mongoose = require('mongoose');

const quizAnswers = new mongoose.Schema({
    quiz_id: { type: Number, required: true },
    question_id: { type: String, required: true },
    answer_a: { type: String, required: true },
    answer_b: { type: String, required: true },
    answer_c: { type: String, required: true },
    answer_d: { type: String, required: false },
    answer_e: { type: String, required: false },


});



module.exports = mongoose.model("Answer", quizAnswers);
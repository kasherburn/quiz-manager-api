const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer_a: { type: String, required: true },
    answer_b: { type: String, required: true },
    answer_c: { type: String, required: true },
    quiz_id: { type: Number, required: true }

});

module.exports = mongoose.model("Quiz", quizSchema);
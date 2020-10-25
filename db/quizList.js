const mongoose = require('mongoose');

const quizListSchema = new mongoose.Schema({
    quiz_name: { type: String, required: true },
    quiz_id: { type: Number, required: true }

});

module.exports = mongoose.model("quizList", quizListSchema);
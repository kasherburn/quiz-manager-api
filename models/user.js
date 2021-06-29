const mongoose = require('mongoose');
const user = new mongoose.Schema({
    username: String,
    password: String,
    permissions: String, //edit, view, restricted
});

module.exports = mongoose.model("User", user)

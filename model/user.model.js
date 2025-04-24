const mongoose = require("mongoose");

const userContact = new mongoose.Schema({
    email: {
        type: String
    },
    is_LoggedIn: {
        type: Boolean
    },
    created_at: {
        type: Date
    },
    last_logged_in: {
        type: Date
    }
})

const User = new mongoose.model("accounts", userContact);

module.exports = User;
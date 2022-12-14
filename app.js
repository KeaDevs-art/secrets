require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

// schema
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// encryption
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

// model
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {

    res.render("home");
});

app.get("/login", (req, res) => {

    res.render("login");
});

app.get("/register", (req, res) => {

    res.render("register");
});

app.post("/register", (req, res) => {

    const user = new User({
        email: req.body.username,
        password: req.body.password
    });
    user.save((err) => {
        (err) ? console.log(err) : res.render("secrets");
    });

});

app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });

});

app.listen(3000, (req, res) => {
    console.log("Server running on port 3000...");
});

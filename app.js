require("dotenv").config();
require("./config/database.js").connect();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
var cookieParser = require('cookie-parser')

//import model - user
const User = require("./model/user");
//custom middleware
const auth = require('./middleware/auth')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("<h1>Hello Auth System</h1>")
})

app.post('/register', async (req, res) => {
    try {
        //collect all info
        const { firstname, lastname, email, password } = req.body;

        //validate info
        if(!(firstname && lastname && email && password)) {
            res.status(401).send("enter all fields");
        }

        //check if email exists
        const userExist = await User.findOne({ email });
        if(userExist) {
            res.status(401).send("user already found");
        }

        //encrypt the password
        const encryptPwd = await bcrypt.hash(password, 10);

        //save in db
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: encryptPwd,
        })

        //send a token to user
        const token = jwt.sign({
            id: user._id, email
        }, 'shhhhh', {expiresIn: '2h'})

        user.token = token;
        user.password = undefined;

        res.status(201).json(user);
        
    } catch(error) {
        console.log(error);
        console.log("connection failed");
    } 
})

app.post('/login', async (req, res) => {
    try {
        //collect info
        const {email, password} = req.body;

        //validate if all info present
        if(!(email && password)) {
            res.status(401).send("Enter all details");
        }

        //check if user exists
        const user = await User.findOne({email})
        
        if(user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({id: user._id, email}, 'shhhhh', {expiresIn: '2h'})

            user.password = undefined;
            user.token = token;
            

            //cookies
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpsOnly: true
            }

            res.status(200).cookie("token", token, options).json({
                success: true,
                token,
                user
            })
        }
        res.sendStatus(400).send("email or password is incorrect")
    } catch (error) {
        console.log(error);
        console.log("login failed");
    }
})

app.get('/dashboard', auth, (req, res) => {
    res.send("Welcome to the dashboard");
})

module.exports = app;

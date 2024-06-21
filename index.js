const express = require('express');
const app = express();
const { DBconnection } = require('./database/db.js');
const User = require('./models/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBconnection();

app.get("/", (req, res) => {
    res.send("Welcome to today's class!");
});

app.post("/register", async (req, res) => {
    // Clean the keys and values in the request body
    const cleanedBody = {};
    for (const key in req.body) {
        const cleanedKey = key.trim();
        cleanedBody[cleanedKey] = req.body[key].trim();
    }

    console.log('Cleaned Request Body:', cleanedBody); // Debug log to check the cleaned request body

    try {
        const { firstname, lastname, email, password } = cleanedBody;
        // Check that all the data exists
        if (!(firstname && lastname && email && password)) {
            return res.status(400).send("Please enter all the required fields!");
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists!");
        }

        // Encrypt the password
        const hashPassword = bcrypt.hashSync(password, 10);
        console.log('Hashed Password:', hashPassword); // Debug log for hashed password

        // Save the user to database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
        });

        // Generate a token for the user and send it
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });
        user.token = token;
        user.password = undefined;
        res.status(201).json({
            message: "You have successfully registered!",
            user
        });

    } catch (error) {
        console.error('Error:', error); // Log the error
        res.status(500).send('Internal Server Error');
    }
});

app.listen(8000, () => {
    console.log("Server is listening on port 8000");
});

const express = require('express');
const db = require('./database');
const {verifyPass} = require('./password');

const auth_router = express.Router();

function get_user(req) {
    let user = {  // We keep the Guest object to act as a default if there is no session
        name: "guest",
        isLoggedIn: false,
        loginTime: null,
        id: null
    };
    
    // Check if user is logged in via session
    if (req.session.isLoggedIn) {
        user = {
            name: req.session.username,
            displayname: req.session.displayname,
            isLoggedIn: true,
            loginTime: req.session.loginTime,
            id: req.session.userid
        };
    }
    return user;
}

// Send the login page to the user
auth_router.get('/login', (req, res) => {
    user = get_user(req);
    if(user.isLoggedIn) {
        res.redirect('/');
    }
    else {
        res.render('login', {user: user});
    }
});

// Log the user in if there are no errors
// if there are errors, re-render the login page with an error message
auth_router.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) { // The user may have not entered all required fields
        res.render('login', {user: get_user(req), error: "Please enter username and password"});
        return; // No more work to do
    }
    
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username);
    
    if(user == undefined) { // Username does not exist
        res.render('login', {user: get_user(req), error: "Wrong username or password"});
        return;
    }
    else if (user.password != password) { // Password is wrong
        res.render('login', {user: get_user(req), error: "Wrong username or password"});
    }
    else {
        // Set session data
        req.session.isLoggedIn = true;
        req.session.username = username;
        req.session.displayname = user.display_name;
        req.session.userid = user.id;
        req.session.loginTime = new Date().toISOString();
        
        console.log(`User ${username} logged in at ${req.session.loginTime}`);
        res.redirect('/comments');
    }
});

// Render the registration page
auth_router.get('/register', (req, res) => {
    user = get_user(req);
    if(user.isLoggedIn) {
        res.redirect('/');
    }
    else {
        res.render('register', {user: user, errors: []});
    }
});

// Register the user if there are no errors
// If there are errors, tell the user
auth_router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const displayname = req.body.displayname;
    const agreed = req.body.agree;
    
    const errors = [];
    
    if(!agreed) { // Agree
        errors.push("You did not agree");
    }
    if (!username || !password || !displayname) { // The user has to fill in all the fields
        errors.push("Please enter into all fields");
    }
    
    errors.push(...verifyPass(password));
    if (errors.length==0) {
        try {
            const stmt = db.prepare('INSERT INTO users (username, display_name, password) VALUES (?, ?, ?)');
            const result = stmt.run(username, displayname, password);
            req.session.isLoggedIn = true;
            req.session.displayname = displayname;
            req.session.username = username;
            req.session.userid = result.lastInsertRowid;
            req.session.loginTime = new Date().toISOString();
            res.redirect('/');
            return;
        }
        catch (error) {
            errors.push("Username already taken")
        }
    }
    res.render('register', {user: get_user(req), errors: errors});
});

// Log the user out
auth_router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

module.exports = {get_user, auth_router};
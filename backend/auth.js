const express = require('express');
const path = require('path');
const auth_router = express.Router();

// The system and guest accounts should not be login-able
// so if ther epassword is empty, then if the user tries to log in
// thy will be instead told to enter a password which will inevitably be incorrect
users = {'system': {password: ''}, 'guest': {password: ''}};

function get_user(req) {
    let user = {  // We keep the Guest object to act as a default if there is no session
        name: "guest",
        isLoggedIn: false,
        loginTime: null,
    };
    
    // Check if user is logged in via session
    if (req.session.isLoggedIn) {
        user = {
            name: req.session.username,
            isLoggedIn: true,
            loginTime: req.session.loginTime,
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
// if there are erros, re-render the login page with an error message
auth_router.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) { // The user may have not entered all required fields
        res.render('login', {user: get_user(req), error: "Need to enter username and password"});
    }
    else if(users[username] == undefined) { // Username does not exsit
        res.render('login', {user: get_user(req), error: "Wrong username or password"});
    }
    else if (users[username].password != password) { // Password is wring
        res.render('login', {user: get_user(req), error: "Wrong username or password"});
    }
    else {
        // Set session data
        req.session.isLoggedIn = true;
        req.session.username = username;
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
        res.render('register', {user: user, error: ""});
    }
});

// Register the user if there are no errors
// If there are errors, tell the user
auth_router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const agreed = req.body.agree;
    
    if(!agreed) { // Agree
        res.render('register', {user: get_user(req), error: "You did not agree"});
    }
    else if (!username || !password) { // The user has to fill in all the fields
        res.render('register', {user: get_user(req), error: "Need to enter username and password"});
    }
    else if (users[username] != undefined) { // The username has to exist
        res.render('register', {user: get_user(req), error: "Username already taken"})
    }
    else {
        users[username] = {password: password};
        req.session.isLoggedIn = true;
        req.session.username = username;
        req.session.loginTime = new Date().toISOString();
        comments.unshift({'name': 'system',
        'content': `Welcome, ${username}`,
        'created': new Date().toDateString()
        })
        res.redirect('/');
    }
})

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
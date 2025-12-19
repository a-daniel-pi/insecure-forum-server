const express = require('express');
const db = require('./database');
const {verifyPass, checkHash, hashPass} = require('./password');
const {get_user} = require('./auth');

const profile_router = express.Router();

profile_router.get('/', (req, res) => {
    user = get_user(req);
    if(!user.isLoggedIn) {
        res.redirect('/auth/login');
        return;
    }
    res.render('myprofile', {user: user, name: user.displayname, color: user.color, 
        username: user.name})
});

profile_router.get('/chdisplay', (req, res) => {
    if(!req.session.isLoggedIn) {
        res.redirect('/auth/login');
        return;
    }
    res.render('chdisplay', {user: get_user(req)});
});

profile_router.post('/chdisplay', (req, res) => {
    if(!req.session.isLoggedIn) {
        res.redirect('/auth/login');
        return;
    }
    const stmt = db.prepare('UPDATE users SET display_name = ? WHERE id = ?');
    stmt.run(req.body.displayname, get_user(req).id);
    req.session.displayname = req.body.displayname;
    res.redirect('/myprofile');
});

profile_router.get('/chpass', (req, res) => {
    if(!req.session.isLoggedIn) {
        res.redirect('/auth/login');
        return;
    }
    res.render('chpass', {user: get_user(req)});
});

profile_router.post('/chpass', async (req, res) => {
    const newpassword = req.body.newpassword;
    const oldpassword = req.body.oldpassword;
    const repassword = req.body.repassword;
    const errors = [];
    const user = get_user(req);
    if(!user.isLoggedIn) {
        res.redirect('/auth/login');
        return;
    }
    
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const userdata = stmt.get(user.name);
    
    if (await checkHash(oldpassword, userdata.password)) { // Password is wrong
        errors.push("Wrong password");
    }
    if (newpassword != repassword) {
        errors.push("New and retyped passwords must match");
    }
    errors.push(...verifyPass(newpassword));
    if (errors.length==0) {
        hash = await hashPass(newpassword);
        const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
        stmt.run(hash, user.id);
        res.redirect('/myprofile');
    }
    else {
        res.render('chpass', {user: user, errors: errors});
    }
    
});

profile_router.get('/chcolor', (req, res) => {
    if(!req.session.isLoggedIn) {
        res.redirect('/auth/login');
        return;
    }
    res.render('chcolor', {user: get_user(req)});
});

profile_router.post('/chcolor', (req, res) => {
    if(!req.session.isLoggedIn) {
        res.redirect('/auth/login');
        return;
    }
    const stmt = db.prepare('UPDATE users SET color = ? WHERE id = ?');
    stmt.run(req.body.color, get_user(req).id);
    req.session.color = req.body.color;
    res.redirect('/myprofile');
});

module.exports = profile_router;
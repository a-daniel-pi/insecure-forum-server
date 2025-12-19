const express = require('express');
const db = require('./database');
const {verifyPass, checkHash, hashPass} = require('./password');
const {get_user} = require('./auth');

const profile_router = express.Router();

profile_router.get('/', (req, res) => {
    user = get_user(req);
    res.render('myprofile', {user: user, name: user.displayname, username: user.name})
});

profile_router.get('/chdisplay', (req, res) => {
    res.render('chdisplay', {user: get_user(req)});
});

profile_router.post('/chdisplay', (req, res) => {
    const stmt = db.prepare('UPDATE users SET display_name = ? WHERE id = ?');
    stmt.run(req.body.displayname, get_user(req).id);
    req.session.displayname = req.body.displayname;
    res.redirect('/myprofile');
});

profile_router.get('/chpass', (req, res) => {
    res.render('chpass', {user: get_user(req)});
});

profile_router.post('/chpass', async (req, res) => {
    const newpassword = req.body.newpassword;
    const oldpassword = req.body.oldpassword;
    const repassword = req.body.repassword;
    const errors = [];
    const user = get_user(req)
    
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

module.exports = profile_router;
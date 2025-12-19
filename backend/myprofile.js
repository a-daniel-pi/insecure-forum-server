const express = require('express');
const db = require('./database');
const {verifyPass} = require('./password');
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
    res.redirect('/myprofile/myprofile');
});

module.exports = profile_router;
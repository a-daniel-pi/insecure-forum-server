const express = require('express');
const {get_user} = require('./auth');
const db = require('./database');
const comment_router = express.Router();

comment_router.get('/new', (req, res) => {
    user = get_user(req);
    if(user.isLoggedIn) {
        res.render('new-comment', {user: get_user(req)});
    }
    else {
        res.redirect('/auth/login');
    }
});

comment_router.post('/new', (req, res) => {
    user = get_user(req);
    if(!user.isLoggedIn) {
        res.redirect('/');
    }
    const stmt = db.prepare('INSERT INTO comments (username, content) VALUES (?, ?)');
    const result = stmt.run(user.name, req.body.content);
    res.redirect('/comments');
});

comment_router.get('/', (req, res) => {
    const stmt = db.prepare('SELECT * FROM comments');
    const comments = stmt.all();
    console.log(comments)
    res.render('comments', {comments: comments, user: get_user(req)});
});

module.exports = {comment_router};
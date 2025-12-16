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
    const stmt = db.prepare('INSERT INTO comments (user, content) VALUES (?, ?)');
    const result = stmt.run(user.id, req.body.content);
    res.redirect('/comments');
});

comment_router.get('/', (req, res) => {
    let page = 0
    if(req.query.page) {
        page = req.query.page;
    }
    const stmt = db.prepare('SELECT * FROM comments ORDER BY id DESC LIMIT 20 OFFSET ?');
    const comments = stmt.all(page*20);
    for (const comment of comments) { // Get the username of each user
        const userget = db.prepare('SELECT * FROM users WHERE id = ?');
        const user = userget.get(comment.user);
        comment.username = user.display_name;
    }
    res.render('comments', {comments: comments, user: get_user(req)});
});

module.exports = {comment_router};
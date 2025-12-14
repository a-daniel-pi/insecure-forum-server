const express = require('express');
const {get_user} = require('./auth');
const comment_router = express.Router();

comments = [
    {
        'name': 'system',
        'content': "Welcome to this new site.",
        'created': new Date().toDateString()
    }
];

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
    comments.unshift({'name': user.name,
        'content': req.body.content,
        'created': new Date().toDateString()
    });
    res.redirect('/comments');
});

comment_router.get('/', (req, res) => {
    res.render('comments', {comments: comments, user: get_user(req)});
});

module.exports = {comment_router};
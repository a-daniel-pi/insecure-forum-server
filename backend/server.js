const express = require('express');
const session = require('express-session');
const hbs = require('hbs');
const path = require('path');

const {get_user, auth_router} = require('./auth');

const app = express();
const PORT = 3000;

// Configure Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Register partials directory
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Cookie middleware
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

comments = [
    {
        'name': 'system',
        'content': "Welcome to this new site.",
        'created': new Date().toDateString()
    }
];

app.get('/', (req, res) => {
    res.render('home', {user: get_user(req), comments: comments.slice(0, 5)});
});

app.use('/auth', auth_router);

app.get('/comments/new', (req, res) => {
    user = get_user(req);
    if(user.isLoggedIn) {
        res.render('new-comment', {user: get_user(req)});
    }
    else {
        res.redirect('/login');
    }
});

app.post('/comment', (req, res) => {
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

app.get('/comments', (req, res) => {
    res.render('comments', {comments: comments, user: get_user(req)});
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {"url": req.path, user: get_user(req)})
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const session = require('express-session');
const hbs = require('hbs');
const path = require('path');
const SqliteStore = require('./session');

const {get_user, auth_router} = require('./auth');
const {comment_router, get_last_comments} = require('./comments');
const profile_router = require('./myprofile');

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

// Set up session manager
const sessionStore = new SqliteStore();

app.use(session({
    secret: 'very-secret',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.get('/', (req, res) => {
    res.render('home', {user: get_user(req), comments: get_last_comments(5)});
});

app.use('/auth', auth_router);

app.use('/comments', comment_router);

app.use('/myprofile', profile_router);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {"url": req.path, user: get_user(req)})
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

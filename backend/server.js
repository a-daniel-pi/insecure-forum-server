const express = require('express');
const session = require('express-session');
const hbs = require('hbs');
const path = require('path');

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
        'name': 'System',
        'content': "Welcome to this new site.",
        'created': "10-29-25 1:24 PM"
    }
]

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

app.get('/', (req, res) => {
    res.render('home', {user: get_user(req)});
});

app.get('/login', (req, res) => {
    user = get_user(req);
    if(user.isLoggedIn) {
        res.redirect('/');
    }
    else {
        res.render('login', {user: get_user(req)});
    }
});

app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
     if (username && password) {
        // Set session data
        req.session.isLoggedIn = true;
        req.session.username = username;
        req.session.loginTime = new Date().toISOString();
        
        console.log(`User ${username} logged in at ${req.session.loginTime}`);
        res.redirect('/');
    } else {
        res.redirect('/login?error=1');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

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
    comments.push({'name': user.name,
        'content': req.body.content,
        'created': "Not supported yet"
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

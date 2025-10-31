const express = require('express');
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

app.get('/', (req, res) => {
    res.render('home', {title: "Welcome"});
});

app.get('/login', (req, res) => {
    res.render('login', {title: "Log In"});
});

comments = [
    {
        'name': 'Guest',
        'content': "Lorem ipsum dolor sit amet",
        'created': "10-29-25 1:24 PM"
    },
    {
        'name': 'Pi',
        'content': "3.14159265358",
        'created': "3-14-15 3:14 PM"
    },
    {
        'name': 'Lora',
        'content': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        'created': "1-1-1970 12:00 AM"
    }
]

app.get('/comments', (req, res) => {
    res.render('comments', {comments: comments, title: "Comments"});
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {title: "404 Not Found", "url": req.path})
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

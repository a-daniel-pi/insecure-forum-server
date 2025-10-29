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

// 404 handler
app.use((req, res) => {
    res.render('404', {title: "404 Not Found", "url": req.path})
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

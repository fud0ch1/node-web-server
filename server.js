const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();
// Use View Engine - hbs, hbs is handlebars
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

// Middleware
// Next forces the script to wait until it next is called
// var now puts a timestamp in the log
app.use((req, res, next) =>{
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`

  console.log(log);
  fs.appendFile('server.log', log +'\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.')
    }
  });
  next();
});
// Renders a Maintenance Page.
app.use((req, res, next) => {
  res.render('maintenance.hbs');
  // next();
});

app.use(express.static(__dirname + '/public'));
// Function for dynamic placeholders in the handlebar pages {{getCurrentYear}}
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) =>{
  return text.toUpperCase();
});


new Date().getFullYear()
// res.render renders the page that is the variable
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome, this is the home page!',
  });
});

// res.render renders the page that is the variable
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    someText: 'This is an experimental server'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  })
})

app.listen(3000, () => {
  console.log('Server is up on Port 3000')
});

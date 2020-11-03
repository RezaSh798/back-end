const express = require('express');
const port = process.env.PORT || 3000;
const passport = require('passport');
const app = express();

// Passport config
require('./config/passport')(passport);

// Connect to db
const mongoos = require('mongoose');
const {uri} = require('./config/db');
mongoos.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to mongodb'))
.catch(err => console.log(err));

// Static
app.use(express.static('public'));

// BodyParser
app.use(express.urlencoded({extended: false}));

// Middleware
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware
const {rolAuth} = require('./config/auth');

// Routes
app.use('/api/v1/users', require('./routes/api/v1/users'));
app.use('/api/v1/products', rolAuth, require('./routes/api/v1/products'));
app.use('/api/v1/cats', rolAuth, require('./routes/api/v1/categories'));
// app.use('/api/v1/orders', require('./routes/api/v1/orders'));

app.listen(port, () => console.log(`Server is running at ${port}`));
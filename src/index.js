const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const path = require('path');
const routes =  require('./routes/index')
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

//Initializations
const app = express();
require('./database');
require('./passport/local-auth');

//settings
app.set('views',path.join(__dirname, 'views') );
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('port', process.env.PORT || 3001);

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: 'myscecretsession',
    resave: true,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    app.locals.signupMessage = req.flash('signupMessage');
    next();
});
//routes
app.use('/', routes);

//starting the server
app.listen(app.get('port'), ()=>{
    console.log('Server on port: ', app.get('port'));
} );
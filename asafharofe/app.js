


var promise = require('bluebird');
var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var methodOverride = require('method-override');
var session = require('express-session');

//============== login password strategy ===============
var mongoskin = require('mongoskin');
var db = require('mongoskin').db('mongodb://localhost:27017/AsafHaRofe');
var usersDB = db.collection('users');


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, cb) {
        console.log("LocalStrategy  === " + username + " === " + password);
        usersDB.findOne({UserName : username }, function (err, user) {
            console.log("LocalStrategy  === " + user);
            if (err) { return cb("ffff"); }
            if (!user) { return cb(null, false); }
            if (user.Password != password) { return cb(null, false); }
           
            return cb(null, user);
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

var app = express();

// view engine setup
app.set('port', (process.env.PORT || 3000));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public','images','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var sessionStoreConf = require("./config.js").DB.SessionStore;
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: '{F58BDD7D-C2F3-41EA-B436-68CA4A7BF021}', 
    store: new MongoStore({
        url: sessionStoreConf
    }),
    cookie: {
        
        maxAge: 4 * 60 * 60 * 1000 //4 hours
    },
    resave: false,
    saveUninitialized: true,

}));
app.use(passport.initialize());
app.use(passport.session());

//============== routes ===========================
var routes = require('./routes');
var baseroute = require("./routes/baseroute");
var index = require("./routes/index");
//var eventscategory = require("./routes/eventscategory");



app.post('/user/login',
    passport.authenticate('local', {
    successRedirect: '/displayevents'
, failureRedirect: '/' })
);
app.get('/user/logout', function (req, res) { 
    req.logout();
    res.redirect('/');
});




app.get('/', index.router);
app.get("/displayevents", baseroute.GetDisplayEventsList);
app.post("/category/add", baseroute.CreateNewCategory);
app.post("/events/createnewevent", baseroute.CreateNewEvent);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace

// // production error handler
// // no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

//====================== ==============





http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


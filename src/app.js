var mongoose = require('mongoose');
var http = require('http');
var bodyParser = require('body-parser');
var connect = require('connect');
var configs = require('./shared/configs/config');

var mongodb = require('./shared/configs/config').mongoURL;

var aboutRouter = require('./about/controllers/about');
var splashRouter = require('./home/controllers/splash');
var genericRouter = require('./shared/controllers/generic');
var authenticatorRouter = require('./shared/controllers/authenticate');

var signUpRouter = require('./signUp/controllers/signUp');
var signInRouter = require('./signIn/controllers/signIn');
var calendarRouter = require('./calendar/controllers/calendar');
var mealsRouter = require('./meals/controllers/meals');
var recipesRouter = require('./recipes/controllers/recipes');
var shopRouter = require('./shop/controllers/shop');
var logOutRouter = require('./shared/controllers/logOut');
var notFoundRouter = require('./errors/controllers/notFound');
var settingsRouter = require('./settings/controllers/settings');

mongoose.connect(mongodb, {useMongoClient: true});

var app = connect();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', splashRouter );
app.use('/about', aboutRouter)
app.use('/signUp', signUpRouter);
app.use('/signIn', signInRouter);
app.use(genericRouter);

app.use(authenticatorRouter);
app.use('/settings', settingsRouter);
app.use('/calendar', calendarRouter);
app.use('/meals', mealsRouter);
app.use('/recipes', recipesRouter);
app.use('/shop', shopRouter);
app.use('/logOut', logOutRouter);

app.use(notFoundRouter);

http.createServer(app).listen(configs.port, configs.host);
console.log('Available on:    '+ configs.host + ':'+configs.port);

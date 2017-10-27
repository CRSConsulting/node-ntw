/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

const cronJobs = require('./config/cron');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const mobileController = require('./controllers/mobile');
const tangoController = require('./controllers/tango');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Cron Config
 */
// const message = 'hello world';

// if (message === 'hello world') {
//   newFunction();
// }

// function newFunction() {
//   for (const key in cronJobs) {
//     console.log('starting 1st');
//     cronJobs[key].start();
//     setTimeout(() => {
//       console.log('stopping 1st');
//       cronJobs[key].stop();
//     }, 50000);
//     setTimeout(() => {
//       console.log('starting 2nd');
//       cronJobs[key].start()
//       ;
//     }, 15000);
//     setTimeout(() => {
//       console.log('stopping 2nd');
//       cronJobs[key].stop()
//       ;
//     }, 20000);
//     setTimeout(() => {
//       console.log('starting 3rd');
//       cronJobs[key].start()
//       ;
//     }, 25000);
//     setTimeout(() => {
//       console.log('stopping 3rd');
//       cronJobs[key].stop()
//       ;
//     }, 30000);
//   }
// }


// for (const key in cronJobs) {
//   console.log('starting 1st');
//   cronJobs[key].start();
// }

// function promise(index, keyword) {
//   return new Promise((resolve) => {
//     const delay = Math.random() * 10000; // between 0 and 5 seconds
//     // const delay = 1000;
//     console.log(`${index}. Waiting ${delay}`);
//     setTimeout(() => {
//       const key = keyword.keyword;
//       mobileController.test(key);
//       console.log(`${index}. Done waiting ${delay}`);
//       resolve();
//     }, delay);
//   });
// }
// Promise.all([
//   promise(1, { keyword: 'seattle.v1', cronPattern: '*/1 * * * * *' }),
//   promise(2, { keyword: 'seattle.v2', cronPattern: '*/2 * * * * *' }),
//   promise(3, { keyword: 'seattle.v3', cronPattern: '*/3 * * * * *' }),
//   promise(4, { keyword: 'seattle.v4', cronPattern: '*/4 * * * * *' })
// ])
//   .then(() => console.log('All done!'));


/**
 * Connect to MongoDB.
 */
// mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, { useMongoClient: true });
process.on('SIGNT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disonnected through application termination');
  });
});
/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use((req, res, next) => {
//   if (req.path === '/api/upload') {
//     next();
//   } else {
//     lusca.csrf()(req, res, next);
//   }
// });
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
app.get('/api/mobile', mobileController.getAll);
app.get('/api/mobile/keyword/:keyword', mobileController.getKeywordAndInsert);
app.get('/api/mobile/sms', mobileController.insertWinnerSMS);
app.get('/api/mobile/raffle', mobileController.getRaffleWinner);
app.get('/api/mobile/test', mobileController.test);

app.post('/api/tango', tangoController.insertTango);
app.get('/api', apiController.getApi);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/upload', apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s Server is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;


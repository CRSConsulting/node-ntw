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
const defaultErrorHandler = require('./error-handlers/default');
const notFoundHandler = require('./error-handlers/notfound');
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
const methodOverride = require('method-override');
const helmet = require('helmet');
// const multer = require('multer');

// const upload = multer({ dest: path.join(__dirname, 'uploads') });

const cron = require('./config/cron');

const moment = require('moment');

const schedule = require('node-schedule');

const retryController = require('./controllers/retry');
const tokenController = require('./controllers/token');

// const rule = new schedule.RecurrenceRule();
// // rule.dayOfWeek = [0, new schedule.Range(1, 6)];
// // rule.hour = 0;
// // rule.minute = 5;

// // This job runs every 7 minutes
// rule.minute = new schedule.Range(0, 59, 2);

// const j = schedule.scheduleJob(rule, (req, res) => {
//   console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SS - ')}Job is currently executing`);
//   const startCronJob = cron.job.start();
//   retryController.getAll(req, res);
//   tokenController.getExpired(req, res);
// });

// // start job
// const startCronJob = cron.job.start();

// // stop job
// const stopCronJob = cron.job.stop();
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
const dateController = require('./controllers/date');
const timeframeController = require('./controllers/timeframe');

const messageController = require('./controllers/message');

const ipController = require('./controllers/ip');
const ftpController = require('./controllers/ftp');
const reportController = require('./controllers/report');
/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
// mongoose
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
} else {
  mongoose.connect(process.env.MONGODB_TEST_URL);
}
process.on('SIGNT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disonnected through application termination');
    process.exit(0);
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
app.use(helmet());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
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
app.get('/reports', homeController.reports);
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

// Mobile
app.get('/api/mobile', mobileController.getAll);
app.get('/api/mobile/keyword/:keyword', mobileController.getKeywordAndInsert);
app.get('/api/mobile/sms/:keyword', mobileController.insertWinnerSMS);
app.get('/api/mobile/raffle/:keyword', mobileController.findWinnerIfAvailable);
app.get('/api/mobile/master', mobileController.master);
// Tango
app.get('/api/tango', tangoController.getAll);
app.post('/api/tango', tangoController.insert);
app.get('/api/tango/:id', tangoController.getOne);
// Date
app.get('/api/date', dateController.getAll);
app.post('/api/date', dateController.insert);
app.get('/api/date/:id', dateController.getOne);
// Default API endpoints
app.get('/api', apiController.getApi);
app.post('/campaign', apiController.postCampaign);
// Timeframe
app.get('/api/timeframe', timeframeController.getAll);
app.post('/api/timeframe', timeframeController.insert);
app.get('/api/timeframe/:id', timeframeController.getOne);
// Retry
app.get('/api/retry', retryController.getAll);
app.post('/api/retry', retryController.insert);
app.get('/api/retry/:id', retryController.getOne);
app.delete('/api/retry/:id', retryController.removeById);
// Message
app.get('/api/message/verify', ipController.checkIp, messageController.verifyEmail, retryController.createTangoRetry);
// app.get('/api/message/verify', ipController.checkIp);
app.post('/api/message/', messageController.sendEmail);
// Token
app.get('/api/token', tokenController.getAll);
app.post('/api/token', tokenController.insert);
// FTP
app.get('/ftp', ftpController.writeFile);
// Reports UI Frontend
// app.get('/api/report', reportController.index);
app.get('/api/report/venue', reportController.venue);
app.get('/api/report/time', reportController.time);
app.get('/api/report/prize', reportController.prize);
app.get('/api/report/events', reportController.events);
app.get('/api/report/entry', reportController.entry);
app.get('/api/report/donor', reportController.donor);

app.post('/api/report/venue', reportController.venuePost);
app.post('/api/report/time', reportController.timePost);
app.post('/api/report/prize', reportController.prizePost);
app.post('/api/report/events', reportController.eventsPost);
app.post('/api/report/entry', reportController.entryPost);
app.post('/api/report/donor', reportController.donorPost);

/**
 * Error Handler.
 */

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
} else {
  app.use(notFoundHandler);
  app.use(defaultErrorHandler);
}


/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s Server is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
  console.log('resason', reason.stack);
});


module.exports = app;


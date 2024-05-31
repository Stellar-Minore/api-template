const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const schedule = require('node-schedule');

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/./config/config.json`)[env];
const cors = require('cors');

const docsRouter = require('./routes/docs');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { deleteExpiredAccounts } = require('./helpers/globals');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('superSecret', config.superSecret);

app.use(logger(':date[clf] ":method :url"'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/docs', docsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

const cookieOptions = {
	httpOnly: true,
	sameSite: 'strict',
	secure: (process.env.NODE_ENV || env) !== 'development'
};

app.set('cookieOptions', cookieOptions);

app.listen(() => {
	schedule.scheduleJob('0 0 * * *', () => {
		deleteExpiredAccounts();
	});
});

module.exports = app;

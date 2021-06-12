const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// .env import
require('dotenv').config()

// Cors import
const cors = require('cors');

// Mongoose
const mongoose = require('mongoose')
// mongoose connection
mongoose.connect('mongodb://localhost/shoppingSite',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
mongoose.set('useCreateIndex', true)
const db = mongoose.connection;
db.on('error', function () { console.log('Connection Error') })
db.once('open', function () { console.log('Connection Works') })

// Routers imports
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/api/products');
const cartAndOrdersRouter = require('./routes/api/cart-and-orders');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cors
app.use(cors());

// Routers
app.use('/', indexRouter);
app.use('/shopping/users', usersRouter);
app.use('/shopping/api/products', productsRouter);
app.use('/shopping/api/cart-and-orders', cartAndOrdersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

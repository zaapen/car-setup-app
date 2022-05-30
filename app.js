const path = require('path');
const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCSRFTokenMiddleware = require('./middlewares/csrf-token');
const checkAuthMiddleware = require('./middlewares/check-auth');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const baseRoutes = require('./routes/base.routes');
const authRoutes = require('./routes/auth.routes');
const carSetupRoutes = require('./routes/carsetup.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(`/cars/assets`, express.static('carSetupData'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());
app.use(addCSRFTokenMiddleware);
app.use(checkAuthMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(protectRoutesMiddleware, carSetupRoutes);

app.use(errorHandlerMiddleware.handleInvalidRoutes);
app.use(errorHandlerMiddleware.handleErrors);

db.connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log('Failed to connect to the database!');
    console.log(error);
  });

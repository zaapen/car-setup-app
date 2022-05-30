const session = require('express-session');
const mongodbStore = require('connect-mongodb-session');

const createSessionStore = () => {
  const MongoDBStore = mongodbStore(session);

  const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017',
    databaseName: 'car-setup',
    collection: 'sessions'
  });

  return store;
}

const createSessionConfig = () => {
  return {
    secret: 'i-am-vengence',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000
    }
  }
}

module.exports = createSessionConfig;
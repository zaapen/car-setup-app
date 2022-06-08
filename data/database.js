const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let mongodbUrl = 'mongodb://localhost:27017';

if (process.env.MONGODB_URL) {
  mongodbUrl = process.env.MONGODB_URL;
}

let database;

const connectToDatabase = async () => {
  const client = await MongoClient.connect(mongodbUrl);
  database = client.db('car-setup');
};

const getDb = () => {
  if (!database) {
    throw new Error('You must connect to the database server!');
  }

  return database;
};

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};

const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
  constructor(email, password, fullname) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection('users').insertOne({
      email: this.email,
      fullname: this.fullname,
      password: hashedPassword,
    });
  }

  getUserWithSameEmail() {
    return db.getDb().collection('users').findOne({ email: this.email });
  }

  static async findById(userId) {
    const uid = mongodb.ObjectId(userId);

    return db
      .getDb()
      .collection('users')
      .findOne({ _id: uid }, { projection: { password: 0 } }); // 0 is to exclude the data being fetch
  }

  async existAlready() {
    const existingUser = await this.getUserWithSameEmail();

    if (existingUser) {
      return true;
    }

    return false;
  }

  async hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;

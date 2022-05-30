const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const mongodb = require('mongodb');

const db = require('../data/database');

class Carsetup {
  constructor(carSetupData, userData, date) {
    this.title = carSetupData.title;
    this.carModel = carSetupData.carModel;
    this.track = carSetupData.track;
    this.motor = carSetupData.motor;
    this.battery = carSetupData.battery;
    this.tires = carSetupData.tires;
    this.pinion = +carSetupData.pinion;
    this.spur = +carSetupData.spur;
    this.transmission = carSetupData.transmission;
    this.frontSpring = carSetupData.frontSpring;
    this.frontShockOil = +carSetupData.frontShockOil;
    this.frontCamber = +carSetupData.frontCamber;
    this.frontToe = +carSetupData.frontToe;
    this.frontHeight = +carSetupData.frontHeight;
    this.frontDroop = +carSetupData.frontDroop;
    this.rearSpring = carSetupData.rearSpring;
    this.rearShockOil = +carSetupData.rearShockOil;
    this.rearCamber = +carSetupData.rearCamber;
    this.rearToe = +carSetupData.rearToe;
    this.rearHeight = +carSetupData.rearHeight;
    this.rearDroop = +carSetupData.rearDroop;
    this.note = carSetupData.note;
    this.privatePublic = carSetupData.privatePublic;
    this.userData = userData;
    this.image = carSetupData.image;
    this.updateImageData();
    this.date = new Date(date);
    if (userData._id) {
      this.userId = userData._id.toString();
    }
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US');
    }
    if (carSetupData._id) {
      this.id = carSetupData._id.toString();
    }
  }

  static async findAllByUserId(userId) {
    let uid;

    try {
      uid = new mongodb.ObjectId(userId);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const userCarSetups = await db
      .getDb()
      .collection('carSetup')
      .find({ 'userData._id': uid })
      .toArray();

    return userCarSetups.map((userCarSetup) => {
      return new Carsetup(
        userCarSetup,
        userCarSetup.userData,
        userCarSetup.date
      );
    });
  }

  static async findAllPublic() {
    const carSetups = await db
      .getDb()
      .collection('carSetup')
      .find({ privatePublic: 'public' })
      .toArray();

    return carSetups.map((carSetup) => {
      return new Carsetup(carSetup, carSetup.userData, carSetup.date);
    });
  }

  static async findById(id) {
    let setupId;

    try {
      setupId = mongodb.ObjectId(id);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const carSetup = await db
      .getDb()
      .collection('carSetup')
      .findOne({ _id: setupId });

    if (!carSetup) {
      const error = new Error('Could not find setup detail with provided id!');
      error.code = 404;
      throw error;
    }

    return new Carsetup(carSetup, carSetup.userData, carSetup.date);
  }

  updateImageData() {
    this.imagePath = `carSetupData/images/${this.image}`;
    this.imageUrl = `/cars/assets/images/${this.image}`;
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  async deleteImage(image) {
    await unlinkAsync(`carSetupData/images/${image}`);
  }

  async save() {
    const carSetupDocument = {
      title: this.title,
      carModel: this.carModel,
      track: this.track,
      motor: this.motor,
      battery: this.battery,
      tires: this.tires,
      pinion: this.pinion,
      spur: this.spur,
      transmission: this.transmission,
      frontSpring: this.frontSpring,
      frontShockOil: this.frontShockOil,
      frontCamber: this.frontCamber,
      frontToe: this.frontToe,
      frontHeight: this.frontHeight,
      frontDroop: this.frontDroop,
      rearSpring: this.rearSpring,
      rearShockOil: this.rearShockOil,
      rearCamber: this.rearCamber,
      rearToe: this.rearToe,
      rearHeight: this.rearHeight,
      rearDroop: this.rearDroop,
      note: this.note,
      privatePublic: this.privatePublic,
      userData: this.userData,
      image: this.image,
      date: new Date(),
    };

    if (this.id) {
      // This for updating
      const orderId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete carSetupDocument.image; // delete key value pair in carSetupDocument incase there were no updated image
      }

      await db
        .getDb()
        .collection('carSetup')
        .updateOne({ _id: orderId }, { $set: carSetupDocument });
    } else {
      // For new setup
      await db.getDb().collection('carSetup').insertOne(carSetupDocument);
    }
  }

  remove() {
    const carSetupId = new mongodb.ObjectId(this.id);
    return db.getDb().collection('carSetup').deleteOne({ _id: carSetupId });
  }
}

module.exports = Carsetup;

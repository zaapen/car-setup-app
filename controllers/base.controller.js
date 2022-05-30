const Carsetup = require('../models/carSetup.model');

const getAllPublicSetups = async (req, res, next) => {
  let carSetups;

  try {
    carSetups = await Carsetup.findAllPublic();
  } catch (error) {
    next(error);
    return;
  }

  res.render('all-car-setup', { userCarSetups: carSetups });
};

const getPubCarSetup = async (req, res, next) => {
  let carSetup;

  try {
    carSetup = await Carsetup.findById(req.params.id);

    const finalDriveRatio =
      (carSetup.spur / carSetup.pinion) * carSetup.transmission;

    res.render('car-setup-details', {
      carSetup: carSetup,
      fdr: finalDriveRatio.toFixed(2),
    });
  } catch (error) {
    next(error);
    return;
  }
};

module.exports = {
  getAllPublicSetups: getAllPublicSetups,
  getPubCarSetup: getPubCarSetup,
};

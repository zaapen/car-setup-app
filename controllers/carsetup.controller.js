const Carsetup = require('../models/carSetup.model');
const User = require('../models/user.model');

const carDetail = async (viewpage, req, res, next) => {
  try {
    const carSetup = await Carsetup.findById(req.params.id);
    // console.log(carSetup);
    const finalDriveRatio =
      (carSetup.spur / carSetup.pinion) * carSetup.transmission;
    res.render(viewpage, {
      carSetup: carSetup,
      fdr: finalDriveRatio.toFixed(2),
    });
  } catch (error) {
    next(error);
    return;
  }
};

const getUserDoc = async (res, next) => {
  let userDocument;

  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    next(error);
    return;
  }

  return userDocument;
};

// get all public car setups
// const getAllSetup = async (req, res, next) => {
//   let carSetups;
//   try {
//     carSetups = await Carsetup.findAllPublic();
//   } catch (error) {
//     next(error);
//     return;
//   }

//   res.render('all-car-setup', { userCarSetup: carSetups});
// };

// get all car setups from a single user
const getMySetup = async (req, res, next) => {
  const userId = res.locals.uid;

  let userCarSetups;
  try {
    userCarSetups = await Carsetup.findAllByUserId(userId);

    res.render('my-setups', { userCarSetups: userCarSetups });
  } catch (error) {
    next(error);
    return;
  }
};

// get car setup details
const getCarSetupDetails = async (req, res, next) => {
  carDetail('car-setup-details', req, res, next);
};

const getNewSetup = (req, res) => {
  res.render('new-setup');
};

const createNewSetup = async (req, res, next) => {
  const userDocument = await getUserDoc(res, next);

  const carSetup = new Carsetup(
    {
      ...req.body,
      image: req.file.filename,
    },
    userDocument
  );

  try {
    carSetup.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/mysetups');
};

const getCarUpdateSetup = (req, res, next) => {
  carDetail('edit-setup', req, res, next);
};

const updateCarSetup = async (req, res, next) => {
  const userDocument = await getUserDoc(res, next);

  const carSetup = new Carsetup(
    {
      ...req.body,
      _id: req.params.id,
    },
    userDocument
  );

  if (req.file) {
    const prevCarSetup = await Carsetup.findById(req.params.id);
    carSetup.deleteImage(prevCarSetup.image);
    carSetup.replaceImage(req.file.filename);
  }

  try {
    await carSetup.save();
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }

  res.redirect('/mysetups');
};

const deleteCarSetup = async (req, res, next) => {
  let carSetup;

  try {
    carSetup = await Carsetup.findById(req.params.id);
    carSetup.deleteImage(carSetup.image);
    carSetup.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Deleted car setup!' });
};

module.exports = {
  // getAllSetup: getAllSetup,
  getMySetup: getMySetup,
  getNewSetup: getNewSetup,
  createNewSetup: createNewSetup,
  getCarSetupDetails: getCarSetupDetails,
  getCarUpdateSetup: getCarUpdateSetup,
  updateCarSetup: updateCarSetup,
  deleteCarSetup: deleteCarSetup,
};

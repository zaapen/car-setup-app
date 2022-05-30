const User = require('../models/user.model');
const validation = require('../util/validation');
const authentication = require('../util/authentication');
const sessionFlash = require('../util/session-flash');

const getSignup = (req, res) => {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    };
  }

  res.render('auth/signup.ejs', { inputData: sessionData });
};

const signup = async (req, res, next) => {
  const enteredData = {
    email: req.body.email,
    fullName: req.body.fullName,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  if (
    !validation.userDataAreValid(
      req.body.email,
      req.body.password,
      req.body.fullName
    ) ||
    !validation.passwordIsConfirmed(req.body.password, req.body.confirmPassword)
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: 'Please check your input!',
        ...enteredData,
      },
      () => {
        res.redirect('/signup');
      }
    );
    return;
  }

  const user = new User(req.body.email, req.body.password, req.body.fullName);

  try {
    const existAlready = await user.existAlready();

    if (existAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User exists already',
          ...enteredData,
        },
        () => {
          res.redirect('/signup');
        }
      );
      return;
    }
  } catch (error) {
    next(error);
    return;
  }

  await user.signup();

  res.redirect('/login');
};

const getLogin = (req, res) => {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    };
  }

  res.render('auth/login.ejs', { inputData: sessionData });
};

const login = async (req, res, next) => {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = new User(req.body.email, req.body.password);

  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  if (!existingUser) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: 'User does not exist. Please sign up.',
        ...enteredData,
      },
      () => {
        res.redirect('/login');
      }
    );
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: 'Please check your credential!',
        ...enteredData,
      },
      () => {
        res.redirect('/login');
      }
    );
    return;
  }

  authentication.createUserSession(req, existingUser, () => {
    res.redirect('/');
  });
};

const logout = (req, res) => {
  authentication.destroyUserAuthSession(req);
  res.redirect('/login');
};

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};

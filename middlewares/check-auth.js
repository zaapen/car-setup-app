const checkAuthStatus = (req, res, next) => {
  const uid = req.session.uid;

  if (!uid) {
    res.locals.isAuth = false;
    return next();
  }

  res.locals.uid = uid;
  res.locals.isAuth = true;
  next();
}

module.exports = checkAuthStatus;
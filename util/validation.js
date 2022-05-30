const isEmpty = (value) => {
  return !value || value.trim() === '';
};

const userCredentialsAreValid = (email, password) => {
  return email && email.includes('@') && password && password.trim().length >= 6;
};

const passwordIsConfirmed = (password, confirmPassword) => {
  return password === confirmPassword;
};

const userDataAreValid = (email, password, fullname) => {
  return userCredentialsAreValid(email, password) && !isEmpty(fullname);
};

module.exports = {
  passwordIsConfirmed: passwordIsConfirmed,
  userDataAreValid: userDataAreValid,
  userCredentialsAreValid: userCredentialsAreValid
}

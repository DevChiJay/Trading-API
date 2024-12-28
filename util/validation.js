function isEmpty(value) {
  return !value || value.trim() === '';
}

function userCredentialsAreValid(username, password, email) {
  return (
    !isEmpty(username) &&
    email &&
    email.includes('@') &&
    password &&
    password.trim().length >= 6
  );
}

function userDetailsAreValid(username, password, email) {
  return userCredentialsAreValid(username, password, email);
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
};

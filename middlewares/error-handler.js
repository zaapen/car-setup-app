const handleInvalidRoutes = (req, res) => {
  res.status(400).render('./shared/errorView', { errorType: '400'})
}

const handleErrors = (error, req, res, next) => {
  console.log(error);
  res.status(500).render('./shared/errorView', { errorType: '500'})
}

module.exports = {handleErrors, handleInvalidRoutes};
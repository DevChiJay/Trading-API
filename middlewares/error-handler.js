function handleErrors(error, req, res, next) {
  console.error("An error occurred while performing an operation:", err);

  if (error.code === 404) {
    return res.status(404).json("404 Error");
  }
  return res.status(500).json({
    error: "Internal server error",
    details: error.message || error, // Include detailed error information
  });
}

module.exports = handleErrors;

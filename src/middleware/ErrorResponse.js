const ErrorResponse = (err, req, res, next) => {
  return res.json({
    success: false,
    err
  });
};

export {
  ErrorResponse
}

const isAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res
      .status(403)
      .send({ success: false, message: "Only admin can do this" });
  }
  next();
};

module.exports = isAdmin;

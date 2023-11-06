const router = require("express").Router();

const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect('/auth/login')
  }
}

router.get("/", authCheck, (req, res) => {
  return res.render("profile", { user: req.user });
});

module.exports = router;

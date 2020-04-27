exports.getHomePage = (req, res) => {
  res.status(200).render('index');
};

exports.getSignup = (req, res) => {
  res.status(200).render('signup');
};

exports.getLogin = (req, res) => {
  res.status(200).render('login');
};

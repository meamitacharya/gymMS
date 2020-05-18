exports.getHomePage = (req, res) => {
  res.status(200).render('index', {
    title: 'Gymaholic | Home Page'
  });
};

exports.getGymAdminDashboard = (req, res) => {
  res.status(200).render('gymadmin/base-admin', {
    title: 'Gymaholic | Gym Admin Dashboard'
  });
};

exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'Gymaholic | Login Page'
  });
};

exports.getSignUp = (req, res) => {
  res.status(200).render('signup', {
    title: 'Gymaholic | Signup Page'
  });
};

exports.getSignupVerification = (req, res) => {
  res.status(200).render('./verification/verification', {
    title: 'Gymaholic | Mail Sent for Verification'
  });
};
exports.getNotActive = (req, res) => {
  res.status(200).render('./verification/accountNotActive', {
    title: `Gymaholic | Account Not Active`
  });
};

exports.getAccountActive = (req, res) => {
  res.status(200).render('./verification/accountActive', {
    title: 'Gymaholic  | Account Activated'
  });
};

exports.getForgotPassword = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Gymaholic  | Forgot Password'
  });
};

exports.getResetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Gymaholic  | Reset Password'
  });
};

exports.getErrorPage = (req, res) => {
  res.status(200).render('error');
};

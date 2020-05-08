import { showAlert } from './alert.js';

const el = document.querySelector('.reset-form');

if (el) {
  el.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const passwordResetToken = document.getElementById('passwordResetToken')
      .value;

    resetPassword(email, password, passwordConfirm, passwordResetToken);
  });
}

const resetPassword = async (
  email,
  password,
  passwordConfirm,
  passwordResetToken
) => {
  try {
    const res = await axios({
      method: 'patch',
      url: 'http://localhost:8085/api/v1/users/resetPassword',
      data: {
        email,
        password,
        passwordConfirm,
        passwordResetToken
      }
    });

    if (res.data.status === 'sucess') {
      showAlert('success', 'Password Reset Sucessfully');
      window.setTimeout(() => {
        location.assign('/login');
      }, 3000);
    } else {
      location.assign('/resetPassword');
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
    // console.log(err.response.data.message);
  }
};

import { showAlert } from './alert.js';

const el = document.querySelector('.forgot-form');

if (el) {
  el.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}

const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:8085/api/v1/users/forgotPassword',
      data: {
        email
      }
    });
    if (res.data.status === 'sucess') {
      showAlert('success', 'Reset Token Sent Sucessfully');
      window.setTimeout(() => {
        location.assign('/resetPassword');
      }, 3000);
    } else {
      location.assign('/forgotPassword');
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

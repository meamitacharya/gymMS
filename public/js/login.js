import { showAlert } from './alert.js';

document.querySelector('.login-form').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:8085/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'sucess') {
      showAlert('success', 'Logged In Sucessfully');
      window.setTimeout(() => {
        location.assign('/gymadmin');
      }, 3000);
    } else {
      location.assign('/accountNotActivated');
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
    // console.log(err.response.data.message);
  }
};

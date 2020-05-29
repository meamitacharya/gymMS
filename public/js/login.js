import { showAlert } from './alert.js';

document.querySelector('.login-form').addEventListener('submit', async e => {
  e.preventDefault();

  document.querySelector('.login-button').textContent = 'Logging in ....';
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  await login(email, password);

  document.querySelector('.login-button').textContent = 'Login';
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
      }, 1500);
    } else {
      location.assign('/accountNotActivated');
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
    // console.log(err.response.data.message);
  }
};

import { showAlert } from './alert.js';

document.querySelector('.signup-form').addEventListener('submit', async e => {
  e.preventDefault();

  document.querySelector('.signup-button').textContent = 'Creating Account....';
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;

  await signup(firstName, lastName, email, password, passwordConfirm);
  document.querySelector('.signup-button').textContent = 'Register Account';
});

const signup = async (
  firstName,
  lastName,
  email,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:8085/api/v1/users/signup',
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm
      }
    });

    if (res.data.status === 'sucess') {
      showAlert('success', 'Account created successfully');
      window.setTimeout(() => {
        location.assign('/verification');
      }, 1500);
    } else {
      location.assign('/signup');
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

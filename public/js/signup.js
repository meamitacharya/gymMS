import { showAlert } from './alert.js';

document.querySelector('.signup-form').addEventListener('submit', e => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const address = document.getElementById('address').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  const panVatNumber = document.getElementById('panVatNumber').value;

  signup(
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    password,
    passwordConfirm,
    panVatNumber
  );
});

const signup = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  address,
  password,
  passwordConfirm,
  panVatNumber
) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:8085/api/v1/users/signup',
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        password: password,
        passwordConfirm: passwordConfirm,
        panVatNumber: panVatNumber
      }
    });

    if (res.data.status === 'sucess') {
      showAlert('success', 'Account created successfully');
      window.setTimeout(() => {
        location.assign('/verification');
      }, 3000);
    } else {
      location.assign('/signup');
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

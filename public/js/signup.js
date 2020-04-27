document.querySelector('.signup-form').addEventListener('submit', e => {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const address = document.getElementById('address').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  const vatNumber = document.getElementById('vatNumber').value;

  console.log(vatNumber);
  signup(
    fullName,
    email,
    phoneNumber,
    address,
    password,
    passwordConfirm,
    vatNumber
  );
});

const signup = async (
  fullName,
  email,
  phoneNumber,
  address,
  password,
  passwordConfirm,
  vatNumber
) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:8085/api/v1/users/signup',
      data: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        password: password,
        passwordConfirm: passwordConfirm,
        vatNumber: vatNumber
      }
    });
    console.log(res);
    if (res.data.status === 'sucess') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      location.assign('/signup');
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};

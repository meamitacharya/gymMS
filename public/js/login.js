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
      url: 'http://127.0.0.1:8085/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'sucess') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      location.assign('/login');
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};

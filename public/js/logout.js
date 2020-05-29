const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8085/api/v1/users/logout'
    });
    if (res.data.status === 'sucess') {
      location.reload(true);
      location.assign('/');
    }
  } catch (err) {
    alert('Error logging out');
  }
};

const el = document.querySelector('.logOut');

if (el) {
  el.addEventListener('click', logout);
}

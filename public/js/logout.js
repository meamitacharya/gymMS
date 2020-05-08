const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8085/api/v1/users/logout'
    });
    if (res.data.status === 'sucess') location.reload(true);
  } catch (err) {
    alert('Error logging out');
  }
};

document.querySelector('.logOut').addEventListener('click', logout);
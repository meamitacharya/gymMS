const el = document.querySelector('.deleteButton');

const deleteGym = async => {
  // try {
  //   const res = await axios({
  //     method: 'DELETE',
  //     url: `http://localhost:8085/api/v1/gyms/${id}`
  //   });
  //   if (res.data.status === 'sucess') {
  //     location.reload(true);
  //     location.assign('gymadmin/gyms');
  //   }
  // } catch (err) {
  //   alert('Error logging out');
  // }
  console.log();
};

if (el) {
  const value = document.getElementById('gymValue').getAttribute('href');

  el.addEventListener('click', deleteGym());
}

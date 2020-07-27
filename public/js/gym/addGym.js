const el = document.querySelector('.createGym-form');

if (el) {
  el.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const gymLocation = document.getElementById('gymLocation').value;
    const price = document.getElementById('price').value;
    const summary = document.getElementById('summary').value;
    addNewGym(name, gymLocation, price, summary);
  });
}
const addNewGym = async (name, gymLocation, price, summary) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:8085/api/v1/gyms',
      data: {
        name,
        gymLocation,
        price,
        summary
      }
    });

    if (res.data.status === 'sucess') {
      location.assign('/gymadmin/gyms');
    } else {
      location.assign('/gymadmin/addGym');
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};

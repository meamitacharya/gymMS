const el = document.querySelector('.editGym-form');

if (el) {
  el.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const gymLocation = document.getElementById('gymLocation').value;
    const price = document.getElementById('price').value;
    const summary = document.getElementById('summary').value;
    const gymId = document.getElementById('gymId').value;
    const gymSlug = document.getElementById('gymSlug').value;
    editGym(name, gymLocation, price, summary, gymId, gymSlug);
  });
}
const editGym = async (name, gymLocation, price, summary, gymId, gymSlug) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `http://localhost:8085/api/v1/gyms/${gymId}`,
      data: {
        name,
        gymLocation,
        price,
        summary
      }
    });

    if (res.data.status === 'sucess') {
      window.setTimeout(() => {
        location.assign('/gymadmin/gyms');
      }, 1000);
    } else {
      location.assign(`/gymadmin/gyms/edit/${gymSlug}`);
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};

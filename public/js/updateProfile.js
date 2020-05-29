import { showAlert } from './alert.js';

const profileForm = document.querySelector('.profile-form');

if (profileForm) {
  profileForm.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.update-button').textContent = 'Updating ...';
    const form = new FormData();
    form.append('phoneNumber', document.getElementById('phoneNumber').value);
    form.append('address', document.getElementById('address').value);
    form.append('panVatNumber', document.getElementById('panVatNumber').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateProfile(form);
  });
}

const updateProfile = async data => {
  try {
    console.log(data);
    const res = await axios({
      method: 'patch',
      url: 'http://localhost:8085/api/v1/users/updateMe',
      data
    });

    if (res.data.status === 'sucess') {
      showAlert('success', 'Profile updated Sucessfully');
      window.setTimeout(() => {
        location.assign('/profile');
      }, 1000);
    } else {
      location.assign('/');
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

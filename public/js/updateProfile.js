import { showAlert } from './alert.js';

const el = document.querySelector('.profile-form');

if (el) {
  el.addEventListener('submit', e => {
    e.preventDefault();

    const phoneNumber = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;

    console.log(phoneNumber);
    // updateProfile(phoneNumber, address);
  });
}

const updateProfile = async (phoneNumber, address) => {
  console.log('clicked');
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:8085/api/v1/users/updateMe',
      data: {
        phoneNumber,
        address
      }
    });
    if (res.data.status === 'sucess') {
      showAlert('success', 'Profile updated Sucessfully');
      window.setTimeout(() => {
        location.assign('/profile');
      }, 3000);
    } else {
      location.assign('/profile');
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

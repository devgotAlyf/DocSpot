import axios from 'axios';

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:4000/api/admin/login', {
      email: 'admin@docspot.com',
      password: 'adminpassword'
    });
    const token = loginRes.data.token;
    console.log('Token acquired');

    const headers = { aToken: token };

    const tests = [
      '/api/admin/all-doctors',
      '/api/admin/appointments',
      '/api/admin/dashboard'
    ];

    for (const path of tests) {
      try {
        console.log(`Testing ${path}...`);
        await axios.get(`http://localhost:4000${path}`, { headers });
        console.log(`[OK] ${path}`);
      } catch (err) {
        if (err.response) {
          console.error(`[ERROR] ${path}: ${err.response.status}`);
        } else {
          console.error(`[ERROR] ${path}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.error('Fatal:', err.message);
  }
}

test();

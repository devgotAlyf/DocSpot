const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:4000/api/user/register', { name: 'test', email: 'test@test.com', password: 'password123' });
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.error("ERROR MESSAGE:", err.message);
    console.error("ERROR CODE:", err.code);
  }
}
test();

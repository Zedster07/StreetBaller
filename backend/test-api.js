// Quick API tests
const http = require('http');

function makeRequest(method, path, body, authToken) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': bodyStr.length,
      },
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing StreetBaller API Endpoints\n');

  try {
    // Test 1: Register user with unique email
    const timestamp = Date.now();
    console.log('1️⃣  Testing POST /api/auth/register');
    const registerRes = await makeRequest('POST', '/api/auth/register', {
      email: `testuser-${timestamp}@example.com`,
      firebaseUid: `uid-test-${timestamp}`,
    });
    console.log(`Status: ${registerRes.status}`);
    if (registerRes.status === 201 || registerRes.status === 200) {
      console.log(`✅ User created:`, registerRes.body.data?.email);
      const userId = registerRes.body.data?.firebaseUid;

      // Test 2: Create team with auth
      console.log('\n2️⃣  Testing POST /api/teams');
      const teamRes = await makeRequest(
        'POST',
        '/api/teams',
        {
          name: `Team-${timestamp}`,
          description: 'Test team for API verification',
          primaryColor: '#FF5733',
          formation: '4-3-3',
        },
        userId
      );
      console.log(`Status: ${teamRes.status}`);
      if (teamRes.status === 201) {
        console.log(`✅ Team created:`, teamRes.body.data?.name);
        const teamId = teamRes.body.data?.id;

        // Test 3: Get team
        if (teamId) {
          console.log('\n3️⃣  Testing GET /api/teams/:id');
          const getTeamRes = await makeRequest('GET', `/api/teams/${teamId}`, {});
          console.log(`Status: ${getTeamRes.status}`);
          if (getTeamRes.status === 200) {
            console.log(`✅ Retrieved team:`, getTeamRes.body.data?.name);
          } else {
            console.log(`❌ Failed:`, getTeamRes.body);
          }
        }
      } else {
        console.log(`❌ Failed:`, teamRes.body);
      }
    } else {
      console.log(`❌ Registration failed:`, registerRes.body);
    }

    // Test 4: Health check
    console.log('\n4️⃣  Testing GET /health');
    const healthRes = await makeRequest('GET', '/health', {});
    console.log(`Status: ${healthRes.status}`);
    console.log(`✅ Health:`, healthRes.body);

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTests();

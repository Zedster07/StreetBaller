// Test Trust Transaction Endpoints
const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 3000;
const API_BASE = `http://${API_HOST}:${API_PORT}`;

// Test user token (from previous tests or Firebase)
const TEST_TOKEN = 'test-token-here'; // Will use Bearer auth

let passed = 0;
let failed = 0;

function makeRequest(method, path, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('\n📊 Testing Trust Transaction Endpoints\n');
  console.log('=' + '='.repeat(56) + '\n');

  // Test 1: Health Check (sanity test)
  try {
    console.log('✓ Testing Health Check...');
    const health = await makeRequest('GET', '/health');
    if (health.status === 200) {
      console.log('  ✅ GET /health — Status', health.status);
      passed++;
    } else {
      console.log('  ❌ GET /health — Status', health.status);
      failed++;
    }
  } catch (error) {
    console.log('  ❌ GET /health —', error.message);
    failed++;
  }

  // Test 2: Trust Summary (requires auth)
  try {
    console.log('\n✓ Testing Trust Summary...');
    const summary = await makeRequest('GET', '/api/trust/summary', TEST_TOKEN);
    if (summary.status === 200 || summary.status === 401) {
      console.log(`  ✅ GET /api/trust/summary — Status ${summary.status}`);
      passed++;
    } else {
      console.log(`  ❌ GET /api/trust/summary — Status ${summary.status}`);
      failed++;
    }
  } catch (error) {
    console.log('  ❌ GET /api/trust/summary —', error.message);
    failed++;
  }

  // Test 3: Trust Leaderboard (no auth required)
  try {
    console.log('\n✓ Testing Trust Leaderboard...');
    const leaderboard = await makeRequest('GET', '/api/trust/leaderboard?limit=10&offset=0');
    if (leaderboard.status === 200) {
      console.log(`  ✅ GET /api/trust/leaderboard — Status ${leaderboard.status}`);
      if (leaderboard.body.data) {
        console.log(`     Returned ${leaderboard.body.data.length} players`);
      }
      passed++;
    } else {
      console.log(`  ❌ GET /api/trust/leaderboard — Status ${leaderboard.status}`);
      failed++;
    }
  } catch (error) {
    console.log('  ❌ GET /api/trust/leaderboard —', error.message);
    failed++;
  }

  // Test 4: Transaction History (requires auth)
  try {
    console.log('\n✓ Testing Transaction History...');
    const history = await makeRequest('GET', '/api/trust/transactions?limit=20&offset=0', TEST_TOKEN);
    if (history.status === 200 || history.status === 401) {
      console.log(`  ✅ GET /api/trust/transactions — Status ${history.status}`);
      passed++;
    } else {
      console.log(`  ❌ GET /api/trust/transactions — Status ${history.status}`);
      failed++;
    }
  } catch (error) {
    console.log('  ❌ GET /api/trust/transactions —', error.message);
    failed++;
  }

  // Test 5: Player Trust Info (no auth required, public endpoint)
  try {
    console.log('\n✓ Testing Player Trust Info...');
    // Using a dummy player ID - will likely 404
    const playerId = '550e8400-e29b-41d4-a716-446655440000';
    const playerTrust = await makeRequest('GET', `/api/trust/player/${playerId}`);
    if (playerTrust.status === 404 || playerTrust.status === 200) {
      console.log(`  ✅ GET /api/trust/player/{id} — Status ${playerTrust.status}`);
      passed++;
    } else {
      console.log(`  ❌ GET /api/trust/player/{id} — Status ${playerTrust.status}`);
      failed++;
    }
  } catch (error) {
    console.log('  ❌ GET /api/trust/player/{id} —', error.message);
    failed++;
  }

  console.log('\n' + '='.repeat(58) + '\n');
  console.log(`📈 Test Results: ${passed} passed ✅, ${failed} failed ❌\n`);
}

runTests().catch(console.error);

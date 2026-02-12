// Test Leaderboard Endpoints
const http = require('http');

const BASE_URL = 'http://localhost:3000';
const tests = [];
let passed = 0;
let failed = 0;

function makeRequest(pathname, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: pathname,
      method: method,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('\n📊 Testing Leaderboard Endpoints\n');
  console.log('='.repeat(60));

  try {
    // Test health endpoint first
    console.log('\n✓ Testing Health Check...');
    const health = await makeRequest('/health');
    if (health.status === 200) {
      console.log('  ✅ GET /health — Status 200');
      passed++;
    } else {
      console.log(`  ❌ GET /health — Status ${health.status}`);
      failed++;
    }

    // Test leaderboard summary endpoint
    console.log('\n✓ Testing Leaderboard Summary...');
    const summary = await makeRequest('/api/leaderboards');
    if (summary.status === 200) {
      console.log('  ✅ GET /api/leaderboards — Status 200');
      if (summary.body.topPlayersByRating) {
        console.log(`     - topPlayersByRating: ${summary.body.topPlayersByRating.length} players`);
      }
      if (summary.body.topTeams) {
        console.log(`     - topTeams: ${summary.body.topTeams.length} teams`);
      }
      passed++;
    } else {
      console.log(`  ❌ GET /api/leaderboards — Status ${summary.status}`);
      failed++;
    }

    // Test players leaderboard
    console.log('\n✓ Testing Players Leaderboard...');
    const players = await makeRequest('/api/leaderboards/players?limit=10&offset=0');
    if (players.status === 200) {
      console.log('  ✅ GET /api/leaderboards/players — Status 200');
      console.log(`     - Retrieved ${players.body.data?.length || 0} players`);
      passed++;
    } else {
      console.log(`  ❌ GET /api/leaderboards/players — Status ${players.status}`);
      failed++;
    }

    // Test goals leaderboard
    console.log('\n✓ Testing Goals Leaderboard...');
    const goals = await makeRequest('/api/leaderboards/players/goals?limit=10');
    if (goals.status === 200) {
      console.log('  ✅ GET /api/leaderboards/players/goals — Status 200');
      console.log(`     - Retrieved ${goals.body.data?.length || 0} goal scorers`);
      passed++;
    } else {
      console.log(`  ❌ GET /api/leaderboards/players/goals — Status ${goals.status}`);
      failed++;
    }

    // Test assists leaderboard
    console.log('\n✓ Testing Assists Leaderboard...');
    const assists = await makeRequest('/api/leaderboards/players/assists?limit=10');
    if (assists.status === 200) {
      console.log('  ✅ GET /api/leaderboards/players/assists — Status 200');
      console.log(`     - Retrieved ${assists.body.data?.length || 0} playmakers`);
      passed++;
    } else {
      console.log(`  ❌ GET /api/leaderboards/players/assists — Status ${assists.status}`);
      failed++;
    }

    // Test wins leaderboard
    console.log('\n✓ Testing Wins Leaderboard...');
    const wins = await makeRequest('/api/leaderboards/players/wins?limit=10');
    if (wins.status === 200) {
      console.log('  ✅ GET /api/leaderboards/players/wins — Status 200');
      console.log(`     - Retrieved ${wins.body.data?.length || 0} top winners`);
      passed++;
    } else {
      console.log(`  ❌ GET /api/leaderboards/players/wins — Status ${wins.status}`);
      failed++;
    }

    // Test teams leaderboard
    console.log('\n✓ Testing Teams Leaderboard...');
    const teams = await makeRequest('/api/leaderboards/teams?limit=10');
    if (teams.status === 200) {
      console.log('  ✅ GET /api/leaderboards/teams — Status 200');
      console.log(`     - Retrieved ${teams.body.data?.length || 0} teams`);
      passed++;
    } else {
      console.log(`  ❌ GET /api/leaderboards/teams — Status ${teams.status}`);
      failed++;
    }

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    failed++;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📈 Test Results: ${passed} passed ✅, ${failed} failed ❌\n`);
  process.exit(failed > 0 ? 1 : 0);
}

// Wait a moment for server to start, then run tests
setTimeout(runTests, 2000);

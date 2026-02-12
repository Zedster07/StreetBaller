/**
 * Manual test file for Match Event API endpoints
 * Run: node test-match-events.js
 * Note: Requires server running on port 3000
 */

const BASE_URL = 'http://localhost:3000';

async function testMatchEventAPI() {
  console.log('\n=== Match Event API Manual Tests ===\n');

  try {
    // Test 1: Get match events
    console.log('TEST 1: GET /api/match-events/:matchId');
    const matchId = 'test-match-1'; // Replace with real match ID
    const eventsResponse = await fetch(`${BASE_URL}/api/match-events/${matchId}?limit=10&offset=0`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token', // Replace with real token
        'Content-Type': 'application/json',
      },
    });

    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json();
      console.log('✅ SUCCESS - Match events retrieved');
      console.log('Response:', JSON.stringify(eventsData, null, 2).substring(0, 200) + '...\n');
    } else {
      console.log('❌ FAILED -', eventsResponse.status, await eventsResponse.text());
    }

    // Test 2: Get match stats
    console.log('TEST 2: GET /api/match-events/:matchId/stats');
    const statsResponse = await fetch(`${BASE_URL}/api/match-events/${matchId}/stats`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ SUCCESS - Match stats retrieved');
      console.log('Response:', JSON.stringify(statsData, null, 2).substring(0, 200) + '...\n');
    } else {
      console.log('❌ FAILED -', statsResponse.status, await statsResponse.text());
    }

    // Test 3: Get player event history
    console.log('TEST 3: GET /api/match-events/player/:playerId');
    const playerId = 'test-player-1'; // Replace with real player ID
    const historyResponse = await fetch(`${BASE_URL}/api/match-events/player/${playerId}?limit=10&offset=0`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });

    if (historyResponse.ok) {
      const historyData = await historyResponse.json();
      console.log('✅ SUCCESS - Player history retrieved');
      console.log('Response:', JSON.stringify(historyData, null, 2).substring(0, 200) + '...\n');
    } else {
      console.log('❌ FAILED -', historyResponse.status, await historyResponse.text());
    }

    // Test 4: Get player events in match
    console.log('TEST 4: GET /api/match-events/:matchId/player/:playerId');
    const playerMatchResponse = await fetch(
      `${BASE_URL}/api/match-events/${matchId}/player/${playerId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      }
    );

    if (playerMatchResponse.ok) {
      const playerMatchData = await playerMatchResponse.json();
      console.log('✅ SUCCESS - Player match events retrieved');
      console.log('Response:', JSON.stringify(playerMatchData, null, 2).substring(0, 200) + '...\n');
    } else {
      console.log('❌ FAILED -', playerMatchResponse.status, await playerMatchResponse.text());
    }

    console.log('=== Test Suite Complete ===\n');
  } catch (error) {
    console.error('ERROR:', error.message);
    console.log('Make sure the API server is running on port 3000\n');
  }
}

// Run tests
testMatchEventAPI();

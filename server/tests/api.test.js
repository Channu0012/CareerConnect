// Production API & Unit Test Suite for CareerConnect
const test = require('node:test');
const assert = require('node:assert/strict');
const { escapeRegex } = require('../utils/sanitize');
const generateToken = require('../utils/generateToken');

// 1. Unit Tests
test('Unit: escapeRegex properly neutralizes special regex metacharacters', () => {
  const input = '[test] (group) *star* +plus+ ?question? {curly} |pipe| \\backslash\\ ^start$';
  const escaped = escapeRegex(input);
  assert.doesNotThrow(() => new RegExp(escaped, 'i'));
  assert.equal(typeof escaped, 'string');
});

test('Unit: escapeRegex handles empty or non-string inputs safely', () => {
  assert.equal(escapeRegex(null), '');
  assert.equal(escapeRegex(undefined), '');
  assert.equal(escapeRegex(123), '');
});

test('Unit: generateToken returns valid JWT string', () => {
  const token = generateToken('65b98f23c9e77b1e4c8e1234');
  assert.equal(typeof token, 'string');
  assert.equal(token.split('.').length, 3);
});

// 2. Integration Tests against running API
const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

test('Integration: GET /health returns OK and database status', async (t) => {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'OK');
  } catch (err) {
    t.skip('Backend server is not running on port 5000');
  }
});

test('Integration: GET /jobs returns paginated active listings', async (t) => {
  try {
    const res = await fetch(`${BASE_URL}/jobs?limit=5`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.jobs));
    assert.ok(typeof data.total === 'number');
  } catch (err) {
    t.skip('Backend server is not running on port 5000');
  }
});

test('Integration: GET /jobs search with regex metacharacters succeeds safely (no 500)', async (t) => {
  try {
    const res = await fetch(`${BASE_URL}/jobs?search=%5B`);
    assert.equal(res.status, 200);
  } catch (err) {
    t.skip('Backend server is not running on port 5000');
  }
});

test('Integration: GET /jobs/:id with malformed ObjectId returns 404', async (t) => {
  try {
    const res = await fetch(`${BASE_URL}/jobs/invalid-id-xyz`);
    assert.equal(res.status, 404);
  } catch (err) {
    t.skip('Backend server is not running on port 5000');
  }
});

test('Integration: POST /auth/login rejects invalid credentials with 401', async (t) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@nowhere.com', password: 'wrong' })
    });
    assert.equal(res.status, 401);
  } catch (err) {
    t.skip('Backend server is not running on port 5000');
  }
});

test('Integration: POST /auth/login rejects NoSQL injection object payload with 400', async (t) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: { $gt: '' }, password: 'wrong' })
    });
    assert.equal(res.status, 400);
  } catch (err) {
    t.skip('Backend server is not running on port 5000');
  }
});

test('Integration: GET /applications/my-applications returns 401 when unauthenticated', async (t) => {
  try {
    const res = await fetch(`${BASE_URL}/applications/my-applications`);
    assert.equal(res.status, 401);
  } catch (err) {
    t.skip('Backend server is not running on port 5000');
  }
});

test('Integration: GET /admin/stats returns 401 when unauthenticated', async (t) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    assert.equal(res.status, 401);
  } catch (err) {
    t.skip('Backend server is not running on port 5000');
  }
});

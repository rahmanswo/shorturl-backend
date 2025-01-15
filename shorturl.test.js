import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 1 }, // Ramp-up to 10 users over 1 minute
    // { duration: '2m', target: 10 }, // Stay at 10 users for 2 minutes
    // { duration: '1m', target: 0 },  // Ramp-down to 0 users over 1 minute
  ],
};

const BASE_URL = 'http://localhost:3000'; // Update with your app's base URL

export default function () {
  // Test the POST /api/shorturl/ endpoint
  const urlData = JSON.stringify({ url: `https://tkjpedia.com/` });
  const headers = { 'Content-Type': 'application/json' };


  const postResponse = http.post(`${BASE_URL}/api/shorturl/`, urlData, { headers });
  check(postResponse, {
    'POST /api/shorturl/ status is 200': (res) => res.status === 200,
    'Response contains short_url': (res) => JSON.parse(res.body).short_url !== undefined,
  });

  if (postResponse.status === 200) {
    const shortUrl = JSON.parse(postResponse.body).short_url;

    // Test the GET /:url endpoint using the generated short URL
    const getResponse = http.get(`${BASE_URL}/${shortUrl}`);
    check(getResponse, {
      'GET /:url status is 200 or redirect': (res) => res.status === 200 || res.status === 302,
    });
  }

  // Test with an invalid URL
  const invalidUrlData = JSON.stringify({ url: 'invalid-url' });
  const invalidResponse = http.post(`${BASE_URL}/api/shorturl/`, invalidUrlData, { headers });
  check(invalidResponse, {
    'POST /api/shorturl/ with invalid URL returns 400': (res) => res.status === 400,
  });

  sleep(1);
}

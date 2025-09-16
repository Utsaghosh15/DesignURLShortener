import http from 'k6/http';
import { check, sleep } from 'k6';

// Load configuration
const config = JSON.parse(open('./env.json'));

// Test settings - 10 users for 30 seconds
export const options = {
  vus: 3000,        // 10 virtual users (people)
  duration: '30s' // Run for 30 seconds
};

// Store short codes we create
let shortCodes = [];

export default function() {
  // Random number between 0 and 1
  const random = Math.random();
  
  if (random < 0.3) {
    // 30% chance: Create a new short URL
    createUrl();
  } else {
    // 70% chance: Redirect to existing short URL
    redirectUrl();
  }
  
  // Wait 1 second before next request
  sleep(1);
}

function createUrl() {
  // Pick a random URL from our test list
  const randomUrl = config.testUrls[Math.floor(Math.random() * config.testUrls.length)];
  
  // Prepare the data to send
  const data = JSON.stringify({
    url: randomUrl
  });
  
  // Send POST request to create URL
  const response = http.post(`${config.baseUrl}/api/createURL`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  // Check if the request was successful
  const success = check(response, {
    'Create URL - Status 200': (r) => r.status === 200,
    'Create URL - Has shortCode': (r) => {
      if (r.status === 200) {
        const body = JSON.parse(r.body);
        return body.shortURL && body.shortURL.length > 0;
      }
      return false;
    }
  });
  
  // If successful, save the short code for redirect testing
  if (success && response.status === 200) {
    const body = JSON.parse(response.body);
    if (body.shortURL) {
      // Extract shortCode from shortURL
      // shortURL = "http://localhost:3000/api/getURL/abc123"
      // We need just "abc123"
      const shortCode = body.shortURL.split('/').pop(); // Gets the last part after the last "/"
      shortCodes.push(shortCode);
    }
  }
}

function redirectUrl() {
  // If we have short codes, use one of them
  if (shortCodes.length > 0) {
    const randomShortCode = shortCodes[Math.floor(Math.random() * shortCodes.length)];
    
    // Send GET request to redirect
    const response = http.get(`${config.baseUrl}/api/getURL/kw854p`, {
        redirects: 0,
        maxRedirects: 0,
        followRedirects: false 
    });

    // console.log(`Status: ${response.status}`);
    // console.log(`Headers: ${JSON.stringify(response.headers)}`);
    
    // Check if redirect was successful
    check(response, {
      'Redirect - Status 302': (r) => r.status === 302,
      'Redirect - Has Location header': (r) => r.headers.Location && r.headers.Location.length > 0
    });
  }
}
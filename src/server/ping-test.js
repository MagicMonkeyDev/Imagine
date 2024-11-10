const dns = require('dns');
const { exec } = require('child_process');

// Extract hostname from your connection string
const hostname = 'cluster0.im9ba.mongodb.net';

console.log('Testing connectivity to MongoDB Atlas...');

// DNS lookup test
dns.resolve(hostname, (err, addresses) => {
  console.log('\nDNS Resolution Test:');
  if (err) {
    console.error('DNS lookup failed:', err);
  } else {
    console.log('DNS lookup successful:', addresses);
  }
});

// Ping test
exec(`ping ${hostname}`, (error, stdout, stderr) => {
  console.log('\nPing Test Results:');
  if (error) {
    console.log('Ping test failed:', error);
  } else {
    console.log(stdout);
  }
}); 
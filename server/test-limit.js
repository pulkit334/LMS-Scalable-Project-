const URL = 'https://bt792gm6-5000.inc1.devtunnels.ms/test-limit';

for (let i = 1; i <= 15; i++) {
  const res = await fetch(URL, { method: 'GET' });
  console.log(
    `Request ${i} → ${res.status} | Remaining: ${res.headers.get('x-ratelimit-remaining')}`
  );
}
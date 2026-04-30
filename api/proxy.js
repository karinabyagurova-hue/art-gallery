const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzi88tM8ryNSL2gCm8Xcx3kb5tHuhd7GwVy9rTXiBSGId2z3BM8Rs5cSOAhkdGEjZXHUw/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(APPS_SCRIPT_URL);
      const data = await response.json();
      res.status(200).json(data);
    } else if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      res.status(200).json(data);
    }
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}

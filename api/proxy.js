const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzi88tM8ryNSL2gCm8Xcx3kb5tHuhd7GwVy9rTXiBSGId2z3BM8Rs5cSOAhkdGEjZXHUw/exec';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    if (req.method === 'GET') {
      const response = await fetch(APPS_SCRIPT_URL);
      const data = await response.json();
      res.status(200).json(data);

    } else if (req.method === 'POST') {
      // Ensure body is a string for Apps Script
      const bodyStr = typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body);

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: bodyStr,
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow'
      });

      const text = await response.text();
      try {
        res.status(200).json(JSON.parse(text));
      } catch {
        res.status(200).json({ success: false, error: 'Bad response: ' + text.slice(0, 200) });
      }
    }
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}

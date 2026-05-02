const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzi88tM8ryNSL2gCm8Xcx3kb5tHuhd7GwVy9rTXiBSGId2z3BM8Rs5cSOAhkdGEjZXHUw/exec';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(APPS_SCRIPT_URL, { redirect: 'follow' });
      const text = await response.text();
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const bodyStr = JSON.stringify(req.body);
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: bodyStr,
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow'
      });
      const text = await response.text();
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}

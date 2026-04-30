const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbybCy53FgttYEoJraW_vzkZh6Kty2CppROXnoI_l8_L2eEdhV0GShT0V-NUpS8LpVA8DQ/exec';

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
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      res.status(200).json(data);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// API route to serve manifest.json
export default function handler(req, res) {
  const manifest = {
    "name": "UrCare - Healthcare Platform",
    "short_name": "UrCare",
    "description": "Excellence in Healthcare",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#ffffff",
    "orientation": "portrait-primary",
    "scope": "/",
    "icons": [
      {
        "src": "/brand.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/brand.png",
        "sizes": "512x512", 
        "type": "image/png",
        "purpose": "any maskable"
      }
    ],
    "categories": ["medical", "productivity", "utilities"],
    "shortcuts": [
      {
        "name": "Emergency",
        "short_name": "Emergency",
        "description": "Quick access to emergency features",
        "url": "/emergency",
        "icons": [{ "src": "/brand.png", "sizes": "96x96" }]
      },
      {
        "name": "Appointments",
        "short_name": "Appointments",
        "description": "View and manage appointments",
        "url": "/appointments",
        "icons": [{ "src": "/brand.png", "sizes": "96x96" }]
      }
    ],
    "related_applications": [],
    "prefer_related_applications": false
  };

  res.setHeader('Content-Type', 'application/manifest+json');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(manifest);
}

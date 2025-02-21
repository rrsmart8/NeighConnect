export default [
  {
    name: 'strapi::logger',
  },
  {
    name: 'strapi::errors',
  },
  {
    name: 'strapi::security',
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:13339',          // For local dev (if frontend is on the same machine)
        'http://10.200.22.17:13339',       // Strapi backend IP address (use for local network)
        'http://192.168.1.5:13339',        // Your backend local IP (Strapi server running)
        'http://192.168.x.x:8081',         // Your frontend's IP if it's running on a mobile device or different computer
        '*',                               // Allow all origins for testing (use with caution)
      ],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  {
    name: 'strapi::poweredBy',
  },
  {
    name: 'strapi::query',
  },
  {
    name: 'strapi::body',
  },
  {
    name: 'strapi::session',
  },
  {
    name: 'strapi::favicon',
  },
  {
    name: 'strapi::public',
  },
];

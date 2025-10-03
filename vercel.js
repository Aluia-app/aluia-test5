{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/edv.js",
      "dest": "/public/edv.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}

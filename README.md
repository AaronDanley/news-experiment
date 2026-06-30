# News Aggregator - React + Node.js

A modern, full-stack news aggregator featuring a proportional treemap layout displaying real news headlines in an interactive card-based interface.

## Features

- **Dynamic Treemap Layout** - Cards scale proportionally based on 8 news categories
- **Real News Integration** - Fetches from major news RSS feeds
- **Text Auto-Sizing** - Headlines automatically fit within card boundaries
- **Category Filtering** - Toggle 8 news categories (U.S., World, Business, Technology, Entertainment, Sports, Science, Health)
- **Click-to-Read** - Open full articles in new tabs
- **Responsive Design** - Works on desktop and tablet
- **Performance Caching** - News cached for 30 minutes to reduce API calls

## Tech Stack

**Backend:**
- Node.js + Express.js
- XML parsing (xml2js)
- Axios for HTTP requests
- CORS-enabled

**Frontend:**
- React 18
- Custom treemap algorithm
- CSS3 flexbox/absolute positioning

## API Endpoints

### GET `/api/news`
Returns 16 news articles from Google News RSS feeds, with 2 articles per category to ensure diversity.

Response format:
```json
[
  {
    "id": "TECHNOLOGY-0",
    "title": "Article Title",
    "description": "Short summary",
    "link": "https://example.com/article",
    "category": "technology",
    "score": 100,
    "source": "Source Publisher"
  }
]
```

### GET `/health`
Health check endpoint. Returns `{ "status": "ok" }`.

## News Sources

The backend fetches from Google News RSS feeds with topic-specific categories:
- U.S. (Nation)
- World
- Business
- Technology
- Entertainment
- Sports
- Science
- Health

Articles are cached for 30 minutes and updated automatically.

## Customization

### Add More News Sources
Edit `server/server.js` and add URLs to the `feeds` array:
```javascript
const feeds = [
  'https://your-feed-url.rss',
  // ... more feeds
];
```

### Adjust Colors
Edit category colors in `client/src/components/NewsAggregator.js`:
```javascript
const categoryColors = {
  us: '#3D5A72',
  world: '#5A7A8C',
  // ...
};
```

### Change Cache Duration
Edit `server/server.js`:
```javascript
const CACHE_DURATION = 30 * 60 * 1000; // milliseconds
```

## Deployment

### Backend (Express)
Deploy to Heroku, Railway, Render, or AWS Lambda.

### Frontend (React)
1. Build: `npm run build`
2. Deploy static files to Netlify, Vercel, or AWS S3

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

# News Aggregator v5 - React + Node.js

A modern, full-stack news aggregator featuring a **proportional treemap layout** displaying 16 real news headlines in an interactive card-based interface.

## Features

✨ **Dynamic Treemap Layout** - Cards scale proportionally based on 8 news categories
✨ **Real News Integration** - Fetches from CNN, Reuters, NYT, BBC RSS feeds (no API keys exposed)
✨ **Text Auto-Sizing** - Headlines automatically fit within card boundaries
✨ **Category Filtering** - Toggle 8 news categories (U.S., World, Business, Technology, Entertainment, Sports, Science, Health)
✨ **Click-to-Read** - Open full articles in new tabs
✨ **Responsive Design** - Works on desktop and tablet
✨ **Smart Categorization** - Keyword-based article classification
✨ **Performance Caching** - News cached for 30 minutes to reduce API calls

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
- Google Fonts (Roboto Condensed)

## Project Structure

```
na-v5/
├── server/
│   ├── package.json
│   └── server.js (Express backend on port 5000)
├── client/
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   └── components/
│   │       ├── NewsAggregator.js
│   │       └── NewsAggregator.css
│   └── public/
│       └── index.html (React on port 3000)
├── package.json (root)
└── README.md
```

## Quick Start

### Install All Dependencies
```bash
npm run install-all
```

### Run Development Mode
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:5000 (Express server)
- **Frontend**: http://localhost:3000 (React app)

### Or Run Individually

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## API Endpoints

### GET `/api/news`
Returns 16 diverse news articles from RSS feeds, ensuring representation across all 8 categories.

Response format:
```json
[
  {
    "id": "unique-id",
    "title": "Article Title",
    "description": "Short summary",
    "link": "https://example.com/article",
    "category": "technology",
    "score": 100,
    "source": "CNN"
  }
]
```

## News Sources

The backend fetches from:
- 🔴 CNN Top Stories
- 🔴 Reuters Top News
- 📰 New York Times World
- 🔴 BBC News

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

## Category Keywords

Articles are automatically categorized based on keywords in title/description. Adjust keywords in `server/server.js` `categoryKeywords` object.

## Performance

- **Fast Initial Load**: Articles fetched once and cached
- **Auto Text-Sizing**: Prevents overflow while maximizing readability
- **Smooth Animations**: Hover effects and layout transitions
- **Responsive**: Works on screens from 320px to 4K

## Deployment

### Backend (Express)
Deploy to: Heroku, Railway, Render, AWS Lambda
- Set environment variable: `PORT`
- Ensure Node.js 16+

### Frontend (React)
1. Build: `npm run build` (creates `client/build/`)
2. Deploy static files to: Netlify, Vercel, AWS S3, GitHub Pages
3. Update backend API URL if needed

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT

## Author

Built with ❤️ for real news aggregation

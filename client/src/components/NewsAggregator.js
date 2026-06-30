import React, { useState, useEffect, useRef, useMemo } from 'react';
import './NewsAggregator.css';

// Squarified treemap layout algorithm.
// Input: array of numeric values (already sorted largest -> smallest).
// Output: array of { x, y, w, h } in the SAME order as the input values,
// so the highest-ranked story (index 0) gets the largest, top-left tile.
function treemap(data, width, height) {
  const total = data.reduce((a, b) => a + b, 0) || 1;
  // Scale values so their sum equals the available pixel area.
  const scale = (width * height) / total;
  const items = data.map((value, index) => ({ index, area: value * scale }));

  const result = new Array(data.length);

  // Worst aspect ratio of a row given the side length it is laid along.
  function worst(row, side) {
    if (row.length === 0) return Infinity;
    const sum = row.reduce((a, r) => a + r.area, 0);
    const max = Math.max(...row.map(r => r.area));
    const min = Math.min(...row.map(r => r.area));
    const s2 = sum * sum;
    const side2 = side * side;
    return Math.max((side2 * max) / s2, s2 / (side2 * min));
  }

  // Place a finished row of tiles inside the current free rectangle.
  function layoutRow(row, rect) {
    const sum = row.reduce((a, r) => a + r.area, 0);
    const horizontal = rect.w >= rect.h;
    if (horizontal) {
      const rowW = sum / rect.h;
      let y = rect.y;
      for (const r of row) {
        const h = r.area / rowW;
        result[r.index] = { x: rect.x, y, w: rowW, h };
        y += h;
      }
      rect.x += rowW;
      rect.w -= rowW;
    } else {
      const rowH = sum / rect.w;
      let x = rect.x;
      for (const r of row) {
        const w = r.area / rowH;
        result[r.index] = { x, y: rect.y, w, h: rowH };
        x += w;
      }
      rect.y += rowH;
      rect.h -= rowH;
    }
  }

  const rect = { x: 0, y: 0, w: width, h: height };
  let row = [];
  let i = 0;
  while (i < items.length) {
    const side = Math.min(rect.w, rect.h);
    const next = items[i];
    if (row.length === 0 || worst([...row, next], side) <= worst(row, side)) {
      row.push(next);
      i++;
    } else {
      layoutRow(row, rect);
      row = [];
    }
  }
  if (row.length > 0) layoutRow(row, rect);

  return result;
}

// Auto-size text to fit its own box using dichotomy approach.
// More efficient than linear search, with fine-tuning for accuracy.
function autoSizeText(element) {
  const availableWidth = element.clientWidth;
  const availableHeight = element.clientHeight;
  if (availableWidth === 0 || availableHeight === 0) return;

  const minSize = 8;
  const maxSize = 48;
  
  // Phase 1: Grow from minSize with large increments until overflow
  let fontSize = minSize;
  let increment = 4;
  
  while (fontSize < maxSize) {
    element.style.fontSize = fontSize + 'px';
    if (element.scrollWidth > availableWidth || element.scrollHeight > availableHeight) {
      break;
    }
    fontSize += increment;
  }
  
  // Phase 2: Backtrack and fine-tune with smaller increments
  fontSize = Math.max(minSize, fontSize - increment);
  increment = 1;
  
  while (fontSize < maxSize) {
    element.style.fontSize = fontSize + 'px';
    if (element.scrollWidth > availableWidth || element.scrollHeight > availableHeight) {
      fontSize -= increment;
      break;
    }
    fontSize += increment;
  }
  
  element.style.fontSize = Math.max(minSize, fontSize) + 'px';
}

// Fisher-Yates shuffle to distribute colors evenly across grid
function shuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const NewsAggregator = ({ articles, visibleCategories, setVisibleCategories, showFooter = true }) => {
  const [layout, setLayout] = useState([]);
  const containerRef = useRef(null);

  const categoryColors = {
    us: '#3D5A72',
    world: '#5A7A8C',
    business: '#4A6A4F',
    technology: '#6B5A8A',
    entertainment: '#A85578',
    sports: '#B36844',
    science: '#3A8C89',
    health: '#A84646'
  };

  // Filter and sort articles by RSS ranking score (highest to lowest)
  const visibleArticles = useMemo(() => {
    let filtered = articles.filter(article => visibleCategories[article.category]);
    return filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [articles, visibleCategories]);

  // Calculate layout
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Descending sizes: biggest top-left to smallest bottom-right
    const values = Array.from({length: visibleArticles.length}, (_, i) => visibleArticles.length - i);
    const newLayout = treemap(values, width, height);
    setLayout(newLayout);
  }, [visibleArticles]);

  // Auto-size text when layout changes
  useEffect(() => {
    document.querySelectorAll('.news-headline').forEach(element => {
      autoSizeText(element);
    });
  }, [layout]);

  const handleCategoryToggle = (category) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCardClick = (link) => {
    if (link) window.open(link, '_blank');
  };

  const formatCategoryName = (category) => {
    if (category === 'us') return 'U.S.';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="news-aggregator">
      <header className="header">
        <h1>News Aggregator</h1>
        <span className="article-count">Top Headlines</span>
      </header>

      <div className="container" ref={containerRef}>
        {visibleArticles.map((article, idx) => {
          const layoutItem = layout[idx];
          if (!layoutItem) return null;

          // Snap edges (not dimensions) so neighboring tiles share the exact
          // same rounded coordinate. This prevents 1px gaps where the dark
          // container background would otherwise show through.
          const left = Math.round(layoutItem.x);
          const top = Math.round(layoutItem.y);
          const right = Math.round(layoutItem.x + layoutItem.w);
          const bottom = Math.round(layoutItem.y + layoutItem.h);

          return (
            <div
              key={article.id}
              className="news-card"
              style={{
                position: 'absolute',
                left: left + 'px',
                top: top + 'px',
                width: (right - left) + 'px',
                height: (bottom - top) + 'px',
                backgroundColor: categoryColors[article.category],
                cursor: 'pointer'
              }}
              onClick={() => handleCardClick(article.link)}
            >
              <h2 className="news-headline">{article.title}</h2>
              <div className="news-source">{article.source}</div>
            </div>
          );
        })}
      </div>

      <footer className="footer">
        <div className="category-filters">
          {Object.keys(categoryColors).map(category => (
            <label key={category} className="filter-label">
              <input
                type="checkbox"
                checked={visibleCategories[category]}
                onChange={() => handleCategoryToggle(category)}
                className="filter-checkbox"
              />
              <span>{formatCategoryName(category)}</span>
            </label>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default NewsAggregator;

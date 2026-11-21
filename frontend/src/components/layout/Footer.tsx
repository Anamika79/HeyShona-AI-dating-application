import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer__container">
        <p className="app-footer__text">
          Hey Shona! &copy; {new Date().getFullYear()} &bull; AI-Powered Dating & Compatibility
        </p>
        <div className="app-footer__stack">
          <span>React 19</span>
          <span>&bull;</span>
          <span>TypeScript</span>
          <span>&bull;</span>
          <span>Vite</span>
          <span>&bull;</span>
          <span>FastAPI</span>
          <span>&bull;</span>
          <span>SQLAlchemy (SQLite / Postgres)</span>
        </div>
      </div>
    </footer>
  );
};

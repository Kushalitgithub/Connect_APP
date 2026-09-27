import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const App = () => {
  return (
    <div className="min-h-screen bg-[var(--background, #F7F5F0)] text-[var(--text-primary, #1A1A2E)]">
      <h1 className="text-center py-8 text-2xl font-bold">
        Connect User
      </h1>
      <div className="max-w-md mx-auto px-4">
        <p className="text-center text-[var(--text-muted, #9AA3B2)]">
          Design system foundation implemented
        </p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
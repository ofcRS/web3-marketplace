import React from 'react';
import { createRoot } from 'react-dom/client';

const Test: React.FC = () => {
  return <div>123</div>
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Test />)
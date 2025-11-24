import React from 'react';
import { BrowserRouter, Routes, Route, NavLink  } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Stock from './pages/Stock.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{display:'flex',gap:'8px',padding:'10px',background:'#eee'}}>
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/stock">Stock</NavLink>
      </nav>
      <div style={{padding:'12px'}}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock" element={<Stock />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
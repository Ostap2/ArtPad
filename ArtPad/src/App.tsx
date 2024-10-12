import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './pages/MenuPage';  // Головна сторінка
import GamePage from './pages/GamePage';  // Сторінка "Про гру"
import Layout from './pages/Layout';    // Лейаут для інших сторінок

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Маршрут для домашньої сторінки без лейаута */}
        <Route path="/" element={<Menu />} />

        {/* Інші маршрути з лейаутом */}
        <Route path="/*" element={<Layout />}>
          <Route path="about" element={<GamePage />} />   {/* Сторінка "Про гру" */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // Переходить на домашню сторінку
  };

  return (
    <div>
      {/* Шапка сайту */}
      <header>
        {/* Кнопка "Назад" */}
        <button onClick={handleBackClick}>Назад</button>
      </header>

      {/* Основний контент сторінки */}
      <main>
        <Outlet /> {/* Тут будуть рендеритися ваші сторінки */}
      </main>
    </div>
  );
};

export default Layout;

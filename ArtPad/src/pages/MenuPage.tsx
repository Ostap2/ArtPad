import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <div>
      <h1>MENU</h1>
      <nav>
        <ul>
          <li>
            <Link to="/about">Play</Link>
          </li>
          {/* Додай більше посилань на інші сторінки тут */}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;

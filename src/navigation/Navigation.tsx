import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="menu" style={{ minHeight: '100vh' }}>
      <ul>
        <li>
          <Link to={routes.START}>Start</Link>
        </li>
        <li>
          <Link to={routes.CALCULATIONS}>Obliczenia</Link>
        </li>
        <li>
          <Link to={routes.CHARTS}>Wykres</Link>
        </li>
      </ul>
    </nav>
  );
}

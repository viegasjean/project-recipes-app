import React from 'react';
import { Link } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import exploreIcon from '../images/exploreIcon.svg';
import mealIcon from '../images/mealIcon.svg';
import './styles/BottomMenu.css';

function BottomMenu() {
  return (
    <section className="footer" data-testid="footer">
      <div className="menu-icons">
        <Link to="/drinks">
          <img src={ drinkIcon } alt="drink-icon" data-testid="drinks-bottom-btn" />
        </Link>
        <Link to="/explore">
          <img src={ exploreIcon } alt="explore-icon" data-testid="explore-bottom-btn" />
        </Link>
        <Link to="/foods">
          <img src={ mealIcon } alt="meal-icon" data-testid="food-bottom-btn" />
        </Link>
      </div>
    </section>
  );
}

export default BottomMenu;
import React from 'react';
import './PopularItems.css';

function PopularItems() {
  const popularItems = [
    { id: 1, name: 'Pizza', image: 'https://via.placeholder.com/300', description: 'Delicious cheesy pizza' },
    { id: 2, name: 'Burger', image: 'https://via.placeholder.com/300', description: 'Juicy beef burger' },
    { id: 3, name: 'Pasta', image: 'https://via.placeholder.com/300', description: 'Creamy Alfredo pasta' },
  ];

  return (
    <section className="popular-items">
      <h2>Most Popular Items</h2>
      <div className="items-grid">
        {popularItems.map(item => (
          <div key={item.id} className="item-card">
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularItems;
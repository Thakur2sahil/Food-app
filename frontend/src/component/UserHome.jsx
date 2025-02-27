import React, { useState } from 'react';
import Usernav from './Usernav';
import Card from './Card';

function UserHome() {
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <Usernav cartCount={cartCount} setCartCount={setCartCount} setSearchTerm={setSearchTerm} />
      <Card setCartCount={setCartCount} searchTerm={searchTerm} />
    </div>
  );
}

export default UserHome;

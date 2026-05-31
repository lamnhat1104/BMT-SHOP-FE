import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function UserLayout() {
  return (
    <div className="app-container">
      <Header />
      
      <main style={{ minHeight: '60vh' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default UserLayout;

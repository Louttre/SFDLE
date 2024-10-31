import React from 'react';
import { Outlet } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import CompletionChecker from '../utils/CompletionChecker';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <SideMenu />
      <div className="content-area">
        <CompletionChecker />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
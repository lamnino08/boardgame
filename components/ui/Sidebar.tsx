import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-background-surface text-text-primary w-64 space-y-6 py-7 px-4 shadow-xl rounded-r-2xl absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-300 ease-in-out">
      <nav>
        <a href="#" className="block py-3 px-4 rounded-lg transition duration-200 hover:bg-neutral-700 text-text-secondary hover:text-primary text-base">Dashboard</a>
        <a href="#" className="block py-3 px-4 rounded-lg transition duration-200 hover:bg-neutral-700 text-text-secondary hover:text-primary text-base">Analytics</a>
        <a href="#" className="block py-3 px-4 rounded-lg transition duration-200 hover:bg-neutral-700 text-text-secondary hover:text-primary text-base">Reports</a>
        <a href="#" className="block py-3 px-4 rounded-lg transition duration-200 hover:bg-neutral-700 text-text-secondary hover:text-primary text-base">Settings</a>
      </nav>
    </div>
  );
};

export default Sidebar;
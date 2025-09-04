
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-background border-b border-border shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-2xl font-bold uppercase tracking-widest text-primary">My App</a>
        <ul className="flex space-x-8">
          <li><a href="#" className="text-text-secondary hover:text-primary transition-colors duration-300 uppercase text-base">Home</a></li>
          <li><a href="#" className="text-text-secondary hover:text-primary transition-colors duration-300 uppercase text-base">About</a></li>
          <li><a href="#" className="text-text-secondary hover:text-primary transition-colors duration-300 uppercase text-base">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

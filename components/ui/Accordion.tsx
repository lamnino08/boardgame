import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border-base last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 px-5 text-left font-medium text-text-dark focus:outline-none hover:bg-neutral-700 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg
          className={`w-4 h-4 transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-200 text-primary`}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="p-5 text-text-medium bg-neutral-800">
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps>[];
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return (
    <div className="rounded-lg border border-border-base overflow-hidden shadow-md">
      {children}
    </div>
  );
};

Accordion.Item = AccordionItem; // Attach AccordionItem as a static property

export default Accordion;
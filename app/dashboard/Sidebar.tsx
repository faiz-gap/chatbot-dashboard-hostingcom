'use client';

import React from 'react';

interface SectionItem {
  id: string;
  name: string;
  icon: React.ReactNode; // Added icon property
}

interface SidebarProps {
  selectedSection: string | null;
  setSelectedSection: (section: string | null) => void;
  sections: SectionItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, setSelectedSection, sections }) => {
  return (
    <div className="w-64 h-full bg-white text-gray-800 p-4 space-y-2 border-r border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => {
          setSelectedSection(section.id);
        }}
          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center
                      ${selectedSection === section.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'}`}
        >
          <span className="mr-2">{section.icon}</span>
          {section.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar; 
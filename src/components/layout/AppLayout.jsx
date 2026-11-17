import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import OnDemandQueryModal from '../../features/conversations/OnDemandQueryModal.jsx';

export const AppLayout = () => {
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-canvas)]">
      <Sidebar onOpenQueryModal={() => setIsQueryModalOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        <main className="flex-1 p-6">
          <Outlet context={{ openQueryModal: () => setIsQueryModalOpen(true) }} />
        </main>
      </div>

      {/* Global Quick Launcher Modal */}
      <OnDemandQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
      />
    </div>
  );
};

export default AppLayout;

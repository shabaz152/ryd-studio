import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { NotificationToast } from './components/common/NotificationToast';

// Modals
import { CheckInModal } from './components/modals/CheckInModal';
import { CheckOutModal } from './components/modals/CheckOutModal';
import { RunningLateModal } from './components/modals/RunningLateModal';
import { RescheduleModal } from './components/modals/RescheduleModal';
import { LogLeadModal } from './components/modals/LogLeadModal';
import { OrderWorkbookModal } from './components/modals/OrderWorkbookModal';
import { ComposeUpdateModal } from './components/modals/ComposeUpdateModal';
import { NewSessionModal } from './components/modals/NewSessionModal';
import { ParentAcceptRescheduleModal } from './components/modals/ParentAcceptRescheduleModal';
import { RoleLoginGatewayModal } from './components/modals/RoleLoginGatewayModal';
import { AccountSecurityModal } from './components/modals/AccountSecurityModal';
import { PersonaSwitcher } from './components/PersonaSwitcher';

// Views
import { HomeView } from './views/HomeView';
import { BatchesView } from './views/BatchesView';
import { RescheduleView } from './views/RescheduleView';
import { UpdatesView } from './views/UpdatesView';
import { HubView } from './views/HubView';
import { LeadsView } from './views/LeadsView';
import { WorkbooksView } from './views/WorkbooksView';
import { FreeSlotsView } from './views/FreeSlotsView';
import { RatingsView } from './views/RatingsView';
import { ReferralView } from './views/ReferralView';
import { AdminPortal } from './views/admin/AdminPortal';
import { ParentPortal } from './views/parent/ParentPortal';
import { LoginView } from './views/auth/LoginView';

const MainLayout: React.FC = () => {
  const {
    currentAuthRole,
    activeRole,
    activeTab,
    viewMode,
    themeMode,
    parentPreviewModalOpen,
    setParentPreviewModalOpen,
    selectedSessionForParentPreview,
    isAuthenticated,
  } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <NotificationToast />
      </>
    );
  }

  const renderActiveView = () => {
    // Role Security: Non-admin users can ONLY view their own page!
    if (currentAuthRole === 'tutor') {
      return <HomeView />;
    }

    if (currentAuthRole === 'parent') {
      return <ParentPortal />;
    }

    // Admin is the Head: Can access all pages and preview any persona UI
    if (activeRole === 'tutor') {
      return <HomeView />;
    }

    if (activeRole === 'parent') {
      return <ParentPortal />;
    }

    switch (activeTab) {
      case 'home':
        return <AdminPortal />;
      case 'batches':
        return <BatchesView />;
      case 'reschedule':
        return <RescheduleView />;
      case 'updates':
        return <UpdatesView />;
      case 'hub':
        return <HubView />;
      case 'leads':
        return <LeadsView />;
      case 'workbooks':
        return <WorkbooksView />;
      case 'freeslots':
        return <FreeSlotsView />;
      case 'ratings':
        return <RatingsView />;
      case 'referral':
        return <ReferralView />;
      default:
        return <AdminPortal />;
    }
  };

  const appContent = (
    <div className={`min-h-screen ${themeMode === 'light' ? 'crm-light-viewport text-slate-900' : 'glossy-black-viewport text-white'} flex flex-col selection:bg-[#F59E0B] selection:text-white transition-colors duration-300`}>
      <PersonaSwitcher />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-20 sm:pb-24">
        {renderActiveView()}
      </main>

      {currentAuthRole === 'admin' && <BottomNav />}

      {/* Global Modals */}
      <CheckInModal />
      <CheckOutModal />
      <RunningLateModal />
      <RescheduleModal />
      <LogLeadModal />
      <OrderWorkbookModal />
      <ComposeUpdateModal />
      <NewSessionModal />
      <RoleLoginGatewayModal />
      <AccountSecurityModal />
      <ParentAcceptRescheduleModal
        isOpen={parentPreviewModalOpen}
        session={selectedSessionForParentPreview}
        onClose={() => setParentPreviewModalOpen(false)}
      />

      {/* Notification Toast Stack */}
      <NotificationToast />
    </div>
  );

  if (viewMode === 'mobile') {
    return (
      <div className={`min-h-screen ${themeMode === 'light' ? 'crm-light-viewport' : 'glossy-black-viewport'} flex flex-col items-center justify-center p-2 sm:p-6 select-none`}>
        {/* Device Frame */}
        <div className={`mobile-device-frame w-full max-w-[430px] h-[92vh] ${themeMode === 'light' ? 'bg-[#F8FAFC] border-slate-300 shadow-2xl' : 'glossy-black-viewport border-[#181822] shadow-2xl'} flex flex-col relative rounded-[48px] overflow-hidden`}>
          {/* Dynamic Island / Speaker notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-3 border border-white/10 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111118] border border-white/5" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFE500]/70" />
          </div>

          <div className="flex-1 overflow-y-auto pt-10 pb-2 no-scrollbar">
            {appContent}
          </div>

          {/* Simulated Home Indicator Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/40 dark:bg-white/30 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    );
  }

  return appContent;
};

export function App() {
  return (
    <AppProvider>
      <SplashScreen />
      <MainLayout />
    </AppProvider>
  );
}

export default App;

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex' }}>

      {/* ── Sidebar (fixed, dark, overlays on mobile) ── */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/*
        ── Main content area ──
        CSS var --sidebar-width:
          • 0px   on mobile  (sidebar is an off-screen overlay)
          • 264px on desktop (sidebar is always visible)
        This keeps content perfectly flush with the sidebar at all times.
      */}
      <div
        id="main-content-area"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          marginLeft: 'var(--sidebar-width)',
          transition: 'margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Topbar Navbar */}
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main
          style={{
            flex: 1,
            padding: '28px 32px',
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

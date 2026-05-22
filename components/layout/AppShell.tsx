"use client";

import { SidebarProvider, useSidebar } from "./SidebarContext";

function Backdrop() {
  const { open, close } = useSidebar();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-30 md:hidden"
      style={{ background: "rgba(23,18,12,0.45)" }}
      onClick={close}
      aria-hidden="true"
    />
  );
}

interface AppShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

function Shell({ sidebar, children }: AppShellProps) {
  const { open } = useSidebar();
  return (
    <div className="flex min-h-screen" style={{ background: "#EFE7D6" }}>
      <Backdrop />

      {/* Sidebar — fixed on desktop, slide-in drawer on mobile */}
      <div
        className="fixed left-0 top-0 bottom-0 z-40 transition-transform duration-200 ease-in-out"
        style={{
          width: "14rem",
          transform: open ? "translateX(0)" : undefined,
        }}
      >
        <style>{`
          @media (max-width: 767px) {
            .sidebar-drawer { transform: ${open ? "translateX(0)" : "translateX(-100%)"}; }
          }
          @media (min-width: 768px) {
            .sidebar-drawer { transform: translateX(0) !important; }
          }
        `}</style>
        <div className="sidebar-drawer h-full" style={{ width: "14rem" }}>
          {sidebar}
        </div>
      </div>

      {/* Main — offset by sidebar width on md+ */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-56">
        {children}
      </div>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <SidebarProvider>
      <Shell {...props} />
    </SidebarProvider>
  );
}

"use client";

import { SidebarProvider, useSidebar } from "./SidebarContext";

function Backdrop() {
  const { open, close } = useSidebar();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-30 md:hidden"
      style={{ background: "rgba(23,18,12,0.50)" }}
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

      {/* Sidebar — CSS-driven drawer on mobile, always visible on md+ */}
      <div
        className="sidebar-drawer fixed inset-y-0 left-0 z-40"
        style={{ width: "14rem" }}
        data-open={open ? "true" : "false"}
      >
        {sidebar}
      </div>

      {/* Main content — offset by sidebar width on md+ */}
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

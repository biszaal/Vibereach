import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#EFE7D6" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: "14rem" }}>
        {children}
      </div>
    </div>
  );
}

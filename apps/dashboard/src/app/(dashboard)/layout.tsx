import { SidebarNav } from "@/components/sidebar-nav";
import { TopNavbar } from "@/components/top-navbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarNav />
      
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <TopNavbar />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

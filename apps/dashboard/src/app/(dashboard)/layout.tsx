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
        <main className="flex-1 overflow-y-auto p-8 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

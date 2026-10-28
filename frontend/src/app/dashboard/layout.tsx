import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-on-surface">
      {/* Background Ambient Himalayan Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-primary/8 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[40%] h-[40%] bg-secondary/8 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[25%] w-[30%] h-[30%] bg-tertiary/5 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Cyber/Mountain Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none"></div>

      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Panel Content Area */}
      <div className="flex flex-col min-h-screen md:pl-64">
        {/* Topbar Panel */}
        <Topbar />

        {/* Dynamic Nested Screen Content */}
        <main className="flex-1 p-6 pt-20 overflow-y-auto z-10">
          {children}
        </main>
      </div>
    </div>
  );
}

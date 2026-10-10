import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ShiftGuard from "@/components/ShiftGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShiftGuard>
      <Sidebar />
      <div className="pl-72">
        <Topbar />
        {children}
      </div>
    </ShiftGuard>
  );
}

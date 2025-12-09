import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="pl-64 pt-16 transition-all duration-300">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;

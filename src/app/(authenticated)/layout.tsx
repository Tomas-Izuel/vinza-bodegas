import TopNav from "@/components/common/Navbar";
import SidebarNav from "@/components/common/Sidebar";
import type React from "react";

interface LayoutWrapperProps {
  children: React.ReactNode;
  currentPath?: string;
}

export default function LayoutWrapper({
  children,
  currentPath,
}: LayoutWrapperProps) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="flex">
        <SidebarNav currentPath={currentPath} />
        <main className="flex-1 common-main-container">{children}</main>
      </div>
    </div>
  );
}

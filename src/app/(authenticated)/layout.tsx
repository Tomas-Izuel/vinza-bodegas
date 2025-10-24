import TopNav from "@/components/common/Navbar";
import SidebarNav from "@/components/common/Sidebar";
import { Metadata } from "next";
import type React from "react";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="flex">
        <SidebarNav />
        <main className="flex-1 common-main-container">{children}</main>
      </div>
    </div>
  );
}

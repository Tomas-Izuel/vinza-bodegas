import TopNav from "@/components/common/Navbar";
import type React from "react";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen w-screen">
      <TopNav />
      <main className="flex items-center justify-center common-main-container">
        {children}
      </main>
    </div>
  );
}

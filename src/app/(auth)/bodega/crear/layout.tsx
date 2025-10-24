import TopNav from "@/components/common/Navbar";
import type React from "react";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen w-screen">
      <TopNav />
      <main className="flex justify-center common-main-container py-8">
        {children}
      </main>
    </div>
  );
}

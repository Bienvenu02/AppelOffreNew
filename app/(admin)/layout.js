"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import Footer from "@/components/admin/Footer";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [openSidebar, setOpenSidebar] = useState(false);

  // Protection de route
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <div className="h-screen flex bg-base-200">
      
      <Sidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />

      <div className="flex-1 flex flex-col">
        <Header
          openSidebar={openSidebar}
          toggleSidebar={() => setOpenSidebar(!openSidebar)}
        />

        <main className="flex-1  overflow-y-auto">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}


import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#120a29]">
      <ProfileSidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-8">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default ProfileLayout;

"use client";
import React, { useState } from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";
import { UsercourselistContext } from "../_context/UserCourseListContext";
import MobileSideBar from "./_components/MobileSideBar";
import { AnimatePresence } from "motion/react";

function DashboardLayout({ children }) {
  const [usercourselist, setUsercourselist] = useState([]);
  const [handleSidebar, setHandleSidebar] = useState(false);

  const handleMobileSidebar = () => {
    setHandleSidebar(!handleSidebar);
  };

  return (
    <UsercourselistContext.Provider value={{ usercourselist, setUsercourselist }}>
      <div>
        {/* Desktop sidebar — hidden on mobile */}
        <div className="md:w-64 hidden md:block">
          <SideBar />
        </div>

        {/* Mobile drawer — AnimatePresence enables exit animation */}
        <div className="md:hidden">
          <AnimatePresence>
            {handleSidebar && (
              <MobileSideBar handleMobileSidebar={() => handleMobileSidebar()} />
            )}
          </AnimatePresence>
        </div>

        {/* Main content */}
        <div className="md:ml-64">
          <Header hamBurger={true} handleMobileSidebar={() => handleMobileSidebar()} />
          <div className="p-4 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </UsercourselistContext.Provider>
  );
}

export default DashboardLayout;

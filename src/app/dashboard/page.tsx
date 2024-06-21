"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// import withAuth from "@/page-sections/hoc/withAuth";
import { ToastContainer, toast } from "react-toastify";
import Loader from '@/ui/dashboard/utilscomponent/Loader';
import MainCarousel from '@/ui/dashboard/main/MainCarousel';
import MainDashboard from '@/ui/dashboard/main';
import { useGlabalState } from '@/context/GlobalStateContext';

const HomeDashboard = () => {
  const { isCollapsed, setIsCollapsed } = useGlabalState();
  const { isDarkMode, setIsDarkMode } = useGlabalState();
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get('accessToken');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');

      return () => {
        document.documentElement.classList.remove('light');
      };
    }
  }, [isDarkMode]);


  return (
    <>
      <ToastContainer
        position="top-right"
        style={{ fontFamily: "Inter", fontSize: "16px" }}
      />
      {isLoading ? (
        <div className="lg:col-span-3 flex justify-center items-center">
          <Loader showText />
        </div>
      ) : (
        <>
          <div className="lg:col-span-3">
            <div className="2xl:hidden">
              <MainCarousel token={token} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className={`grid items-start gap-4 md:gap-6 2xl:flex 2xl:justify-center`}>
              <MainDashboard isCollapsed={isCollapsed} token={token} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomeDashboard;

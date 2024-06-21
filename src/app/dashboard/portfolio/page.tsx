// const UsersPage = () => {
//     return (
//         <div>
//            <p>
//             portfolio
//            </p>
//         </div>
//     )
// }

// export default UsersPage

"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// import withAuth from "@/page-sections/hoc/withAuth";
import { ToastContainer } from "react-toastify";
import Loader from '@/ui/dashboard/utilscomponent/Loader';
import { useGlabalState } from '@/context/GlobalStateContext';
import PortfolioCarousel from '@/ui/dashboard/portfolio/PortfolioCarousel';
import PortfolioUi from '@/ui/dashboard/portfolio';

const Portfolio = () => {
    const { isCollapsed, setIsCollapsed } = useGlabalState();
    const { isDarkMode, setIsDarkMode } = useGlabalState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');

            return () => {
                document.documentElement.classList.remove('light');
            };
        }
    }, [isDarkMode]);

    const token = Cookies.get('accessToken');
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
                            <PortfolioCarousel token={token}/>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="grid items-start gap-4 md:gap-6 2xl:w-full 2xl:flex 2xl:justify-center">
                            <PortfolioUi
                                isCollapsed={isCollapsed}
                                token={token}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Portfolio

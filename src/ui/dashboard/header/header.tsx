"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BellRing, Mail, User, Menu, Grid2X2, BriefcaseBusiness, BarChart2, Bookmark, Wallet, UsersRound, LogOut, ArrowRightLeft } from 'lucide-react';
import ToggleSwitch from "../utilscomponent/ToggleSwitch";
import { UserProfile } from "@/types";
import Link from 'next/link';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Cookies from 'js-cookie';
import LogoutModal from "../modals/LogoutModal";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { useGlabalState } from "@/context/GlobalStateContext";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  profile: UserProfile | null;
}

const Header = ({ profile }: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isPortfolio = pathname === '/portfolio';
  const isStock = pathname === '/stocks' || /^\/stocks\/[^/]+$/.test(pathname);
  const isWallet = pathname === '/payment';
  const [showModal, setShowModal] = useState(false);
  const { isDarkMode, setIsDarkMode } = useGlabalState();
  
  const deleteToken = (): void => {
    Cookies.remove('accessToken');
    window.location.reload();
    router.push('/login');
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');

      return () => {
        document.documentElement.classList.remove('light');
      };
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };
  return (
    <header data-testid="header" className="flex h-14 items-center dark:bg-[#151515] gap-4 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/"
              className={`flex items-center relative w-[13rem] left-[1.5rem] px-4 py-2 gap-3 rounded-lg ${isHome ? "bg-muted" : ""} px-3 py-2 text-primary transition-all hover:text-muted-foreground hover:bg-muted`}
            >
              <Grid2X2 strokeWidth={1} className="relative left-[6px]" />
              <p className="font-sans">
                {'Dashboard'}
              </p>
            </Link>
            <Link
              href="/portfolio"
              className={`flex items-center relative w-[13rem] left-[1.5rem] gap-3 rounded-lg ${isPortfolio ? "bg-muted" : ""} px-4 py-2 text-primary transition-all hover:text-muted-foreground mt-[0.5rem] hover:bg-muted`}
            >
              <BriefcaseBusiness strokeWidth={1} className="relative left-[6px]" />
              <p className="font-sans">
                {'Portfolio'}
              </p>
            </Link>
            <Link
              href="/stocks"
              className={`flex items-center relative w-[13rem] left-[1.5rem] gap-3 rounded-lg ${isStock ? "bg-muted" : ""} px-4 py-2 text-primary transition-all hover:text-muted-foreground mt-[0.5rem] hover:bg-muted`}
            >
              <BarChart2 strokeWidth={1} className="relative left-[6px]" />
              <p className="font-custom">
                {'Stocks'}
              </p>
            </Link>
            <Link
              href="/favorite"
              className={`flex items-center relative w-[13rem] left-[1.5rem] gap-3 rounded-lg px-4 py-2 text-primary transition-all hover:text-muted-foreground mt-[0.5rem] hover:bg-muted`}
            >
              <Bookmark strokeWidth={1} className="relative left-[6px]" />
              <p className="font-custom">
                {'WatchList'}
              </p>
            </Link>
            <Link
              href="/payment"
              className={`flex items-center relative w-[13rem] left-[1.5rem] gap-3 rounded-lg ${isWallet ? "bg-muted" : ""} px-4 py-2 text-primary transition-all hover:text-muted-foreground mt-[0.5rem] hover:bg-muted`}
            >
              <Wallet strokeWidth={1} className="relative left-[6px]" />
              <p className="font-custom">
                {'Wallet'}
              </p>
            </Link>
            <Link
              href="/orders"
              className={`flex items-center relative w-[13rem] left-[1.5rem] gap-3 rounded-lg px-4 py-2 text-primary transition-all hover:text-muted-foreground mt-[0.5rem] hover:bg-muted`}
            >
              <ArrowRightLeft strokeWidth={1} className="relative left-[6px]" />
              <p className="font-custom">
                {'Orders'}
              </p>
            </Link>
            <Link
              href="/community/blog"
              className={`flex items-center relative w-[13rem] left-[1.5rem] gap-3 rounded-lg px-4 py-2 text-primary transition-all hover:text-muted-foreground mt-[0.5rem] hover:bg-muted`}
            >
              <UsersRound strokeWidth={1} className="relative left-[6px]" />
              <p className="font-custom">
                {'Our Community'}
              </p>
            </Link>
            <Link
              href="#"
              className={`flex items-center relative w-[13rem] left-[1.5rem] gap-3 rounded-lg px-4 py-2 text-primary transition-all hover:text-muted-foreground mt-[0.5rem] hover:bg-muted`}
            >
              <Mail strokeWidth={1} className="relative left-[6px]" />
              <p className="font-custom">
                {'Contact us'}
              </p>
            </Link>
            <Link
              href="#"
              className={`flex items-center relative w-[13rem] left-[1.5rem] gap-3 rounded-lg px-4 py-2 text-primary transition-all hover:text-muted-foreground mt-[0.5rem] hover:bg-muted`}
            >
              <User strokeWidth={1} className="relative left-[6px]" />
              <p className="font-custom">
                {'Profile'}
              </p>
            </Link>
            <Link
              href="#"
              onClick={openModal}
              className={`flex items-center relative w-[13rem] left-[1.5rem] gap-3 rounded-lg px-4 py-2 text-primary transition-all hover:text-muted-foreground mt-[0.5rem] hover:bg-muted`}
            >
              <LogOut strokeWidth={1} className="relative left-[6px]" />
              <p className="font-sans">
                {'Logout'}
              </p>
            </Link>
          </nav>
          <LogoutModal isOpen={showModal} onClose={closeModal} onConfirm={deleteToken} />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Enter Your Email Here"
              className="w-full appearance-none bg-muted/40 dark:bg-[#000] pl-8 shadow-none md:w-2/3 lg:w-[18rem]"
            />
          </div>
        </form>
      </div>
      <div className="hidden md:flex gap-4 items-center">
        <ToggleSwitch isChecked={isDarkMode} onChange={toggleDarkMode} />
        <Mail strokeWidth={1} className="h-5 w-5" />
        <BellRing strokeWidth={1} className="h-5 w-5" />
        <div className="flex gap-[1rem]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User strokeWidth={1} className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" >
              <DropdownMenuLabel className="flex justify-center">
                <div className="h-[5rem] w-[5rem] rounded-full overflow-hidden mx-auto">
                  {profile?.image_url ? (
                    <Image
                      width={50}
                      height={40}
                      src={profile?.image_url}
                      alt="User Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User strokeWidth={1} className="h-full w-full object-cover" />
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem className="flex justify-center">{profile?.first_name} {profile?.last_name}</DropdownMenuItem>
              <DropdownMenuItem className="flex justify-center">Deposit</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Work Preference</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={deleteToken} className="cursor-pointer">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="mt-[0.6rem]">
            {profile?.first_name}  {profile?.last_name}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { useMediaQuery } from "react-responsive";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Card, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { StockInfo } from "@/types";
import { getStocks } from "@/lib/apiUtils";
import { ToastContainer, toast } from "react-toastify";

const MainCarousel = ({ token }:any) => {
  const [showPrevious, setShowPrevious] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 1279 });
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [stocks, setStocks] = useState<StockInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleNextClick = () => {
    setShowPrevious(true);
  };

  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      prevRef.current.classList.add("custom-prev");
      nextRef.current.classList.add("custom-next");
    }
  }, []);

  const getMovementIcon = (movement:any) => {
    switch (movement) {
      case "up":
        return (
          <TiArrowSortedUp className="w-5 h-5 text-green-500 relative bottom-[0.2rem]" />
        );
      case "down":
        return (
          <TiArrowSortedDown className="w-5 h-5 text-red-500 relative bottom-[0.2rem]" />
        );
      case "constant":
      default:
        return (
          <TiArrowSortedUp className="w-5 h-5 text-gray-500 relative bottom-[0.2rem]" />
        );
    }
  };

  const getTextColor = (movement:any) => {
    switch (movement) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      case "constant":
      default:
        return "text-gray-500";
    }
  };

  const getBgColor = (movement:any) => {
    switch (movement) {
      case "up":
        return "bg-green-500";
      case "down":
        return "bg-red-500";
      case "constant":
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const stockdata = await getStocks(token);
        if (stockdata) {
          setStocks(stockdata);
        }
      } catch (err) {
        setError('Failed to fetch profile data');
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <p className="font-bold text-xl">Dashboard</p>
      {isMobile ? (
        <div data-testid="main-carousel-phone" className="flex flex-wrap">
          {stocks.map((item:any) => (
            <Card key={item.id} className="w-[100%] pl-[2rem] pt-[1rem] lg:w-[17rem] h-[5rem] dark:bg-[#151515] mb-4 lg:mb-0">
              <CardDescription>
                <div className="flex gap-[1rem]">
                  <Image
                    width={30}
                    height={30}
                    src={item?.image}
                    alt={"user image"}
                  />
                  <div className="flex flex-col">
                    <div className="flex h-[2rem] justify-between">
                      <p className="text-primary text-xs font-bold">{item?.symbol}</p>
                      <p className="text-primary text-[10px] font-normal -mt-[0.2rem]">{item?.name}</p>
                      <div className="flex">
                        <p className={`${getTextColor(item?.movement)} text-xs`}>{item?.percentageChange.toFixed(2)}%</p>
                        {getMovementIcon(item?.movement)}
                      </div>
                    </div>
                    <div className="pr-[4px]">
                      <div className="w-[15rem] h-[3px] bg-gray-200 rounded-md mt-[0.5rem]">
                        <div className={`w-[50%] h-full ${getBgColor(item.movement)} rounded-md`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardDescription>
            </Card>
          ))}
        </div>
      ) : (
        <div data-testid="main-carousel-all" className="relative 2xl:w-[70%]">
          <Swiper
            spaceBetween={100}
            slidesPerView={3}
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            onReachBeginning={() => setIsBeginning(true)}
            onFromEdge={() => setIsBeginning(false)}
            onReachEnd={() => setIsEnd(true)}
            onToEdge={() => setIsEnd(false)}
          >
            {stocks.map((item:any) => (
              <SwiperSlide key={item.id}>
                <Card className="w-[100%] lg:w-[21rem] h-[5rem] pl-[12px] flex items-center dark:bg-[#151515] mb-4 lg:mb-0">
                  <CardDescription>
                    <div className="flex gap-[1rem]">
                      <Image
                        width={30}
                        height={30}
                        src={item?.image}
                        alt={"user image"}
                        className="object-contain w-[3rem] h-[3rem]"
                      />
                      <div className="flex flex-col">
                        <div className="flex h-[2rem] justify-between">
                          <p className="text-primary text-xs font-bold">{item?.symbol}</p>
                          <p className="text-primary text-[8px] font-normal -mt-[0.2rem]">{item?.name}</p>
                          <div className="flex">
                            <p className={`${getTextColor(item?.movement)} text-xs`}>{item?.percentageChange.toFixed(2)}%</p>
                            {getMovementIcon(item?.movement)}
                          </div>
                        </div>
                        <div className="pr-[4px]">
                          <div className="w-[15rem] h-[3px] bg-gray-200 rounded-md mt-[0.5rem]">
                            <div className={`w-[50%] h-full ${getBgColor(item?.movement)} rounded-md`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardDescription>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={prevRef}
            className={`absolute -left-[1rem] top-[25%] w-[40px] h-[40px] border bg-white dark:bg-[#000000] flex items-center justify-center p-3 rounded-full cursor-pointer z-10 ${isBeginning ? "hidden" : ""}`}
          >
            <ChevronLeft strokeWidth={1} className="text-primary" />
          </button>
          <button
            ref={nextRef}
            className={`absolute -right-[1.3rem] top-[25%] w-[40px] h-[40px] border bg-white dark:bg-[#000000] flex items-center justify-center p-3 z-10 rounded-full cursor-pointer ${isEnd ? "hidden" : ""}`}
          >
            <ChevronRight strokeWidth={1} className="text-primary" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MainCarousel;

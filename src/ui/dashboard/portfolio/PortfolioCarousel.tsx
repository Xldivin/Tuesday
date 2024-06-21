import { Card, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { useMediaQuery } from 'react-responsive';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Graph from '../../../assets/images/Graph.png';
import Down from '../../../assets/images/Down.png';
import { truncateNumber } from "@/lib/utils";
import { fetchPortfolio, fetchWatchlist, getStocks, getUserProfile } from "@/lib/apiUtils";
import { StockInfo, UserProfile } from "@/types";
import { ToastContainer, toast } from "react-toastify";

interface Stock {
    id: number;
    image: string;
    symbol: string;
    name: string;
    movement: 'up' | 'down' | 'constant';
    percentageChange: number;
    totalReturn: number;
    graphImage: string;
}

interface PortolioCarouselProps {
    stocks: Stock[];
}

const PortolioCarousel = ({token}:any) => {
    const [showPrevious, setShowPrevious] = useState(false);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [portfolio, setPortfolio] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (prevRef.current && nextRef.current) {
            prevRef.current.classList.add('custom-prev');
            nextRef.current.classList.add('custom-next');
        }
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(token);
                const portfolio = await fetchPortfolio(token);
                if (data && portfolio) {
                    setPortfolio(portfolio);
                    setProfile(data);
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

    const handleNextClick = () => {
        setShowPrevious(true);
    };

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const getMovementIcon = (movement: Stock['movement']) => {
        switch (movement) {
            case "up":
                return <TiArrowSortedUp className="w-5 h-5 text-green-500" />;
            case "down":
                return <TiArrowSortedDown className="w-5 h-5 text-red-500" />;
            case "constant":
            default:
                return <TiArrowSortedUp className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTextColor = (movement: Stock['movement']) => {
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

    const getMovementImage = (movement: Stock['movement']) => {
        switch (movement) {
            case "up":
                return Graph;
            case "down":
                return Down;
            case "constant":
            default:
                return Graph;
        }
    };

    return (
        <div data-testid="portflio-carousel" className="mt-[2rem]">
            <p className='font-bold'>My Portfolio</p>
            {isMobile ? (
                <div className="flex flex-col mt-[1rem]">
                    {portfolio?.map((asset: any) => (
                        <Card key={asset.stock.id} className="w-[100%] dark:bg-[#151515] lg:w-[20rem] h-[10rem] mb-4 lg:mb-0">
                            <CardDescription className="pl-[1.3rem] pt-[1.2rem]">
                                <div className="flex justify-between pr-[1.3rem]">
                                    <div className="flex">
                                        <Image
                                            width={50}
                                            height={90}
                                            src={asset.stock.image}
                                            className="relative top-[0.5rem]"
                                            alt={`${asset.stock.name} graph`}
                                        />
                                        <p className="mt-[1.2rem] ml-[1rem] text-md text-primary">{asset.stock.name}</p>
                                    </div>
                                    <Image
                                        width={80}
                                        height={90}
                                        src={Graph}
                                        className="relative top-[0.5rem]"
                                        alt={`${asset.stock.name} graph`}
                                    />
                                </div>
       
                                <div className="flex pt-[2.5rem] justify-between pr-[1.3rem]">
                                    <p>Change</p>
                                    <div className="flex w-[4.6rem]">
                                        <p className={getTextColor(asset.stock.movement)}>{truncateNumber(asset.stock.percentageChange.toFixed(2),3)}</p>
                                        {getMovementIcon(asset.stock.movement)}
                                    </div>
                                </div>
                                <div className="flex justify-between pr-[1.3rem]">
                                    <p>Total Return</p>
                                    <div className="flex w-[4.4rem]">
                                        <p className="text-primary">{profile?.currency} {truncateNumber(asset.stock.dayRangeHigh,3)}</p>
                                    </div>
                                </div>
                            </CardDescription>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="relative 2xl:w-[70%]">
                    <Swiper
                        spaceBetween={100}
                        slidesPerView={3}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                        modules={[Navigation]}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            if (typeof swiper.params.navigation !== 'boolean') {
                                swiper.params.navigation!.prevEl = prevRef.current;
                                swiper.params.navigation!.nextEl = nextRef.current;
                            }
                        }}
                        onReachBeginning={() => setIsBeginning(true)}
                        onFromEdge={() => setIsBeginning(false)}
                        onReachEnd={() => setIsEnd(true)}
                        onToEdge={() => setIsEnd(false)}
                    >
                        <div className="lg:w-[30%] flex flex-col lg:flex-row">
                            {portfolio?.map((asset: any) => (
                                <SwiperSlide key={asset.stock.id}>
                                    <Card className="w-[100%] dark:bg-[#151515] lg:w-[20rem] h-[10rem] mb-4 lg:mb-0">
                                        <CardDescription className="pl-[1.3rem] pt-[1.2rem]">
                                            <div className="flex justify-between pr-[1.3rem]">
                                                <div className="flex h-[3rem]">
                                                    <Image
                                                        width={50}
                                                        height={90}
                                                        src={asset.stock.image}
                                                        className="relative top-[0.5rem] h-[3rem]"
                                                        alt={`${asset.stock.name} graph`}
                                                    />
                                                    <p className="mt-[1.2rem] ml-[1rem] text-md text-primary">{asset.stock.name}</p>
                                                </div>
                                                <Image
                                                    width={80}
                                                    height={90}
                                                    src={getMovementImage(asset.stock.movement)}
                                                    className="relative top-[0.5rem]"
                                                    alt={`${asset.stock.name} graph`}
                                                />
                                            </div>
                                            <div className="flex pt-[2rem] justify-between pr-[1.3rem]">
                                                <p>Change</p>
                                                <div className="flex w-[4.6rem]">
                                                    <p className={getTextColor(asset.stock.movement)}>{asset.stock.percentageChange.toFixed(2)}</p>
                                                    {getMovementIcon(asset.stock.movement)}
                                                </div>
                                            </div>
                                            <div className="flex justify-between pr-[1.3rem]">
                                                <p>Total Return</p>
                                                <div className="flex w-[5rem]">
                                                    <p className="text-primary">{profile?.currency} {truncateNumber(asset.stock.dayRangeHigh,3)}</p>
                                                </div>
                                            </div>
                                        </CardDescription>
                                    </Card>
                                </SwiperSlide>
                            ))}
                        </div>
                    </Swiper>

                    <button
                        ref={prevRef}
                        className={`absolute -left-[1rem] top-[36%] w-[40px] h-[40px] border bg-white dark:bg-[#000000] flex items-center justify-center p-3 rounded-full cursor-pointer z-10 ${isBeginning ? 'hidden' : ''
                            }`}
                    >
                        <ChevronLeft strokeWidth={1} className="text-primary" />
                    </button>
                    <button
                        ref={nextRef}
                        className={`absolute -right-[1.3rem] top-[36%] w-[40px] h-[40px] border bg-white dark:bg-[#000000] flex items-center justify-center p-3 z-10 rounded-full cursor-pointer ${isEnd ? 'hidden' : ''
                            }`}
                    >
                        <ChevronRight strokeWidth={1} className="text-primary" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default PortolioCarousel;

import React, { useEffect, useState } from 'react';
import { Card, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { TiArrowSortedDown } from "react-icons/ti";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ApexChart from '../graphs/CandleStick';
import { ChevronRight } from 'lucide-react';
import { TiArrowSortedUp } from "react-icons/ti";
import StockChart from '../graphs/StockChart';
import { BarChart3 } from 'lucide-react';
import { CandlestickChart } from 'lucide-react';
import { deleteWatchlist, fetchPortfolio, fetchWatchlist, getStocks, getUserProfile, sendWatchlist } from '@/lib/apiUtils';
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { truncateNumber } from '@/lib/utils';
import BuySellForm from '../modals/BuySellForm';
import { StockInfo, UserProfile } from '@/types';
import { ToastContainer, toast } from "react-toastify";

type Asset = {
    id: string;
    name: string;
    symbol: string;
    image: string;
    price: number;
    dayRangeHigh: number;
    dayRangeLow: number;
    assetFullName: string;
};

const PortfolioUi = ({ isCollapsed, token }:any) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentChart, setCurrentChart] = useState('ApexChart');
    const [watchlist, setWatchlist] = useState<any>([]);
    const [buySellModal, setIsBuySellModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [portfolio, setPortfolio] = useState<any>(null);
    const [stocks, setStocks] = useState<StockInfo[]>([]);
    const [watchlistData, setWatchlistData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const data = [
        {
            id: 1,
            name: 'Amazon',
            ticker: 'AMZ',
            price: '$201.01',
            trend: 'trend title',
            percentage: '70.5%',
            lastUpdate: '15:40',
            imageUrl: 'path_to_amazon_image',
        },
        {
            id: 3,
            name: 'Google',
            ticker: 'GOOGL',
            price: '$1520.50',
            trend: 'trend title',
            percentage: '30.2%',
            lastUpdate: '16:00',
            imageUrl: 'path_to_google_image',
        },
        {
            id: 5,
            name: 'Facebook',
            ticker: 'FB',
            price: '$260.10',
            trend: 'trend title',
            percentage: '10.5%',
            lastUpdate: '14:30',
            imageUrl: 'path_to_facebook_image',
        },
    ];

    const openModal = (asset:any) => {
        console.log(asset)
        setSelectedAsset(asset.stock);
        setIsBuySellModal(true);
    };

    const closeModal = () => {
        setIsBuySellModal(false);
        setSelectedAsset(null);
    };

    const handleClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };
    const handleChartChange = (chartType: any) => {
        setCurrentChart(chartType);
    };
    const currentData = stocks[currentIndex];

    const getMovementIcon = (movement: any) => {
        switch (movement) {
            case "up":
                return <TiArrowSortedUp className="relative w-3 h-3 top-1 text-green-500" />;
            case "down":
                return <TiArrowSortedDown className="relative w-3 h-3 top-1 text-red-500" />;
            case "constant":
            default:
                return <TiArrowSortedUp className="relative w-3 h-3 top-1 text-gray-500" />;
        }
    };
    const getMovementIconCard = (movement: any) => {
        switch (movement) {
            case "up":
                return <TiArrowSortedUp className="w-4 h-4 text-green-500" />;
            case "down":
                return <TiArrowSortedDown className="w-4 h-4 text-red-500" />;
            case "constant":
            default:
                return <TiArrowSortedUp className="w-4 h-4 text-gray-500" />;
        }
    };
    const getTextColor = (movement: any) => {
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

    useEffect(() => {
        const getWatchlist = async () => {
            try {
                const watchlistData = await fetchWatchlist(token);
                setWatchlist(watchlistData);
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            }
        };

        getWatchlist();
    }, [token]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(token);
                const portfolio = await fetchPortfolio(token);
                const stockData = await getStocks(token);
                const watchlistData = await fetchWatchlist(token);
                if (data && stockData && portfolio && watchlistData) {
                    setPortfolio(portfolio);
                    setProfile(data);
                    setStocks(stockData);
                    setWatchlistData(watchlistData);
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

    const handleBookmarkClick = async (stockId:any) => {
        const watchlistItem = watchlist.find((item:any) => item.stock_id === stockId);
        if (watchlistItem) {
            try {
                await deleteWatchlist(watchlistItem.id, token);
                setWatchlist((prev:any) => prev.filter((item:any) => item.id !== watchlistItem.id));
                console.log('Asset removed from watchlist');
            } catch (error) {
                console.error('Error removing asset from watchlist:', error);
            }
        } else {
            const values = { user_id: profile?.id, stock_id: stockId };
            try {
                const response = await sendWatchlist(values, token);
                setWatchlist((prev:any) => [...prev, response]);
                console.log('Asset added to watchlist:', response);
            } catch (error) {
                console.error('Error adding asset to watchlist:', error);
            }
        }
    };

    const isInWatchlist = (stockId: any) => {
        return watchlist.some((item: any) => item.stock_id === stockId);
    };

    return (
        <div data-testid="portflio-dashboard" className='flex flex-col gap-[10px] sm:gap-[12px] md:gap-[16px] lg:gap-[20px] xl:gap-[24px] 2xl:gap-[28px]'>
            <div>
                <div className='flex gap-[1rem] flex-col'>
                    <div className='flex flex-col gap-[1rem] lg:flex-row'>
                        <Card className="w-[100%]  h-[100%] p-[1rem] dark:bg-[#151515] lg:w-[70%] lg:h-[30rem] 2xl:w-[100%]">
                            <div className='flex flex-col lg:flex-row justify-between pb-[0.6rem]'>
                                <div className='flex gap-[2.5rem]'>
                                    <Image
                                        width={40}
                                        height={40}
                                        src={currentData?.image}
                                        className="relative top-[0.5rem] left-[0.5rem] object-contain"
                                        alt={`${currentData?.name} image`}
                                    />
                                    <div className='flex flex-col mt-[1rem]'>
                                        <p>{currentData?.name}</p>
                                        <p>{currentData?.symbol}</p>
                                    </div>
                                    <div className='relative right-[1rem]'>
                                        <button
                                            className="w-[40px] h-[40px] border bg-white dark:bg-[#000000] flex items-center justify-center p-3 z-10 rounded-full cursor-pointer mt-[1rem]"
                                            onClick={handleClick}
                                        >
                                            <ChevronRight strokeWidth={1} className="text-primary" />
                                        </button>
                                    </div>
                                </div>
                                <div className='flex flex-col mt-[1rem] gap-[0.4rem]'>
                                    <div className='flex ml-[7.5rem] gap-[0.3rem]'>
                                        <p>${currentData?.price}</p>
                                        <div className='inline-flex z-10 border-[1px] pl-2 pr-2 text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50'>View All</div>
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex gap-[2rem] mt-4">
                                <button
                                    className={`w-[40px] h-[40px] border bg-white dark:bg-[#000000] flex items-center justify-center p-3 z-10 rounded-full cursor-pointer ${currentChart === 'StockChart' ? 'bg-blue-500' : ''}`}
                                    onClick={() => handleChartChange('StockChart')}
                                >
                                    <BarChart3 />
                                </button>
                                <button
                                    className={`w-[40px] h-[40px] border bg-white dark:bg-[#000000] flex items-center justify-center p-3 z-10 rounded-full cursor-pointer ${currentChart === 'ApexChart' ? 'bg-blue-500' : ''}`}
                                    onClick={() => handleChartChange('ApexChart')}
                                >
                                    <CandlestickChart />
                                </button>
                            </div>
                            {currentChart === 'StockChart' ? <StockChart /> : <ApexChart />}
                        </Card>
                        <Card className="w-full h-[100%] pb-[1rem] dark:bg-[#151515] lg:w-[30%] lg:h-[30rem] 2xl:w-[50%]">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">
                                    <div className="flex gap-8 justify-between">
                                        <div className="flex flex-row gap-8">
                                            <div>
                                                <p className="text-sm">Watchlist</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardTitle>
                                <div
                                    className="max-w-lg h-[26rem] overflow-auto"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    <CardDescription className="text-balance leading-relaxed">
                                        {watchlistData?.map((item: { id: React.Key | null | undefined; stock:any; symbol: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; price: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; movement: any; percentageChange: any; arrowClass: any; image: any }) => (
                                            <div key={item.stock.id}>
                                                <div className='flex justify-between pt-2'>
                                                    <div className='flex gap-4'>
                                                        <Image
                                                            width={40}
                                                            height={30}
                                                            src={item.stock.image}
                                                            className="object-contain"
                                                            alt="user image"
                                                        />
                                                        <div className='relative top-1'>
                                                            <p className='text-primary font-semibold'>{item.stock.symbol}</p>
                                                            <p className='text-[12px]'>{item.stock.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className='w-[5rem]'>
                                                        <p className='text-primary font-bold'>{profile?.currency} {item.stock.price}</p>
                                                        <div className='flex'>
                                                            <p className={`font-normal ${getTextColor(item.stock.movement)}`}>{item.stock.percentageChange.toFixed(2)}%</p>
                                                            {getMovementIcon(item.stock.movement)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Separator className='mt-4' />
                                            </div>
                                        ))}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                    <div>
                        <Card className='w-[100%] h-[100%] p-[2rem] dark:bg-[#151515] 2xl:w-[100%]'>
                            <CardTitle>
                                <div>
                                    <p className="text-sm ml-[1rem]">Market Trend</p>
                                </div>
                            </CardTitle>
                            <Table className='w-[100%]'>
                                <TableHeader className='[&_tr]:border-0'>
                                    <TableRow >
                                        <TableHead>Asset Name</TableHead>
                                        <TableHead className="sm:table-cell">Price</TableHead>
                                        <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                                        <TableHead className="hidden sm:table-cell">Change</TableHead>
                                        <TableHead className="hidden md:table-cell">MarketCap</TableHead>
                                        <TableHead className={`hidden md:table-cell text-right ${isCollapsed ? "relative right-[3rem]" : ""}`}>Watchlist</TableHead>
                                        {/* <TableHead className={`hidden md:table-cell text-right ${isCollapsed ? "relative right-[1rem]" : ""}`}></TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {portfolio?.map((asset: any, index: any) => (
                                        <TableRow key={index}>
                                            <TableCell className='flex relative top-[0.1rem]'>
                                                <Image
                                                    width={30}
                                                    height={30}
                                                    src={asset.stock.image}
                                                    className="relative left-[0.5rem] h-[2rem]"
                                                    alt={asset.assetFullName}
                                                />
                                                <div className="font-medium text-xs ml-[15px] mt-[10px] flex gap-[7px]">
                                                    <p>{asset.stock.symbol}</p>
                                                    <p className='text-[#6F6F6F] text-xs font-light'>{asset.stock.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="sm:table-cell">
                                                {profile?.currency} {truncateNumber(asset.stock.price,9)}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                 {asset.amount}
                                            </TableCell>
                                            <TableCell className={`hidden md:flex relative bottom-[0.6rem]`}>
                                                <p className='text-md text-green-500'>{truncateNumber(asset.stock.dayRangeHigh - asset.stock.dayRangeLow, 9)}</p>
                                                <TiArrowSortedDown className={`relative w-3 h-3 text-green-500 top-[0.3rem]`} />
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                            {truncateNumber(asset.stock.price,9)}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-right relative left-[1rem]">
                                                {isInWatchlist(asset.stock.id) ? (
                                                    <FaBookmark
                                                        strokeWidth={1}
                                                        onClick={() => handleBookmarkClick(asset.stock.id)}
                                                        className={`ml-[1rem] cursor-pointer`}
                                                    />
                                                ) : (
                                                    <FaRegBookmark
                                                        strokeWidth={1}
                                                        onClick={() => handleBookmarkClick(asset.stock.id)}
                                                        className="ml-[1rem] cursor-pointer"
                                                    />
                                                )}
                                            </TableCell>
                                            {/* <TableCell className="hidden md:table-cell text-right">
                                                <Button variant="outline" className="w-[4rem] bg-[#0958D9] text-secondary rounded-3xl" onClick={() => openModal(asset)}>Buy</Button>
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                        <BuySellForm isOpen={buySellModal} onClose={closeModal} profile={profile} token={token} selectedAsset={selectedAsset}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioUi;

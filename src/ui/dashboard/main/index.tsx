import React, { useEffect, useState } from 'react';
import { Card, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import Image from "next/image";
import { TiArrowSortedDown } from "react-icons/ti";
import { Button } from "@/components/ui/button";
import BarChart from '../graphs/BarChart';
import LineChart from '../graphs/LineChartDays';
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Settings } from 'lucide-react';
import { TiArrowSortedUp } from "react-icons/ti";
import LineChartMonths from '../graphs/LineChartMonths';
import LineChartYears from '../graphs/LineChartYears';
import { ArrowDownUp } from 'lucide-react';
import { deleteWatchlist, fetchData, fetchGrowthData, fetchPortfolio, fetchWatchlist, getOrdersMe, getStocks, getUserProfile, sendWatchlist } from '@/lib/apiUtils';
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { truncateNumber } from '@/lib/utils';
import BuySellForm from '../modals/BuySellForm';
import BuySellCard from './BuySellCard';
import { StockInfo, UserProfile } from '@/types';
import { ToastContainer, toast } from "react-toastify";

const MainDashboard = ({ isCollapsed, token }: any) => {
    const [stocksTable, setstocksTable] = useState([]);
    const [year1, setYear1] = useState('');
    const [year2, setYear2] = useState('');
    const [month1, setMonth1] = useState('');
    const [month2, setMonth2] = useState('');
    const [tab, setTab] = useState('week');
    const [data, setData] = useState(null);
    const [watchlist, setWatchlist] = useState<any>([]);
    const [buySellModal, setIsBuySellModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stocks, setStocks] = useState<StockInfo[]>([]);
    const [orders, setOrders] = useState<any>([]);
    const [portfolioStocks, setportfolioStocks] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ]

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

    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const options2 = Array.from({ length: 100 }, (_, index) => {
        const year = new Date().getFullYear() - index;
        return { value: year, label: year };
    });

    useEffect(() => {
        const fetchDataAsync = async () => {
            if (year1 && month1 && year2 && month2) {
                const data = await fetchData(year1, year2, month1, month2, token);
                setstocksTable(data);
            } else {
                const data = await fetchData('2024', '2024', '4', '5', token);
                setstocksTable(data);
            }
        };
        fetchDataAsync();
    }, [year1, month1, year2, month2]);

    const handleChange = (event: any, setState: any) => {
        const selectedValue = event.target.value;
        setState(selectedValue);
        console.log({
            year1,
            month1,
            year2,
            month2,
        });
    };

    const openModal = (asset: any) => {
        setSelectedAsset(asset);
        setIsBuySellModal(true);
    };

    const closeModal = () => {
        setIsBuySellModal(false);
        setSelectedAsset(null);
    };

    useEffect(() => {
        const fetchDataForTab = async () => {
            const growthData = await fetchGrowthData(tab, token);
            setData(growthData);
        };

        fetchDataForTab();
    }, [tab, token]);

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

    const handleBookmarkClick = async (stockId: any) => {
        const watchlistItem = watchlist.find((item: any) => item.stock_id === stockId);
        if (watchlistItem) {
            try {
                await deleteWatchlist(watchlistItem.id, token);
                setWatchlist((prev: any) => prev.filter((item: any) => item.id !== watchlistItem.id));
                console.log('Asset removed from watchlist');
            } catch (error) {
                console.error('Error removing asset from watchlist:', error);
            }
        } else {
            const values = { user_id: profile?.id, stock_id: stockId };
            try {
                const response = await sendWatchlist(values, token);
                setWatchlist((prev: any) => [...prev, response]);
                console.log('Asset added to watchlist:', response);
            } catch (error) {
                console.error('Error adding asset to watchlist:', error);
            }
        }
    };

    const isInWatchlist = (stockId: any) => {
        return watchlist.some((item: any) => item.stock_id === stockId);
    };
    let accountBalance = profile?.account_balance;
    let formattedBalance = accountBalance?.toLocaleString();

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const data = await getUserProfile(token);
            const orders = await getOrdersMe(token);
            const stockdata = await getStocks(token);
            const portfolio = await fetchPortfolio(token);
            if (data && stockdata && orders) {
              setProfile(data);
              setStocks(stockdata);
              setOrders(orders);
              setportfolioStocks(portfolio);
            }
    
            console.log(portfolioStocks)
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
        <div data-testid="main-dashboard" className='flex flex-col gap-[10px] xl:flex-row sm:gap-[12px] md:gap-[16px] lg:gap-[20px] -mt-[1.6rem] xl:gap-[20px]'>
            <div className={`w-full lg:${isCollapsed ? "w-[75%]" : "w-50%"} 2xl:w-[70%]`}>
                <p className='pb-[0.5rem] font-bold text-xl'>Buy/Sell</p>
                <div className='flex gap-[1rem] flex-col'>
                    <div className='flex flex-col gap-[1rem] lg:flex-row'>
                        <BuySellCard stocks={stocks} profile={profile} token={token} />
                        <Card className="w-[100%] h-[24rem] pb-[0.5rem] dark:bg-[#151515] lg:w-[80%] 2xl:w-[50%]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                    <div className="flex gap-[2rem] justify-between">
                                        <div className="flex flex-row gap-[2rem]">
                                            <div>
                                                <p className="text-sm">Trades Overview</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardTitle>
                                <CardDescription className="max-w-lg text-balance leading-relaxed">
                                    <div className="mt-[1rem]">
                                        <p className='text-xs'>
                                            Account Balance
                                        </p>
                                        <p className="text-1xl text-primary">
                                            {formattedBalance}
                                        </p>
                                        <div className='flex gap-[7px]'>
                                            <div className="w-[15px] h-[15px] border-2 border-[#FF0000] rounded-full mt-[3px]"></div>
                                            <p>This month</p>
                                            <div className="w-[15px] h-[15px] border-2 border-[#12B76A] rounded-full mt-[3px]"></div>
                                            <p>Last month</p>
                                        </div>
                                    </div>
                                    <BarChart />
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                    <div className='flex flex-col gap-[1rem] lg:flex-row'>
                        <Card className="w-full h-[24rem] pb-[2.1rem] dark:bg-[#151515] lg:w-[50%] 2xl:w-[50%] overflow-hidden">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">
                                    <div className="flex gap-8 justify-between">
                                        <div className="flex flex-row">
                                            <div>
                                                <p className="text-sm">Trade Overview</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardTitle>
                                <div
                                    className="max-w-lg h-80 overflow-auto"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    <CardDescription className="text-balance leading-relaxed">
                                        {portfolioStocks?.map((item: any) => (
                                            <div key={item.id}>
                                                <div className='flex justify-between pt-2'>
                                                    <div className='flex gap-2'>
                                                        <Image
                                                            width={40}
                                                            height={30}
                                                            src={item?.stock?.image}
                                                            className="object-contain"
                                                            alt="user image"
                                                        />
                                                        <div className='relative top-1'>
                                                            <p className='text-primary font-semibold'>{item?.stock?.symbol}</p>
                                                            <p className='text-[12px]'>{item?.stock?.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className='w-[5rem]'>
                                                        <p className='text-primary font-bold'>{item?.amount} shares</p>
                                                        <div className='flex'>
                                                            <p className={`font-normal ${getTextColor(item?.stock?.movement)}`}>{item?.stock?.percentageChange.toFixed(2)}%</p>
                                                            {getMovementIcon(item?.stock?.movement)}
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
                        <Card className="w-[100%] h-[24rem] pb-[1rem] dark:bg-[#151515] lg:w-[50%] 2xl:w-[50%]">
                            <CardDescription>
                                <Tabs defaultValue="week" onValueChange={setTab}>
                                    <div className="flex justify-between px-3 py-1">
                                        <div className="flex flex-row gap-[2rem]">
                                            <div className='relative top-[1rem]'>
                                                <p className="text-sm text-primary font-semibold">Trades Overview</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center w-[9rem] relative ml-[2rem]">
                                            <TabsList className=''>
                                                <TabsTrigger className='inline-flex items-center z-10 justify-center whitespace-nowrap px-3 py-1.5 text-[10px] font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-[#1890FF] data-[state=active]:border-b-2 data-[state=active]:border-[#1890FF]' value="week">Week</TabsTrigger>
                                                <TabsTrigger className='inline-flex items-center z-10 justify-center whitespace-nowrap px-3 py-1.5 text-[10px] font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-[#1890FF] data-[state=active]:border-b-2 data-[state=active]:border-[#1890FF]' value="month">Month</TabsTrigger>
                                                <TabsTrigger className='inline-flex items-center z-10 justify-center whitespace-nowrap px-3 py-1.5 text-[10px] font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-[#1890FF] data-[state=active]:border-b-2 data-[state=active]:border-[#1890FF]' value="year">Year</TabsTrigger>
                                            </TabsList>
                                            <span className="absolute bottom-[0.5px] left-0 w-full border-b-2 border-[#ccc]" style={{ transform: 'translateY(-2.5px)' }}></span>
                                        </div>
                                    </div>
                                    <TabsContent value="week">
                                        <p className="ml-[0.7rem] mt-[1rem] text-xs">Portfolio Balance</p>
                                        <p className="text-2xl text-primary ml-[0.7rem] mt-[1rem]">
                                            {profile?.account_balance.toLocaleString()}
                                        </p>
                                        <LineChart datas={data} />
                                    </TabsContent>
                                    <TabsContent value="month">
                                        <p className="ml-[0.7rem] mt-[1rem] text-xs">Portfolio Balance</p>
                                        <p className="text-2xl text-primary ml-[0.7rem] mt-[1rem]">
                                            {profile?.account_balance.toLocaleString()}
                                        </p>
                                        <LineChartMonths datas={data} />
                                    </TabsContent>
                                    <TabsContent value="year">
                                        <p className="ml-[0.7rem] mt-[1rem] text-xs">Portfolio Balance</p>
                                        <p className="text-2xl text-primary ml-[0.7rem] mt-[1rem]">
                                            {profile?.account_balance.toLocaleString()}
                                        </p>
                                        <LineChartYears datas={data} />
                                    </TabsContent>
                                </Tabs>
                            </CardDescription>
                        </Card>
                    </div>
                    <div className='pb-[2rem]'>
                        <div className='hidden md:flex flex-wrap gap-[1rem]'>
                            <p className='pt-[1rem] pb-[0.5rem] text-lg font-bold'>Statistics</p>
                            <div className="relative w-[75px] mt-[13px]">
                                <select
                                    className="w-full h-[30px] px-2 py-1 text-xs text-md font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#000] appearance-none"
                                    value={year1}
                                    onChange={(e) => handleChange(e, setYear1)}
                                >
                                    <option value="" disabled selected hidden className="text-xs w-[85px]">
                                        {"Years"}
                                    </option>
                                    {options2.map((option, index) => (
                                        <option key={index} value={option.value} className="text-xs">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 bottom-[0.3rem] flex items-center px-2 pointer-events-none">
                                    <TiArrowSortedDown className='dark:text-[#000]' />
                                </div>
                            </div>
                            <div className="relative w-[82px] mt-[13px]">
                                <select className="w-full h-[30px] px-2 py-1 text-xs text-md font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#000] appearance-none"
                                    value={month1}
                                    onChange={(e) => handleChange(e, setMonth1)}>
                                    <option value="" disabled selected hidden className="text-xs w-[85px]">
                                        {"Months"}
                                    </option>
                                    {months.map((option, index) => (
                                        <option key={index} value={option.value} className="text-xs">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 bottom-[0.3rem] flex items-center px-2 pointer-events-none">
                                    <TiArrowSortedDown className='dark:text-[#000]' />
                                </div>
                            </div>
                            <p className='mt-[14px]'>compared to</p>
                            <div className="relative w-[75px] mt-[13px]">
                                <select className="w-full h-[30px] px-2 py-1 text-xs text-md font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#000] appearance-none"
                                    value={year2}
                                    onChange={(e) => handleChange(e, setYear2)}>
                                    <option value="" disabled selected hidden className="text-xs w-[85px]">
                                        {"Years"}
                                    </option>
                                    {options2.map((option, index) => (
                                        <option key={index} value={option.value} className="text-xs">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 bottom-[0.3rem] flex items-center px-2 pointer-events-none">
                                    <TiArrowSortedDown className='dark:text-[#000]' />
                                </div>
                            </div>
                            <div className="relative w-[82px] mt-[13px]">
                                <select className="w-full h-[30px] px-2 py-1 text-xs text-md font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#000] appearance-none"
                                    value={month2}
                                    onChange={(e) => handleChange(e, setMonth2)}
                                >
                                    <option value="" disabled selected hidden className="text-xs w-[85px]">
                                        {"Months"}
                                    </option>
                                    {months.map((option, index) => (
                                        <option key={index} value={option.value} className="text-xs">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 bottom-[0.3rem] flex items-center px-2 pointer-events-none">
                                    <TiArrowSortedDown className='dark:text-[#000]' />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-[10px] md:hidden'>
                            <div className=''>
                                <p className='pt-[1rem] pb-[0.5rem] text-lg font-bold'>Statistics</p>
                            </div>
                            <div className='flex gap-[1rem]'>
                                <select className="w-[75px] h-[30px] mt-[13px] px-2 py-1 text-xs text-md font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#000]">
                                    <option value="" disabled selected hidden className="text-xs w-[85px]">
                                        {"Years"}
                                    </option>
                                    {options.map((option, index) => (
                                        <option key={index} value={option.value} className="text-xs">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <select className="w-[145px] h-[30px] mt-[13px] px-2 py-1 text-xs text-md font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#000]">
                                    <option value="" disabled selected hidden className="text-xs w-[85px]">
                                        {"Aug 20th - Dec 4th"}
                                    </option>
                                    {options.map((option, index) => (
                                        <option key={index} value={option.value} className="text-xs">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <p className='mt-[14px] text-sm'>compared to</p>
                            </div>
                            <div className='flex gap-[1rem]'>
                                <select className="w-[90px] h-[30px] px-2 py-1 text-xs text-md font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#000]">
                                    <option value="" disabled selected hidden className="text-xs w-[85px]">
                                        {"Previous"}
                                    </option>
                                    {options.map((option, index) => (
                                        <option key={index} value={option.value} className="text-xs">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="w-[75px] h-[30px] flex items-center bg-[#fff] px-2 py-1 text-xs border rounded-md dark:text-[#000]">
                                    <Plus className='' size={15} />
                                    <p className='text-md'>Add</p>
                                </div>
                                <div className="w-[75px] h-[30px] flex items-center bg-[#fff] px-2 text-xs border rounded-md dark:text-[#000]">
                                    <Settings className='' size={15} />
                                    <p className='text-md'>Edit</p>
                                </div>
                            </div>
                            <select className="w-[75px] h-[30px] px-2 py-1 text-xs text-md font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-[#000]">
                                <option value="" disabled selected hidden className="text-xs w-[85px]">
                                    {"2024"}
                                </option>
                                {options.map((option, index) => (
                                    <option key={index} value={option.value} className="text-xs">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Card className='w-[100%] h-[100%] mt-[1rem] dark:bg-[#151515]'>
                            <Tabs defaultValue="all">
                                <div className="flex flex-col px-4 py-1">
                                    <div className="flex flex-row gap-[2rem]">
                                        <div className='pt-2'>
                                            <p className="text-lg text-primary">Stock Market</p>
                                        </div>
                                    </div>
                                    <div className="flex w-[100%]">
                                        <TabsList className='flex justify-center items-center flex-wrap md:flex-nowrap gap-[0.7rem]'>
                                            <TabsTrigger className='inline-flex w-10 z-10 border-[1px] text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50 data-[state=active]:text-[#fff] data-[state=active]:bg-[#000] dark:data-[state=active]:bg-[#fff] dark:data-[state=active]:text-[#000]' value="all">All</TabsTrigger>
                                            <TabsTrigger className='inline-flex z-10 border-[1px] text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50 data-[state=active]:text-[#fff] data-[state=active]:bg-[#000] dark:data-[state=active]:bg-[#fff] dark:data-[state=active]:text-[#000]' value="finance">Finance Service</TabsTrigger>
                                            <TabsTrigger className='inline-flex z-10 border-[1px] text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50 data-[state=active]:text-[#fff] data-[state=active]:bg-[#000] dark:data-[state=active]:bg-[#fff] dark:data-[state=active]:text-[#000]' value="energy">Energy</TabsTrigger>
                                            <TabsTrigger className='inline-flex z-10 border-[1px] text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50 data-[state=active]:text-[#fff] data-[state=active]:bg-[#000] dark:data-[state=active]:bg-[#fff] dark:data-[state=active]:text-[#000]' value="materials">Materials</TabsTrigger>
                                            <TabsTrigger className='inline-flex z-10 border-[1px] text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50 data-[state=active]:text-[#fff] data-[state=active]:bg-[#000] dark:data-[state=active]:bg-[#fff] dark:data-[state=active]:text-[#000]' value="technology">Technology</TabsTrigger>
                                            <TabsTrigger className='inline-flex z-10 border-[1px] text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50 data-[state=active]:text-[#fff] data-[state=active]:bg-[#000] dark:data-[state=active]:bg-[#fff] dark:data-[state=active]:text-[#000]' value="consumer">Consumer Staples</TabsTrigger>
                                            <TabsTrigger className='inline-flex z-10 border-[1px] text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50 data-[state=active]:text-[#fff] data-[state=active]:bg-[#000] dark:data-[state=active]:bg-[#fff] dark:data-[state=active]:text-[#000]' value="media">Media</TabsTrigger>
                                            <TabsTrigger className='inline-flex z-10 border-[1px] text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50 data-[state=active]:text-[#fff] data-[state=active]:bg-[#000] dark:data-[state=active]:bg-[#fff] dark:data-[state=active]:text-[#000]' value="industrials">Industrials</TabsTrigger>
                                            <TabsTrigger className='inline-flex z-10 border-[1px] text-primary font-normal border-[#000] dark:border-[#fff] rounded-2xl justify-center px-1 py-1.5 text-[9px] transition-all disabled:opacity-50 data-[state=active]:text-[#fff] data-[state=active]:bg-[#000] dark:data-[state=active]:bg-[#fff] dark:data-[state=active]:text-[#000]' value="healthcare">Healthcare</TabsTrigger>
                                        </TabsList>
                                    </div>
                                </div>
                                <TabsContent value="all" className='flex justify-center align-center pt-[4rem] lg:pt-[0rem]'>
                                    <Table className='w-[100%]'>
                                        <TableHeader className='[&_tr]:border-0'>
                                            <TableRow >
                                                <TableHead>Asset Name</TableHead>
                                                <TableHead className="sm:table-cell">Price</TableHead>
                                                <TableHead className="hidden sm:table-cell">Change</TableHead>
                                                <TableHead className="hidden md:table-cell">MarketCap</TableHead>
                                                <TableHead className={`hidden md:table-cell text-right ${isCollapsed ? "relative right-[2rem]" : ""}`}>Watchlist</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stocksTable?.map((asset: any, index: any) => (
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
                                                        ${asset.stock.price.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className={`hidden md:flex hidden md:flex relative ${isCollapsed ? "bottom-[0.6rem]" : ""}`}>
                                                        <p className='text-md text-green-500'>{asset.change}</p>
                                                        <TiArrowSortedDown className={`relative w-3 h-3 text-green-500 top-[0.3rem]`} />
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {truncateNumber(asset.market_cap, 9)}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-right relative left-[0.5rem]">
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
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                            <BuySellForm isOpen={buySellModal} onClose={closeModal} profile={profile} token={token} selectedAsset={selectedAsset} />
                        </Card>
                    </div>
                </div>
            </div>
            <div className={`pt-[2.3rem] mb-[2rem]`}>
                <Card className={`w-[100%] h-[100%] p-[8px] flex justify-center align-center dark:bg-[#151515]`}>
                    <CardDescription>
                        <div className="flex flex-row gap-[2rem] p-2">
                            <div>
                                <p className="text-sm text-primary font-semibold">Order Book</p>
                            </div>
                        </div>
                        <Table className='w-[20rem] h-[100%] mt-[1rem] lg:w-[100%]'>
                            <TableHeader className='mt-[4rem] h-[4rem] [&_tr]:border-0 overflow-hidden rounded-lg'>
                                <div className='bg-muted dark:bg-[#000] rounded-lg w-[99.8%] h-[3rem]'>
                                    <TableRow className={`flex`}>
                                        <TableHead className={`flex text-xs relative top-[1rem] left-[1rem] lg:left-[0rem]`}>
                                            Price
                                            <ArrowDownUp strokeWidth={1} className='w-4 h-4' />
                                        </TableHead>
                                        <TableHead className={`flex text-xs relative top-[1rem] left-[2.5rem] lg:left-[0rem]`}>
                                            Amount
                                            <ArrowDownUp strokeWidth={1} className='w-4 h-4' />
                                        </TableHead>
                                        <TableHead className={`flex text-xs relative top-[1rem] left-[4rem] lg:left-[0rem]`}>
                                            Total
                                            <ArrowDownUp strokeWidth={1} className='w-4 h-4' />
                                        </TableHead>
                                    </TableRow>
                                </div>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 60 }).map((_, index) => {
                                    const row = orders[index % orders?.length];
                                    const calculatedValue = row?.unit_price * row?.amount;
                                    let formattedBalance = row?.unit_price?.toLocaleString();
                                    let finalValue = calculatedValue.toLocaleString();
                                    if (row?.action === 'sell') {
                                        return (
                                            <div key={index} style={{ marginBottom: '4px', marginTop: '2px' }}>
                                                <TableRow className='border-0'>
                                                    <TableCell className={`text-[14px] w-[8rem] text-[#C0C0C0] lg:text-[8px] lg:w-[5.5rem]`}>
                                                        {formattedBalance}
                                                    </TableCell>
                                                    <TableCell className={`text-[14px] w-[6rem] bg-red-100 text-[#000] rounded-l-md lg:text-[8px] dark:bg-[#FF7A00] dark:bg-opacity-30 dark:text-[#fff] lg:w-[5.5rem]`}>
                                                        {row?.amount}
                                                    </TableCell>
                                                    <TableCell className={`text-[14px] w-[6rem] bg-red-100 text-[#FF0000] rounded-r-md lg:text-[8px] dark:bg-[#FF7A00] dark:bg-opacity-30 lg:w-[4rem]`}>
                                                        {finalValue}
                                                    </TableCell>
                                                </TableRow>
                                            </div>
                                        );
                                    } else if (row?.action === 'buy') {
                                        return (
                                            <div key={index} style={{ marginBottom: '4px', marginTop: '2px' }}>
                                                <TableRow className='border-0'>
                                                    <TableCell className={`text-[14px] w-[8rem] bg-green-100 text-[#12B76A] rounded-l-md lg:text-[8px] dark:bg-[#12B76A] dark:bg-opacity-40 lg:w-[5.5rem]`}>
                                                        {formattedBalance}
                                                    </TableCell>
                                                    <TableCell className={`text-[14px] w-[6rem] bg-green-100 text-[#000] rounded-r-md lg:text-[8px] dark:text-[#fff] dark:bg-[#12B76A] dark:bg-opacity-40 lg:w-[5.5rem]`}>
                                                        {row?.amount}
                                                    </TableCell>
                                                    <TableCell className={`text-[14px] w-[6rem] text-[#C0C0C0] lg:text-[8px] lg:w-[4rem]`}>
                                                        {finalValue}
                                                    </TableCell>
                                                </TableRow>
                                            </div>
                                        );
                                    }

                                    return null;
                                })}
                            </TableBody>

                        </Table>
                    </CardDescription>
                </Card>
            </div>
        </div>
    );
};
export default MainDashboard;

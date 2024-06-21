import { Button } from "@/components/ui/button"
import { Card, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { placeOrder } from "@/lib/apiUtils"
import ConfirmModal from "../modals/ConfirmModal"
import SellModal from "../modals/SellModal"


const BuySellCard = ({ stocks, profile, token }: any) => {
    const [priceToBuy, setPriceToBuy] = useState('');
    const [availableToBuy, setAvailableToBuy] = useState('');
    const [priceToSell, setPriceToSell] = useState('');
    const [availableToSell, setAvailableToSell] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [stockToBuy, setStockToBuy] = useState<any>();
    const [stockToSell, setStockToSell] = useState<any>();
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [isBuyModalMarketOpen, setIsBuyModalMarketOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [isSellModalMarketOpen, setIsSellModalMarketOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleStockSelectToBuy = (stockSymbol: any) => {
        const stock = stocks.find((s: { symbol: React.SetStateAction<null>; }) => s.symbol === stockSymbol);
        setStockToBuy(stock);
        setPriceToBuy(stock ? stock.price : '');
        setAvailableToBuy(stock ? stock.availableToBuy : '');
    };
    const handleStockSelectToSell = (stockSymbol: any) => {
        const stock = stocks.find((s: { symbol: React.SetStateAction<null>; }) => s.symbol === stockSymbol);
        setStockToSell(stock)
        setPriceToSell(stock ? stock.price : '');
        setAvailableToSell(stock ? stock.availableToSell : '');
    };

    const openModal = () => setIsBuyModalOpen(true);
    const closeModal = () => setIsBuyModalOpen(false);
    const openMarketModal = () => setIsBuyModalMarketOpen(true);
    const closeMarketModal = () => setIsBuyModalMarketOpen(false);
    const openSellModal = () => setIsSellModalOpen(true);
    const closeSellModal = () => setIsSellModalOpen(false);
    const openSellMarketModal = () => setIsSellModalMarketOpen(true);
    const closeSellMarketModal = () => setIsSellModalMarketOpen(false);

    const confirmAction = async () => {
        setIsLoading(true);
        const orderData = {
            type: 'limit',
            amount: quantity,
            symbol: stockToBuy?.symbol,
            action: 'buy',
            status: 'pending',
            user_id: profile.id,
            stock_id: stockToBuy?.id,
            unit_price: priceToBuy,
            filled_amount: 0,
            filled_average_price: 0,
            limit_price: 0,
            stop_price: 0
        };       
        try {
            const result = await placeOrder(orderData, token);
            console.log("limit order")
            console.log(orderData)
            window.location.reload();
        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            setPriceToBuy('')
            setAvailableToBuy('')
            setPriceToSell('')
            setAvailableToSell('')
            setQuantity(0)
            setIsLoading(false);
        }
        closeModal();
    };
    const confirmActionMarket = async () => {
        setIsLoading(true);
        const orderData = {
            type: 'market',
            amount: quantity,
            symbol: stockToBuy?.symbol,
            action: 'buy',
            status: 'pending',
            user_id: profile.id,
            stock_id: stockToBuy?.id,
            unit_price: priceToBuy,
            filled_amount: 0,
            filled_average_price: 0,
            limit_price: 0,
            stop_price: 0
        };
        try {
            const result = await placeOrder(orderData, token);
            console.log(orderData)
            window.location.reload();
        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            setPriceToBuy('')
            setAvailableToBuy('')
            setPriceToSell('')
            setAvailableToSell('')
            setQuantity(0)
            setIsLoading(false);
        }
        closeMarketModal();
    };
    const confirmActionToSell = async () => {
        setIsLoading(true);
        const orderData = {
            type: 'limit',
            amount: quantity,
            symbol: stockToSell?.symbol,
            action: 'sell',
            user_id: profile.id,
            stock_id: stockToSell?.id,
            unit_price: priceToSell,
            filled_amount: 0,
            filled_average_price: 0,
            limit_price: 0,
            stop_price: 0
        };
        try {
            await placeOrder(orderData, token);
            console.log(orderData);
            window.location.reload();
        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            setPriceToBuy('')
            setAvailableToBuy('')
            setPriceToSell('')
            setAvailableToSell('')
            setQuantity(0)
            setIsLoading(false);
        }
        closeSellModal();
    };
    const confirmActionToSellMarket = async () => {
        setIsLoading(true);
        const orderData = {
            type: 'market',
            amount: quantity,
            symbol: stockToSell?.symbol,
            action: 'sell',
            user_id: profile.id,
            stock_id: stockToSell?.id,
            unit_price: priceToSell,
            filled_amount: 0,
            filled_average_price: 0,
            limit_price: 0,
            stop_price: 0
        };
        try {
            await placeOrder(orderData, token);
            console.log(orderData);
            window.location.reload();
        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            setPriceToBuy('')
            setAvailableToBuy('')
            setPriceToSell('')
            setAvailableToSell('')
            setQuantity(0)
            setIsLoading(false);
        }
        closeSellMarketModal();
    };
    return (
        <Card data-testid="main-buy-sell" className="w-[100%] h-[24rem] pb-[1rem] dark:bg-[#151515] lg:w-[80%] 2xl:w-[50%]">
            <CardDescription>
                <Tabs defaultValue="buy">
                    <div className="flex items-center">
                        <TabsList className={`inline-flex ml-[0.5rem] w-[95%] h-10 rounded-md p-1 text-muted-foreground bg-muted dark:bg-[#000] mt-[0.5rem] lg:w-[95%]`}>
                            <TabsTrigger className='inline-flex z-10 w-[50%] text-primary rounded-md justify-center whitespace-nowrap px-3 py-1.5 text-sm font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:bg-[#fff] dark:data-[state=active]:bg-[#151515]' value="buy">Buy</TabsTrigger>
                            <TabsTrigger className='inline-flex z-10 w-[50%] text-primary rounded-md justify-center whitespace-nowrap px-3 py-1.5 text-sm font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:bg-[#fff] dark:data-[state=active]:bg-[#151515]' value="sell">Sell</TabsTrigger>
                        </TabsList>
                    </div>
                    <p className="ml-[1.2rem] mt-[1rem] text-xs">Account Balance</p>
                    <TabsContent value="buy">
                        <Tabs defaultValue="limit">
                            <div className="flex px-2">
                                <div className="flex">
                                    <TabsList className=''>
                                        <TabsTrigger className='px-1.5 py-1.5 text-xs font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-[#FFD84A]' value="limit">Limit Order</TabsTrigger>
                                        <TabsTrigger className='px-1.5 py-1.5 text-xs font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-[#FFD84A]' value="market">Market Order</TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>
                            <TabsContent value="limit">
                                <div>
                                    <div className='pl-3'>
                                        <Select name="stock" onValueChange={handleStockSelectToBuy}>
                                            <SelectTrigger className="w-[96%]">
                                                <SelectValue placeholder="Select Asset" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {stocks?.map((stock: any) => (
                                                        <SelectItem key={stock.symbol} value={stock.symbol}>
                                                            {stock.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Input name="price" className="mt-[1rem] w-[96%]" value={priceToBuy} readOnly placeholder="At what price?" />
                                        <Input name="quantity" type="number" className="mt-[1rem] w-[96%]" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} placeholder="How much do you want to buy" />
                                        <div className="mt-[0.3rem] ml-[1.3rem] text-gray-500 text-[10px]">
                                            {`Available: ${availableToBuy}`}
                                        </div>
                                    </div>
                                    <div className="pt-[1rem] flex justify-center align-center">
                                        <Button variant="outline" className="w-[70%] bg-[#0958D9] text-secondary font-normal" onClick={openModal}>
                                            Continue
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="market">
                                <div>
                                    <div className='pl-3'>
                                        <Select onValueChange={handleStockSelectToBuy}>
                                            <SelectTrigger className="w-[96%]">
                                                <SelectValue placeholder="Select Asset" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {stocks?.map((stock: any) => (
                                                        <SelectItem key={stock.symbol} value={stock.symbol}>
                                                            {stock.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Input className="mt-[1rem] w-[96%]" value={priceToBuy} readOnly placeholder="At what price?" />
                                        <Input type="number" className="mt-[1rem] w-[96%]" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} placeholder="How much do you want to buy" />
                                        <div className="mt-[0.3rem] ml-[1.3rem] text-gray-500 text-[10px]">
                                            {`Available: ${availableToBuy}`}
                                        </div>
                                    </div>
                                    <div className="pt-[1rem] flex justify-center align-center">
                                        <Button variant="outline" className="w-[70%] bg-[#0958D9] text-secondary font-normal" onClick={openMarketModal}>
                                            Continue
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="sell">
                        <Tabs defaultValue="limit">
                            <div className="flex px-2">
                                <div className="flex">
                                    <TabsList className=''>
                                        <TabsTrigger className='px-1.5 py-1.5 text-xs font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-[#FFD84A]' value="limit">Limit Order</TabsTrigger>
                                        <TabsTrigger className='px-1.5 py-1.5 text-xs font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-[#FFD84A]' value="market">Market Order</TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>
                            <TabsContent value="limit">
                                <div>
                                    <div className='pl-3'>
                                        <Select onValueChange={handleStockSelectToSell}>
                                            <SelectTrigger className="w-[96%]">
                                                <SelectValue placeholder="Select Asset" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {stocks.map((stock: any) => (
                                                        <SelectItem key={stock.symbol} value={stock.symbol}>
                                                            {stock.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Input className="mt-[1rem] w-[96%]" value={priceToSell} readOnly placeholder="At what price?" />
                                        <Input className="mt-[1rem] w-[96%]" type="number" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} placeholder="How much do you want to sell" />
                                        <div className="mt-[0.3rem] ml-[1.3rem] text-gray-500 text-[10px]">
                                            {`Available: ${availableToSell}`}
                                        </div>
                                    </div>
                                    <div className="pt-[1rem] flex justify-center align-center">
                                        <Button variant="outline" className="w-[70%] bg-[#0958D9] text-secondary font-normal" onClick={openSellModal}>Continue</Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="market">
                                <div>
                                    <div className='pl-3'>
                                        <Select onValueChange={handleStockSelectToSell}>
                                            <SelectTrigger className="w-[96%]">
                                                <SelectValue placeholder="Select Asset" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {stocks.map((stock: any) => (
                                                        <SelectItem key={stock.symbol} value={stock.symbol}>
                                                            {stock.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Input className="mt-[1rem] w-[96%]" value={priceToSell} readOnly placeholder="At what price?" />
                                        <Input className="mt-[1rem] w-[96%]" type="number" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} placeholder="How much do you want to sell" />
                                        <div className="mt-[0.3rem] ml-[1.3rem] text-gray-500 text-[10px]">
                                            {`Available: ${availableToSell}`}
                                        </div>
                                    </div>
                                    <div className="pt-[1rem] flex justify-center align-center">
                                        <Button variant="outline" className="w-[70%] bg-[#0958D9] text-secondary font-normal" onClick={openSellMarketModal}>Continue</Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                </Tabs>
                <ConfirmModal isOpen={isBuyModalOpen} onClose={closeModal} onConfirm={confirmAction} isLoading={isLoading} stock={stockToBuy} quantity={quantity} price={priceToBuy} profile={profile} />
                <ConfirmModal isOpen={isBuyModalMarketOpen} onClose={closeMarketModal} onConfirm={confirmActionMarket} isLoading={isLoading} stock={stockToBuy}  quantity={quantity} price={priceToBuy} profile={profile} />
                <SellModal isOpen={isSellModalOpen} onClose={closeSellModal} onConfirm={confirmActionToSell} isLoading={isLoading} stock={stockToSell}  quantity={quantity} price={priceToSell} profile={profile}/>
                <SellModal isOpen={isSellModalMarketOpen} onClose={closeSellMarketModal} onConfirm={confirmActionToSellMarket} isLoading={isLoading} stock={stockToSell} quantity={quantity} price={priceToSell} profile={profile}/>
            </CardDescription>
        </Card>
    )
}

export default BuySellCard;
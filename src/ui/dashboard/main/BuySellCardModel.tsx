import { Button } from "@/components/ui/button"
import { Card, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ConfirmModal from "../modals/ConfirmModal"
import { useState } from "react"
import { placeOrder } from "@/lib/apiUtils"

const BuySellCardModel = ({ profile, token, selectedAsset, onClose }: any) => {
    const [quantity, setQuantity] = useState(0);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [isBuyModalMarketOpen, setIsBuyModalMarketOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const openModal = () => setIsBuyModalOpen(true);
    const closeModal = () => setIsBuyModalOpen(false);
    const openMarketModal = () => setIsBuyModalMarketOpen(true);
    const closeMarketModal = () => setIsBuyModalMarketOpen(false);

    const confirmAction = async () => {
        setIsLoading(true);
        const orderData = {
            type: 'limit',
            amount: quantity,
            symbol: selectedAsset?.symbol,
            action: 'buy',
            status: 'pending',
            user_id: profile.id,
            stock_id: selectedAsset?.id,
            unit_price: selectedAsset?.price,
            filled_amount: 0,
            filled_average_price: 0,
            limit_price: 0,
            stop_price: 0
        };
        console.log("limit order")
        console.log(orderData)
        try {
            const result = await placeOrder(orderData, token);
        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            setQuantity(0)
            setIsLoading(false);
        }
        onClose();
    };
    const confirmActionMarket = async () => {
        setIsLoading(true);
        const orderData = {
            type: 'market',
            amount: quantity,
            symbol: selectedAsset?.symbol,
            action: 'buy',
            status: 'pending',
            user_id: profile.id,
            stock_id: selectedAsset?.id,
            unit_price: selectedAsset?.price,
            filled_amount: 0,
            filled_average_price: 0,
            limit_price: 0,
            stop_price: 0
        };
        try {
            const result = await placeOrder(orderData, token);
            console.log(orderData)
        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            setQuantity(0)
            setIsLoading(false);
        }
        onClose();
    };
    return (
        <Card data-testid="main-buy-sell" className="w-[100%] h-[20rem] pb-[1rem] dark:bg-[#151515] lg:w-[80%] 2xl:w-[50%]">
            <CardDescription>
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
                                <Input name="stock" className="mt-[1rem] w-[96%]" value={selectedAsset?.name || ''} readOnly placeholder="Stock" />
                                <Input name="price" className="mt-[1rem] w-[96%]" value={selectedAsset?.price || ''} readOnly placeholder="At what price?" />
                                <Input name="quantity" type="number" className="mt-[1rem] w-[96%]" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} placeholder="How much do you want to buy" />
                                <div className="mt-[0.3rem] ml-[1.3rem] text-gray-500 text-[10px]">
                                    {`Available: ${selectedAsset.availableToBuy}`}
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
                                <Input name="stock" className="mt-[1rem] w-[96%]" value={selectedAsset?.name || ''} readOnly placeholder="Stock" />
                                <Input className="mt-[1rem] w-[96%]" value={selectedAsset?.price || ''} readOnly placeholder="At what price?" />
                                <Input type="number" className="mt-[1rem] w-[96%]" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} placeholder="How much do you want to buy" />
                                <div className="mt-[0.3rem] ml-[1.3rem] text-gray-500 text-[10px]">
                                    {`Available: ${selectedAsset.availableToBuy}`}
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
                <ConfirmModal isOpen={isBuyModalOpen} onClose={closeModal} onConfirm={confirmAction} isLoading={isLoading} stock={selectedAsset} quantity={quantity} price={selectedAsset?.price} profile={profile} />
                <ConfirmModal isOpen={isBuyModalMarketOpen} onClose={closeMarketModal} onConfirm={confirmActionMarket} isLoading={isLoading} stock={selectedAsset} quantity={quantity} price={selectedAsset?.price} profile={profile} />
            </CardDescription>
        </Card>
    )
}

export default BuySellCardModel;
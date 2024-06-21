import React, { useState } from 'react';
import Image from "next/image";

const SellModal = (
    {
        isOpen,
        onClose,
        onConfirm,
        isLoading,
        stock,
        quantity,
        price,
        confirmText,
        profile
    }: any
) => {
    
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tuesday Wallet');

    const totalAmount = price * quantity;
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 dark:bg-[#151515]">
                <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-[#fff]">Confirm Sell Action</h2>
                <div className="mb-4 flex items-center">
                    <div className="h-[5rem] w-[5rem] rounded-full overflow-hidden mx-auto">
                        <Image
                            width={50}
                            height={40}
                            src={stock.image}
                            alt="User Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-[primary] text-lg font-semibold">{stock.name}</p>
                        <p className="text-[primary]">Price: {profile.currency} {price}</p>
                        <p className="text-[primary]">shares: {quantity}</p>
                        <p className="text-[primary]">Total Amount: {totalAmount}</p>
                    </div>
                </div>
                <p className="text-[primary] mb-6">{confirmText || 'Are you sure you want to continue to sell the stock?'}</p>

                <hr className="my-4" />

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-[primary] mb-2">Payment Method</h3>
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="tuesdayWallet"
                            name="paymentMethod"
                            value="Tuesday Wallet"
                            checked={selectedPaymentMethod === 'Tuesday Wallet'}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        <label htmlFor="tuesdayWallet" className="text-[primary]">Tuesday Wallet</label>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => onConfirm()}
                        className="bg-[#0958D9] text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isLoading ? 'Loading...' : 'Yes Continue'}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellModal;

import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Confirm Action</h2>
                <p className="text-gray-700 mb-6">Are you sure you want to continue to logout?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onConfirm}
                        className="bg-[#0958D9] text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        <p>{"Continue"}</p>
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

export default LogoutModal;

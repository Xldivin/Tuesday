import React from "react";

interface LoaderProps {
  showText?: boolean;
}

const Loader = ({ showText = false }: LoaderProps) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center ">
      {/* Loader Spinner */}
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-[3rem] w-[3rem] border-t-4 border-b-4 border-blue-500"></div>
      </div>
      {showText && (
        <h1 className="mt-6 text-lg text-gray-700">Please wait...</h1>
      )}
    </div>
  );
};

export default Loader;

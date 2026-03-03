import React from "react";
import logo from "../assets/logo1.webp";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      {/* Loader wrapper */}
      <div className="flex flex-col items-center relative z-10">
        {/* Ring + logo container */}
        <div className="relative h-32 w-32 mb-6">
          {/* Spinning arc with inline animation */}
          <div 
            className="absolute inset-0 rounded-full border-4 border-gray-300 border-t-green-500 border-r-green-500 shadow-lg"
            style={{
              animation: 'spin 1.5s linear infinite'
            }}
          />

          {/* Centered logo (static) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={logo}
              alt="Company Logo"
              className="h-20 w-20 rounded-full bg-white p-1.5 shadow-lg object-contain"
            />
          </div>
        </div>

        {/* Optional text */}
        <p className="text-lg font-semibold text-white/90">
          Loading...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

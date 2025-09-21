import Category from "@/components/Category";
import Discover from "@/components/Discover";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Beige Background */}
      <div className="fixed top-0 left-0 w-full h-[220px] sm:h-[280px] md:h-[300px] backdrop-blur-[90px] bg-[#eae6d7] rounded-b-[40px] sm:rounded-b-[50px] md:rounded-b-[60px] z-0"></div>

      {/* Content Section */}
      <div className="relative z-10">
        {/* Title inside beige section */}
        <div className="h-[220px] sm:h-[280px] md:h-[300px] flex justify-center items-center text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Discover</h1>
        </div>

        {/* White bottom section */}
        <div className="bg-white/30 backdrop-blur-md min-h-[400px] sm:min-h-[500px] p-4 sm:p-6 md:p-8 rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] -mt-6 sm:-mt-8 md:-mt-10 shadow-lg">
          <Discover />
          <Category />
        </div>
      </div>
    </div>
  );
};

export default Page;

import Discover from "@/components/Discover";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen">
  {/* Fixed Beige Background */}
  <div className="fixed top-0 left-0 w-full h-[300px] bg-[#eae6d7] rounded-b-[60px] z-0"></div>

  {/* Content Section */}
  <div className="relative z-10">
    {/* Title inside beige section */}
    <div className="h-[300px] flex justify-center items-center">
      <h1 className="text-3xl font-bold">Discover</h1>
    </div>

    {/* White bottom section */}
    <div className="bg-white min-h-[500px] p-8 rounded-t-[40px] -mt-10 shadow-lg">
      <Discover />
    </div>
  </div>
</div>

  );
};

export default Page;

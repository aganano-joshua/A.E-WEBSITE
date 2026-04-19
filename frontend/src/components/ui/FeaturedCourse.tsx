import React from "react";

interface CourseDetail {
  Thumbs: string;
  id: number;
  title: string;
  by: string;
  rate: string;
  time: string;
  total: string;
  stage: string;
  price: string;
}

const FeaturedCourse: React.FC = () => {
  const Featured_Data: CourseDetail[] = [
    {
      Thumbs: "/Rectangle 1080.png",
      id: 2,
      title: "Beginner’s Guide to Design",
      by: "By Ronald Richards",
      rate: "/ratings.png",
      time: "22h",
      total: "122",
      stage: "Beginner",
      price: "$149.9",
    },
    {
      Thumbs: "/Rectangle 1080.png",
      id: 4,
      title: "Beginner’s Guide to Design",
      by: "By Ronald Richards",
      rate: "/ratings.png",
      time: "22h",
      total: "122",
      stage: "Beginner",
      price: "$149.9",
    },
   {
      Thumbs: "/Rectangle 1080.png",
      id: 3,
      title: "Beginner’s Guide to Design",
      by: "By Ronald Richards",
      rate: "/ratings.png",
      time: "22h",
      total: "122",
      stage: "Beginner",
      price: "$149.9",
    },
    {
      Thumbs: "/Rectangle 1080.png",
      id: 1,
      title: "Beginner’s Guide to Design",
      by: "By Ronald Richards",
      rate: "/ratings.png",
      time: "22h",
      total: "122",
      stage: "Beginner",
      price: "$149.9",
    },
   
  ];
  return (
    <div className="w-full px-4 sm:px-6 md:px-12 py-8 md:py-16">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-[600] text-[#E8C9C9] text-xl sm:text-2xl md:text-3xl mb-6 md:mb-10">
          Featured Courses
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
          {Featured_Data.map((detail) => (
            <div
              key={detail.id}
              className="bg-[#0000004D] backdrop-blur-[25px] rounded-lg md:rounded-xl p-4 md:p-6 hover:bg-[#0000006D] transition-all duration-300"
            >
              <div className="rounded-md w-full overflow-hidden">
                <img
                  src={detail.Thumbs}
                  alt="Thumbnail"
                  className="w-full h-32 sm:h-40 md:h-44 object-cover"
                />
              </div>
              
              <h3 className="text-base md:text-lg font-semibold text-[#E8C9C9] mt-3 md:mt-4 line-clamp-2">
                {detail.title}
              </h3>
              
              <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
                {detail.by}
              </p>
              
              <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-3">
                <img src={detail.rate} alt="ratings" className="h-4 md:h-5" />
                <span className="text-xs md:text-sm text-gray-400">1200 Ratings</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-start gap-1 mt-2 md:mt-3 text-xs md:text-sm text-gray-400">
                <span>{detail.time} Total Hours</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{detail.total} Lectures</span>
                <span className="hidden sm:inline">•</span>
                <span>{detail.stage}</span>
              </div>
              
              <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
                <span className="text-base md:text-lg font-semibold text-[#E8C9C9]">
                  {detail.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourse;

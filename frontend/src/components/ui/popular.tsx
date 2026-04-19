import React, { FC } from "react";

interface Mentor {
  id: number;
  img: string;
  name: string;
  course: string;
  star: string;
  rate: number;
  enroll: number;
}

const Popular: FC = () => {
  const popularData: Mentor[] = [
    {
      id: 1,
      img: "/Mentor.png",
      name: "Ronald Richards",
      course: "UI/UX Designer",
      star: "/start.png",
      rate: 4.9,
      enroll: 2400
    },
    {
      id: 2,
      img: "/Mentor.png",
      name: "Ronald Richards",
      course: "UI/UX Designer",
      star: "/start.png",
      rate: 4.9,
      enroll: 2400
    },
    {
      id: 3,
      img: "/Mentor.png",
      name: "Ronald Richards",
      course: "UI/UX Designer",
      star: "/start.png",
      rate: 4.9,
      enroll: 2400
    },
    {
      id: 4,
      img: "/Mentor.png",
      name: "Ronald Richards",
      course: "UI/UX Designer",
      star: "/start.png",
      rate: 4.9,
      enroll: 2400
    },
    {
      id: 5,
      img: "/Mentor.png",
      name: "Ronald Richards",
      course: "UI/UX Designer",
      star: "/start.png",
      rate: 4.9,
      enroll: 2400
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-semibold text-[#E8C9C9] text-lg sm:text-xl md:text-2xl mb-6">
          Popular Mentor
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
          {popularData.map((mentor: Mentor) => (
            <div
              key={mentor.id}
              className="mt-5 bg-[#0000004D] backdrop-blur-[25px] p-3 sm:p-4 text-center rounded-lg hover:bg-[#00000066] transition-colors duration-300"
            >
              <img
                src={mentor.img}
                alt={mentor.name}
                className="w-full h-auto rounded-md"
              />
              <div className="border-b border-[#E2E8F0] pb-3 sm:pb-4">
                <h2 className="mt-3 text-sm sm:text-base font-medium">
                  {mentor.name}
                </h2>
                <p className="text-xs sm:text-sm mt-1 text-gray-300">
                  {mentor.course}
                </p>
              </div>
              <div className="rating mt-4 flex justify-between items-center gap-2">
                <div className="degree flex items-center gap-1">
                  <img src={mentor.star} alt="rating" className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">{mentor.rate}</span>
                </div>
                <div className="amount">
                  <span className="text-xs sm:text-sm whitespace-nowrap">
                    {mentor.enroll} Students
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popular;

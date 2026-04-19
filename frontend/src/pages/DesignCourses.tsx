import { useState, useRef } from "react";
import Icon from "/Icon.png";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import Popular from "../components/ui/popular";
import Pagination from "../components/ui/Pagination";
import FeaturedCourse from "../components/ui/FeaturedCourse";

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

interface FilterOption {
  id: number;
  categories?: string;
  grade?: string;
}

interface Star {
  id: number;
  image: string;
}

const DesignCourses: React.FC = () => {
  const Details: CourseDetail[] = [
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
      title: "Beginner’s Guide to Design",
      by: "By Ronald Richards",
      rate: "/ratings.png",
      time: "22h",
      total: "122",
      stage: "Beginner",
      price: "$149.9",
    },
  ];

  const Stars: Star[] = [
    { id: 1, image: "/ratings.png" },
    { id: 2, image: "/ratings2.png" },
    { id: 3, image: "/ratings3.png" },
    { id: 4, image: "/ratings4.png" },
    { id: 5, image: "/ratings5.png" },
  ];

  const sortBy: FilterOption[] = [
    {
      id: 1,
      categories: "web development",
    },
    { id: 2, categories: "mobile development" },
    { id: 3, categories: "game development" },
    { id: 4, categories: "data science" },
    { id: 5, categories: "machine learning" },
    { id: 6, categories: "artificial intelligence" },
  ];

  const ratingOptions: FilterOption[] = [
    { id: 1, grade: "1-10" },
    { id: 2, grade: "10-15" },
    { id: 3, grade: "15-20" },
    { id: 4, grade: "20-25" },
  ];
  const price: FilterOption[] = [
    { id: 1, grade: "Free" },
    { id: 2, grade: "Paid" },
  ];

  const categories = [
    "Web Development",
    "Mobile Development",
    "Game Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
  ];

  const filters = [
    "All Development Courses",
    "Web Development",
    "Mobile Development",
    "Game Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
  ];


  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [openSection, setOpenSection] = useState<null | string>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const Picked = (item: string) => {
    const pick = sortBy.find((i) => i.categories === item);
    console.log(pick);
  };

  return (
    <div className="min-h-screen bg-[#050020]">
      <h1 className="text-center text-[#E8C9C9] text-2xl md:text-3xl px-4 py-6 md:py-8">Design Courses</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 md:px-6 lg:px-12">
        {/* SIDEBAR */}
        <div className={`text-[#E8C9C9] p-4 ${sidebarOpen ? 'block' : 'hidden lg:block'} lg:p-4`}>
          <h2>All Development Courses</h2>

          {/* FILTER BUTTON */}
          <div className="relative mt-6">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 border px-4 py-2 rounded"
            >
              <img src={Icon} alt="filter" />
              Filter
            </button>

            {showCategories && (
              <div className="absolute mt-2 w-full bg-[#0c0035] rounded shadow">
                {filters.map((item) => (
                  <div
                    onClick={(e) => {
                      Picked();
                    }}
                    key={item}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RATING */}
          <div className="mt-6 border-b border-[#E8C9C9] pb-4">
            <div
              onClick={() =>
                setOpenSection(openSection === "rating" ? null : "rating")
              }
              className="flex justify-between cursor-pointer"
            >
              <span>Rating</span>
              {openSection === "rating" ? <SlArrowUp /> : <SlArrowDown />}
            </div>

            {openSection === "rating" && (
              <div className="mt-4 space-y-2">
                {Stars.map((star) => (
                  <img key={star.id} src={star.image} alt="" />
                ))}
              </div>
            )}
          </div>

          {/* CHAPTERS */}
          <div className="mt-6 border-b border-[#E8C9C9] pb-4">
            <div
              onClick={() =>
                setOpenSection(openSection === "chapters" ? null : "chapters")
              }
              className="flex justify-between cursor-pointer"
            >
              <span>Number of Chapters</span>
              {openSection === "chapters" ? <SlArrowUp /> : <SlArrowDown />}
            </div>

            {openSection === "chapters" && (
              <div className="mt-4 space-y-2 ">
                {ratingOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2">
                    <input type="checkbox" />
                    {opt.grade}
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Price */}
          <div className="mt-6 border-b border-[#E8C9C9] pb-4">
            <div
              onClick={() =>
                setOpenSection(openSection === "price" ? null : "price")
              }
              className="flex justify-between cursor-pointer"
            >
              <span>Price</span>
              {openSection === "price" ? <SlArrowUp /> : <SlArrowDown />}
            </div>

            {openSection === "price" && (
              <div className="mt-4 space-y-2 ">
                {price.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2">
                    <input type="checkbox" />
                    {opt.grade}
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* categories */}
          <div className="mt-6 border-b border-[#E8C9C9] pb-4">
            <div
              onClick={() =>
                setOpenSection(
                  openSection === "categories" ? null : "categories",
                )
              }
              className="flex justify-between cursor-pointer"
            >
              <span>Categories</span>
              {openSection === "categories" ? <SlArrowUp /> : <SlArrowDown />}
            </div>

            {openSection === "categories" && (
              <div className="mt-4 space-y-2 ">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input type="checkbox" />
                    {category}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 py-8 px-0 md:px-4">
          {/* MOBILE FILTER TOGGLE */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 border border-[#E8C9C9] text-[#E8C9C9] px-4 py-2 rounded"
            >
              <img src={Icon} alt="filter" />
              {sidebarOpen ? "Hide" : "Show"} Filters
            </button>
          </div>

          {/* SOrting - Top Right */}
          <div className="sort text-[#E8C9C9] z-2 flex items-center gap-2 justify-end mb-6 relative">
            <h2 className="text-sm md:text-base">Sort by:</h2>
            <div
              className="flex gap-4 border border-[#E8C9C9] px-3 md:px-4 py-2 rounded cursor-pointer text-sm md:text-base"
              onClick={() =>
                setOpenSection(openSection === "sortby" ? null : "sortby")
              }
            >
              <span>Relevance</span>
              <SlArrowDown />
            </div>
            {openSection === "sortby" && (
              <div className="absolute top-[28px] bg-[#0000004D] backdrop-blur-[25px] rounded shadow">
                {sortBy.map((item) => (
                  <div
                    onClick={() => Picked(item.categories)}
                    key={item.id}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                  >
                    {item.categories}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* displaying the courses */}
          <div className="display_course">
          <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {Details.map((detail) => (
              <div
                key={detail.id}
                className="bg-[#0000004D] backdrop-blur-[25px] rounded-lg md:rounded-xl p-4 md:p-6 hover:bg-[#0c003580] transition-all duration-300"
              >
                <div className="rounded-md w-full overflow-hidden mb-3 md:mb-4">
                  <img
                    src={detail.Thumbs}
                    alt="Thumbnail"
                    className="w-full h-32 sm:h-36 md:h-40 object-cover"
                  />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-[#E8C9C9] line-clamp-2">{detail.title}</h3>
                <p className="text-xs md:text-sm text-gray-400 mt-2">{detail.by}</p>
                <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-3">
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
                  <span className="text-base md:text-lg font-semibold text-[#E8C9C9]">{detail.price}</span>
                </div>
              </div>
            ))}
          </div>
          {/* working on pagination */}
          <Pagination/>
          </div>
        </div>
      </div>

      {/* popular mentor */}
      <Popular/>

      {/* working on featured course */}
      <FeaturedCourse/>
    </div>
  );
};

export default DesignCourses;

import { useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex items-center justify-center border border-[#6C63FF] rounded-lg overflow-hidden">

        {/* Prev Button */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 border-r border-[#6C63FF] text-white hover:bg-white/10"
        >
          <SlArrowLeft />
        </button>

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 border-r border-[#6C63FF] ${
              currentPage === page
                ? "bg-[#6C63FF] text-white"
                : "text-gray-400 hover:bg-white/10"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 text-white hover:bg-white/10"
        >
          <SlArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
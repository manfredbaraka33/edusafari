import { ArrowUp } from "lucide-react";
import React, { useState, useEffect } from "react";

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    const container = document.querySelector("main.flex-1.overflow-y-auto");
    if (container) {
      setVisible(container.scrollTop > 200); // show after 200px scroll
    }
  };

  const scrollToTop = () => {
    const container = document.querySelector("main.flex-1.overflow-y-auto");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = document.querySelector("main.flex-1.overflow-y-auto");
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-2 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <span className="font-bold"><ArrowUp /></span> <span className="hidden sm:inline">Top</span>
      </button>
    )
  );
};

export default BackToTopButton;


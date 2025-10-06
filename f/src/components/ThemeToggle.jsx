
import React, { useState, useEffect } from "react";
import { Lightbulb, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    // console.log("🔄 Theme effect running. Current theme:", theme);

    if (theme === "dark") {
      // console.log("🌙 Adding 'dark' class to <html>");
      document.documentElement.classList.add("dark");
    } else {
      // console.log("☀️ Removing 'dark' class from <html>");
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
    // console.log("💾 Saved theme to localStorage:", theme);
  }, [theme]);

  const toggleTheme = () => {
    // console.log("🖱️ Toggle clicked. Previous theme:", theme);
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "light" ? "dark" : "light";
      // console.log("➡️ Setting new theme:", nextTheme);
      return nextTheme;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <Lightbulb size={18} className="text-yellow-400 font-bold" />
      ) : (
        <Moon size={18} className="text-gray-800" />
      )}
    </button>
  );
};

export default ThemeToggle;

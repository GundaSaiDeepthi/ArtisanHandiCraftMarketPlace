import React, {
createContext,
useContext,
useEffect,
useState,
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
      if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
    } catch (error) {
      console.error("Error reading initial theme from localStorage:", error);
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    try {
      const root = document.documentElement;
      
      // Remove both classes first
      root.classList.remove("light", "dark");
      
      // Add current theme class
      root.classList.add(theme);
      
      // Save theme
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Error setting theme in localStorage:", error);
    }
  }, [theme]);

const toggleTheme = () => {
setTheme((prevTheme) =>
prevTheme === "light"
? "dark"
: "light"
);
};

return (
<ThemeContext.Provider
value={{
theme,
setTheme,
toggleTheme,
}}
>
{children}
</ThemeContext.Provider>
);
};

export const useTheme = () => {
const context = useContext(ThemeContext);

if (!context) {
throw new Error(
"useTheme must be used within ThemeProvider"
);
}

return context;
};

export default ThemeContext;

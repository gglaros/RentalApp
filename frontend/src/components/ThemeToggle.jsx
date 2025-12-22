import { useState,useEffect } from "react"
import {Moon, Sun} from "lucide-react"

export const ThemeToggle = () => {
   
 const [isDarkMode,setIsDarkMode] = useState(false);    
 
useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

 return <button onClick={toggleTheme} className="fixed top-4 right-2 md:right-5 
  z-50 p-2 rounded-full"> 
 {isDarkMode ? <Sun/> : <Moon/>}  </button>
}



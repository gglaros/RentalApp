import { cn } from "../lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/home" },
  { name: "Sign in", href: "/signin" },
  { name: "Log in", href: "/login" },
  { name: "Log out", href: "/logout" },
  { name: "Profile", href: "/profile" },
  
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.screenY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <nav 
      className={cn(
        "fixed w-full z-40 transition-all duration-300 ",
        isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5" )}>
      
      <div className="container flex items-center justify-between ">
        <a className="text-xl font-bold text-primary flex items-center ml-4" href="/home">
          <span className="relative z-10 ">
            <span className="text-glow text-foreground"> Rental </span>{" "}
            App
          </span>
        </a>

        {/* desktop nav */}
        <div className="hidden md:flex space-x-9 mr-5 lg:mr-4">
          {navItems.map((item, key) => (
            <a
              key={key}
              href={item.href}
              className="text-foreground/80 hover:text-primary transition-colors duration-300" >
              {item.name}
            </a>
          ))}
        </div>

      </div>
    </nav>
  );
};
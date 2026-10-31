import { cn } from "../lib/utils";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";

const guestItems = [
  { name: "Home", href: "/home" },
  { name: "Properties", href: "/properties" },
  { name: "Sign up", href: "/signin" },
  { name: "Log in", href: "/login" },
];

const userItems = [
  { name: "Home", href: "/home" },
  { name: "Properties", href: "/properties" },
  { name: "My requests", href: "/ownerRequests", roles: ["OWNER"] },
  { name: "My applications", href: "/tenantApps", roles: ["TENANT"] },
  { name: "Users", href: "/AllUsers", roles: ["ADMIN"] },
  { name: "Approvals", href: "/AllOwnerApps", roles: ["ADMIN"] },
  { name: "Photos", href: "/PendingImages", roles: ["ADMIN"] },
  { name: "Profile", href: "/profile" },
  { name: "Log out", href: "/logout" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, role } = useContext(UserContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = isAuthenticated
    ? userItems.filter((item) => !item.roles || item.roles.includes(role))
    : guestItems;

  return (
    <nav
      className={cn(
        "fixed w-full z-40 transition-all duration-300",
        isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5"
      )}
    >
      <div className="container flex items-center justify-between">

        <Link to="/home" className="text-xl font-bold text-primary flex items-center ml-4">
          <span className="relative z-10">
            <span className="text-glow text-foreground">Rental</span> App
          </span>
        </Link>

        <div className="hidden md:flex space-x-9 mr-5 lg:mr-4">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-foreground/80 hover:text-primary transition-colors duration-300"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

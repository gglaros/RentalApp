import { Navbar } from "./Navbar";
import { ThemeToggle } from "./ThemeToggle";

export const Layout = ({ children }) => {
  return (
    <div className=" bg-background text-foreground ">
      <Navbar />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="transition-all duration-300 pt-20">
        {children}
      </main>
    </div>

 
  );
};

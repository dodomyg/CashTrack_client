/* eslint-disable react/prop-types */
import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
  LayoutGrid,
  CreditCard,
  Settings,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar, theme }) => {
  return (
    <div
      className={cn(
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-slate-200 text-black",
        "min-h-screen flex flex-col transition-all duration-300 ease-in-out pt-10",
        isOpen ? "w-56" : "w-24 items-center"
      )}
    >
      <div className="mb-4 flex items-center justify-start gap-2">
        <Button variant="ghost" onClick={toggleSidebar}>
          <Menu size={20} />
        </Button>
        {isOpen && <h2 className="text-[18px]">Close</h2>}
      </div>

      <div className="flex-grow">
        <ul className="space-y-4">
          <li>
            <Link
              to="/overview"
              className={cn(
                "flex items-center space-x-2 p-4 rounded-lg transition-colors",
                theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-300"
              )}
            >
              <LayoutGrid size={20} />
              {isOpen && <span className="ml-2">Overview</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/add-bill"
              className={cn(
                "flex items-center space-x-2 p-4 rounded-lg transition-colors",
                theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-300"
              )}
            >
              <CreditCard size={20} />
              {isOpen && <span className="ml-2">Add Bill</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={cn(
                "flex items-center space-x-2 p-4 rounded-lg transition-colors",
                theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-300"
              )}
            >
              <Settings size={20} />
              {isOpen && <span className="ml-2">Settings</span>}
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4">
        <Button
          variant="outline"
          className="w-full flex items-center space-x-2 text-xl font-bold"
        >
          CashTrack
        </Button>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Function to get the current page title based on the route
  const getPageTitle = () => {
    const location = useLocation();
    const path = location.pathname;
    switch (path) {
      case "/overview":
        return "Overview";
      case "/add-bill":
        return "Add Bill";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex">
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
        theme={theme}
      />
      <div
        className={cn(
          theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black",
          "flex-grow p-8 transition-colors relative"
        )}
      >
        {/* Header Section with Page Title and Buttons */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="px-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

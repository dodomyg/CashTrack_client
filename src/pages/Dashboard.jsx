import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  CreditCard,
  Settings,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
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
import { UserContext } from "@/context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

// Sidebar Component
const Sidebar = ({ isOpen, theme }) => {
  const location = useLocation();
  return (
    <div
      className={cn(
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-slate-200 text-black",
        "min-h-screen flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-56" : "w-16"
      )}
    >
      <ul className="space-y-2 mt-4">
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
  );
};

// Dashboard Component
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      if (user) {
        await signOut(auth)
          .then(() => {
            localStorage.clear();
            setUser(null);
            toast.success("Logged out successfully");
            navigate("/auth");
          })
          .catch((error) => {
            console.log(error);
            toast.error(error.message);
            return;
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const getPageTitle = () => {
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
      {/* Toggle Button for Sidebar */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 z-10 p-2 transition-transform duration-300",
          isOpen ? "translate-x-56" : "translate-x-16"
        )}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </Button>

      <Sidebar isOpen={isOpen} theme={theme} />

      <div
        className={cn(
          theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black",
          "flex-grow p-8 transition-colors relative"
        )}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-x-4">
            {/* Theme Toggle */}
            <Button variant="ghost" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            {/* User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-8 h-8 cursor-pointer">
                  {user?.photoURL ? (
                    <AvatarImage src={user?.photoURL} alt={user?.email} />
                  ) : (
                    <AvatarFallback>
                      {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="px-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Outlet context={{ theme }} />
      </div>
    </div>
  );
};

export default Dashboard;

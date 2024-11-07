import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  LayoutGrid,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  BadgeIndianRupee,
  History,
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

const sideBarLinks = [
  { name: "Overview", path: "/overview", icon: <LayoutGrid size={20} /> },
  { name: "Add Bill", path: "/add-bill", icon: <BadgeIndianRupee size={20} /> },
  { name: "History", path: "/history", icon: <History size={20} /> },
  { name: "Demo", path: "/demo", icon: <Settings size={20} /> },
]
// Sidebar Component
// eslint-disable-next-line react/prop-types
const Sidebar = ({ isOpen, theme }) => {
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();
  return (
    <TooltipProvider>
      <div
        className={cn(
          theme === "dark"
            ? "bg-slate-950 text-white"
            : "bg-slate-200 text-black",
          "min-h-screen flex flex-col transition-all duration-300 ease-in-out pt-3",
          isOpen ? "w-56" : "w-16"
        )}
      >
        <ul className="space-y-2 mt-4">
          {sideBarLinks?.map((link, i) => (
            <li key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={link.path}
                    className={cn(
                      "flex items-center space-x-2 p-4 rounded-lg transition-colors",
                      theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-300"
                    )}
                  >
                    {link.icon}
                    {isOpen && <span className="ml-2">{link.name}</span>}
                  </Link>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent>
                    <p>{link.name}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </TooltipProvider>
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
      case "/history":
        return "History";
      case "/demo":
        return "Demo";
      default:
        return "Overview";
    }
  };

  return (
    <div className="flex">
      {/* Toggle Button for Sidebar */}

      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "absolute top-3 z-10 p-2 -left-6 transition-transform duration-300",
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
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
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
                <AlertDialog>
                  <AlertDialogTrigger>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Welcome Back to CashTrack {user?.name}
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

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

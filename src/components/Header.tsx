import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Verify Certificate", path: "/#verify" }, 
    { name: "About", path: "https://nitda.gov.ng", external: true }
  ];

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-start">
            <img src="/logo.png" alt="NITDA Logo" className="h-8 w-auto" />
            <p className="text-sm font-bold text-nitda mt-1">CERTIFICATE PORTAL</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-nitda ${
                location.pathname === item.path
                  ? "text-nitda"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Login Button */}
        <div className="flex items-center">
          <Button className="bg-nitda hover:bg-nitda-dark text-white" size="sm">
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

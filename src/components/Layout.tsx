import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, User, FileText, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isAuth =
    location.pathname === "/login" || location.pathname === "/register";

  const navItems = [
    { name: "Trang chủ", icon: Home, href: "/dashboard" },
    { name: "Lịch khám", icon: Calendar, href: "/appointments" },
    { name: "Kiểm tra triệu chứng", icon: FileText, href: "/symptom-checker" },
    { name: "Hồ sơ", icon: User, href: "/profile" },
  ];
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
    //in ra token để kiểm tra
    console.log("kkkk", localStorage.getItem("token"));
  };

  if (isAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-semibold text-xl">
              <span className="text-primary">Health</span>Connect
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Đăng Xuất
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-20 bg-background/95 backdrop-blur-md border-b border-border animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "p-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 mt-2 justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Đăng Xuất
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} HealthConnect. Đã đăng ký bản quyền.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Điều Khoản
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Bảo Mật
            </Link>
            <Link
              to="/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Liên Hệ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

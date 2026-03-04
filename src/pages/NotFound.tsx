import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLang } from "@/context/LangContext";
import AppHeader from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-display font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">
            {t('Page not found', 'Страницата не е намерена')}
          </p>
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              {t('Back to Home', 'Към началото')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

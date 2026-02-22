import { Link, useNavigate } from '@tanstack/react-router';
import { Home, PlusCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export default function Navigation() {
  const navigate = useNavigate();
  const { isInstallable, installPWA } = usePWAInstall();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/generated/logo-icon.dim_128x128.png" 
              alt="Bachelor Room Finder Logo" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-primary">Bachelor Room Finder</span>
          </Link>
          
          <nav className="flex items-center gap-2">
            {isInstallable && (
              <Button 
                variant="outline" 
                onClick={installPWA}
                className="gap-2"
                size="sm"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Install App</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={() => navigate({ to: '/' })}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Browse Rooms</span>
            </Button>
            <Button 
              onClick={() => navigate({ to: '/add-listing' })}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Listing</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

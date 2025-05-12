
'use client';

import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogIn, LogOut, UserPlus, ShieldCheck } from 'lucide-react';

const Header = () => {
  const { user, isAdmin, logout, loading } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transform transition-transform hover:scale-105 duration-200" aria-label="BlogCraft AI Home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Link>
              </Button>
              {isAdmin && (
                 <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    <Link href="/app/admin">
                        <ShieldCheck className="mr-2 h-4 w-4" /> Admin
                    </Link>
                 </Button>
              )}
              <Button onClick={handleLogout} variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

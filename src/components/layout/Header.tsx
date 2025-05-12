import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transform transition-transform hover:scale-105 duration-200" aria-label="BlogCraft AI Home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-4">
          {/* <Link href="/features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Pricing
          </Link> */}
          <Button asChild variant="outline" className="hidden sm:inline-flex border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transform hover:scale-105 transition-transform duration-200">
            <Link href="#cta">Get Started</Link>
          </Button>
           <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-transform duration-200">
            <Link href="#cta">Try MVP</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;


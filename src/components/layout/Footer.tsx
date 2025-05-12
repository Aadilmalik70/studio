const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} BlogCraft AI. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Revolutionizing content creation, one blog post at a time.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

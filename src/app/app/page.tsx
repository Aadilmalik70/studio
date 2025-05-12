import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function AppRootPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Welcome to the App Area</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This is the main application section. Navigate to the dashboard to access AI tools and manage your content.
          </p>
          <Button asChild size="lg">
            <Link href="/app/app/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

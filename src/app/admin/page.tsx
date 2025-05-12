
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/app/dashboard'); // Or '/' or '/login' if preferred
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Admin Dashboard</CardTitle>
              <CardDescription>Welcome, {user.email}. This is the restricted admin area.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground">
            This page is only accessible to administrators.
          </p>
          <p className="mt-4 text-muted-foreground">
            You can add admin-specific functionalities and content here. For example:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>User management</li>
            <li>Site statistics</li>
            <li>Content moderation tools</li>
            <li>Application settings</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

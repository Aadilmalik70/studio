import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-secondary/30 min-h-screen">
        {children}
    </div>
  );
}

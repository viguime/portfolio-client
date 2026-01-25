import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { AvailabilityDrawer } from './AvailabilityDrawer';

export function AvailabilitySection() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Let's Work Together</h2>
        <p className="text-muted-foreground">
          Have a project in mind? Schedule a call to discuss how we can collaborate.
        </p>
        <Button onClick={() => setDrawerOpen(true)} size="lg" className="gap-2">
          <Calendar className="w-5 h-5" />
          Schedule a Call
        </Button>
      </div>
      <AvailabilityDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </section>
  );
}

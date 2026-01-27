import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar, Loader2 } from 'lucide-react';

interface TimeSlot {
  id: string;
  datetime: string;
  available: boolean;
}

interface AvailabilityDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AvailabilityDrawer({ open, onOpenChange }: AvailabilityDrawerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (open) {
      fetchSlots();
    }
  }, [open]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/availability');
      const data = await response.json();
      setSlots(data);
    } catch {
      toast.error('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setShowForm(true);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: selectedSlot,
          ...formData,
        }),
      });

      if (response.ok) {
        toast.success('Meeting confirmed! You\'ll receive a confirmation email shortly.');
        onOpenChange(false);
        setFormData({ name: '', email: '', message: '' });
        setSelectedSlot(null);
        setShowForm(false);
      } else {
        toast.error('Failed to book meeting. Please try again.');
      }
    } catch {
      toast.error('Failed to book meeting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetClose onClick={() => {
          setShowForm(false);
          setSelectedSlot(null);
          setFormData({ name: '', email: '', message: '' });
          setErrors({});
          onOpenChange(false);
        }} />
        <SheetHeader>
          <SheetTitle>Schedule a Call</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {!showForm ? (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {slots.filter(slot => slot.available).map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotSelect(slot.id)}
                      className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors flex items-center gap-3 cursor-pointer"
                    >
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span>{formatDateTime(slot.datetime)}</span>
                    </button>
                  ))}
                  {slots.filter(slot => slot.available).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No available slots at the moment.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDateTime(
                      slots.find(s => s.id === selectedSlot)?.datetime || ''
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="text-sm font-medium block mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium block mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium block mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  rows={4}
                />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">{errors.message}</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedSlot(null);
                    setFormData({ name: '', email: '', message: '' });
                    setErrors({});
                  }}
                  className="flex-1 cursor-pointer"
                >
                  Back
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1 cursor-pointer">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

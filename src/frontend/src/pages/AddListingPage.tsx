import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAddRoomListing } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { RoomType, AvailabilityStatus } from '../backend';

const COMMON_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Attached Bathroom',
  'Furnished',
  'Parking',
  'Kitchen Access',
  'Laundry',
  'Power Backup',
  'Water Supply 24/7',
  'Security',
];

export default function AddListingPage() {
  const navigate = useNavigate();
  const { mutate: addListing, isPending, isSuccess } = useAddRoomListing();

  const [formData, setFormData] = useState({
    title: '',
    rentAmount: '',
    location: '',
    roomType: 'single' as 'single' | 'sharedRoom',
    contactInfo: '',
    availability: 'available' as 'available' | 'occupied',
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.rentAmount || Number(formData.rentAmount) <= 0) {
      newErrors.rentAmount = 'Valid rent amount is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const id = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    addListing({
      id,
      title: formData.title,
      rentAmount: BigInt(formData.rentAmount),
      location: formData.location,
      roomType: formData.roomType === 'single' ? RoomType.single : RoomType.sharedRoom,
      amenities: selectedAmenities,
      contactInfo: formData.contactInfo,
      availability: formData.availability === 'available' ? AvailabilityStatus.available : AvailabilityStatus.occupied,
    });
  };

  const handleReset = () => {
    setFormData({
      title: '',
      rentAmount: '',
      location: '',
      roomType: 'single',
      contactInfo: '',
      availability: 'available',
    });
    setSelectedAmenities([]);
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12 space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Listing Added Successfully!</h2>
              <p className="text-muted-foreground">
                Your room listing has been published and is now visible to potential renters.
              </p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={() => navigate({ to: '/' })}>
                View All Listings
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Add Another Listing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Add New Room Listing</CardTitle>
          <CardDescription>
            Fill in the details below to list your room for rent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Room Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Spacious Single Room near Metro Station"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentAmount">Monthly Rent (₹) *</Label>
                <Input
                  id="rentAmount"
                  type="number"
                  placeholder="e.g., 8000"
                  value={formData.rentAmount}
                  onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                  className={errors.rentAmount ? 'border-destructive' : ''}
                />
                {errors.rentAmount && <p className="text-sm text-destructive">{errors.rentAmount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select
                  value={formData.roomType}
                  onValueChange={(value: 'single' | 'sharedRoom') =>
                    setFormData({ ...formData, roomType: value })
                  }
                >
                  <SelectTrigger id="roomType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Room</SelectItem>
                    <SelectItem value="sharedRoom">Shared Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Sector 15, Near City Mall"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={errors.location ? 'border-destructive' : ''}
              />
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input
                id="contactInfo"
                placeholder="e.g., +91 98765 43210 or email@example.com"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                className={errors.contactInfo ? 'border-destructive' : ''}
              />
              {errors.contactInfo && <p className="text-sm text-destructive">{errors.contactInfo}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability Status *</Label>
              <Select
                value={formData.availability}
                onValueChange={(value: 'available' | 'occupied') =>
                  setFormData({ ...formData, availability: value })
                }
              >
                <SelectTrigger id="availability">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available Now</SelectItem>
                  <SelectItem value="occupied">Currently Occupied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Amenities</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMMON_AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label
                      htmlFor={amenity}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Listing...
                  </>
                ) : (
                  'Add Listing'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

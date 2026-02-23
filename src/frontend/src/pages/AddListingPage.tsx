import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAddRoomListing } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { RoomType, AvailabilityStatus, ExternalBlob } from '../backend';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

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
  const [photos, setPhotos] = useState<{ blob: ExternalBlob; preview: string }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: { blob: ExternalBlob; preview: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        toast.error(`${file.name} is not a valid image format. Only JPEG and PNG are allowed.`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum file size is 5MB.`);
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      newPhotos.push({ blob, preview: previewUrl });
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    
    // Clear the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const updated = [...prev];
      // Revoke the preview URL to free memory
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
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
    if (photos.length === 0) {
      newErrors.photos = 'At least one photo is required';
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

    // Add upload progress tracking to photos
    const photosWithProgress = photos.map((photo) => 
      photo.blob.withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      })
    );

    addListing({
      id,
      title: formData.title,
      rentAmount: BigInt(formData.rentAmount),
      location: formData.location,
      roomType: formData.roomType === 'single' ? RoomType.single : RoomType.sharedRoom,
      amenities: selectedAmenities,
      contactInfo: formData.contactInfo,
      availability: formData.availability === 'available' ? AvailabilityStatus.available : AvailabilityStatus.occupied,
      photos: photosWithProgress,
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
    // Clean up preview URLs
    photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    setPhotos([]);
    setUploadProgress(0);
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

            <div className="space-y-3">
              <Label htmlFor="photos">Room Photos *</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photos')?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Select Photos
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPEG or PNG, max 5MB each
                  </p>
                </div>
                <Input
                  id="photos"
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {errors.photos && <p className="text-sm text-destructive">{errors.photos}</p>}
                
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                        <img
                          src={photo.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove photo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Photo {index + 1}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => document.getElementById('photos')?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs">Add More</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isPending && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploading photos...</span>
                  <span className="font-medium">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

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

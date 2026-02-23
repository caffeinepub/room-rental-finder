import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetAllRooms } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, IndianRupee, Phone, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function RoomDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/room/$id' });
  const { data: rooms, isLoading, error } = useGetAllRooms();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const room = rooms?.find((r) => r.id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading room details...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-destructive">Room not found or error loading details.</p>
        <Button onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Button>
      </div>
    );
  }

  const formatRent = (amount: bigint) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const getRoomTypeLabel = (type: string) => {
    return type === 'single' ? 'Single Room' : 'Shared Room';
  };

  const getAvailabilityLabel = (status: string) => {
    return status === 'available' ? 'Available Now' : 'Currently Occupied';
  };

  const hasPhotos = room.photos && room.photos.length > 0;
  const photos = hasPhotos ? room.photos : [];
  const currentPhoto = hasPhotos ? photos[selectedPhotoIndex].getDirectURL() : '/assets/generated/room-placeholder.dim_800x600.png';

  const handlePreviousPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate({ to: '/' })}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Listings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="relative aspect-video overflow-hidden bg-muted rounded-t-lg group">
              <img 
                src={currentPhoto}
                alt={`${room.title} - Photo ${selectedPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {hasPhotos && photos.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handlePreviousPhoto}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleNextPhoto}
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                    {selectedPhotoIndex + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>

            {hasPhotos && photos.length > 1 && (
              <div className="p-4 bg-muted/30">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedPhotoIndex
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-muted-foreground/50'
                      }`}
                    >
                      <img
                        src={photo.getDirectURL()}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <CardTitle className="text-3xl">{room.title}</CardTitle>
                <Badge 
                  variant={room.availability === 'available' ? 'default' : 'secondary'}
                  className="text-sm px-3 py-1"
                >
                  {getAvailabilityLabel(room.availability)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{room.location}</span>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Room Type</h3>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {getRoomTypeLabel(room.roomType)}
                </Badge>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                {room.amenities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No amenities listed</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Rental Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-accent/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Monthly Rent</p>
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">{formatRent(room.rentAmount)}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </h4>
                <p className="text-foreground bg-muted rounded-lg p-3 break-words">
                  {room.contactInfo}
                </p>
              </div>

              <Button className="w-full" size="lg">
                Contact Owner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

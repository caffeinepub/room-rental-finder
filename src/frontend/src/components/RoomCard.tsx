import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, IndianRupee } from 'lucide-react';
import type { RoomListing } from '../backend';

interface RoomCardProps {
  room: RoomListing;
}

export default function RoomCard({ room }: RoomCardProps) {
  const navigate = useNavigate();

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

  const getImageSrc = () => {
    if (room.photos && room.photos.length > 0) {
      return room.photos[0].getDirectURL();
    }
    return '/assets/generated/room-placeholder.dim_800x600.png';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="aspect-video overflow-hidden bg-muted">
        <img 
          src={getImageSrc()}
          alt={room.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{room.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {getRoomTypeLabel(room.roomType)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm line-clamp-1">{room.location}</span>
        </div>
        
        <div className="flex items-baseline gap-1">
          <IndianRupee className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold text-primary">{formatRent(room.rentAmount)}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate({ to: '/room/$id', params: { id: room.id } })}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

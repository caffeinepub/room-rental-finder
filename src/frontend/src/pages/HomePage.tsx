import { useGetAllAvailableRooms } from '../hooks/useQueries';
import RoomCard from '../components/RoomCard';
import { Loader2, Home } from 'lucide-react';

export default function HomePage() {
  const { data: rooms, isLoading, error } = useGetAllAvailableRooms();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading available rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-destructive">Error loading rooms. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Find Your Perfect Bachelor Room
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse through our curated collection of comfortable and affordable rooms in your city
        </p>
      </div>

      {rooms && rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
          <Home className="h-16 w-16 text-muted-foreground/50" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">No rooms available yet</h2>
            <p className="text-muted-foreground">Be the first to add a listing!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms?.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

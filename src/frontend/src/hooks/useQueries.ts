import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RoomListing, RoomType, AvailabilityStatus } from '../backend';
import { toast } from 'sonner';

export function useGetAllAvailableRooms() {
  const { actor, isFetching } = useActor();

  return useQuery<RoomListing[]>({
    queryKey: ['availableRooms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAvailableRooms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllRooms() {
  const { actor, isFetching } = useActor();

  return useQuery<RoomListing[]>({
    queryKey: ['allRooms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRooms();
    },
    enabled: !!actor && !isFetching,
  });
}

interface AddRoomListingParams {
  id: string;
  title: string;
  rentAmount: bigint;
  location: string;
  roomType: RoomType;
  amenities: string[];
  contactInfo: string;
  availability: AvailabilityStatus;
}

export function useAddRoomListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddRoomListingParams) => {
      if (!actor) throw new Error('Actor not initialized');
      
      await actor.addRoomListing(
        params.id,
        params.title,
        params.rentAmount,
        params.location,
        params.roomType,
        params.amenities,
        params.contactInfo,
        params.availability
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableRooms'] });
      queryClient.invalidateQueries({ queryKey: ['allRooms'] });
      toast.success('Room listing added successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to add listing: ${error.message}`);
    },
  });
}

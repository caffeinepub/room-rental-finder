import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RoomListing {
    id: string;
    title: string;
    contactInfo: string;
    rentAmount: bigint;
    amenities: Array<string>;
    availability: AvailabilityStatus;
    roomType: RoomType;
    location: string;
}
export enum AvailabilityStatus {
    occupied = "occupied",
    available = "available"
}
export enum RoomType {
    sharedRoom = "sharedRoom",
    single = "single"
}
export interface backendInterface {
    addRoomListing(id: string, title: string, rentAmount: bigint, location: string, roomType: RoomType, amenities: Array<string>, contactInfo: string, availability: AvailabilityStatus): Promise<void>;
    getAllAvailableRooms(): Promise<Array<RoomListing>>;
    getAllRooms(): Promise<Array<RoomListing>>;
}

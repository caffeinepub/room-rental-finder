import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  type RoomType = { #single; #sharedRoom };
  type AvailabilityStatus = { #available; #occupied };

  type RoomListing = {
    id : Text;
    title : Text;
    rentAmount : Nat;
    location : Text;
    roomType : RoomType;
    amenities : [Text];
    contactInfo : Text;
    availability : AvailabilityStatus;
  };

  module RoomListing {
    public func compare(listing1 : RoomListing, listing2 : RoomListing) : Order.Order {
      Text.compare(listing1.id, listing2.id);
    };
  };

  let roomListings = Map.empty<Text, RoomListing>();

  public shared ({ caller }) func addRoomListing(
    id : Text,
    title : Text,
    rentAmount : Nat,
    location : Text,
    roomType : RoomType,
    amenities : [Text],
    contactInfo : Text,
    availability : AvailabilityStatus,
  ) : async () {
    if (roomListings.containsKey(id)) {
      Runtime.trap("Listing with this ID already exists");
    };

    let newListing : RoomListing = {
      id;
      title;
      rentAmount;
      location;
      roomType;
      amenities;
      contactInfo;
      availability;
    };

    roomListings.add(id, newListing);
  };

  public query ({ caller }) func getAllAvailableRooms() : async [RoomListing] {
    roomListings.values().toArray().filter(func(listing) { listing.availability == #available }).sort();
  };

  public query ({ caller }) func getAllRooms() : async [RoomListing] {
    roomListings.values().toArray().sort();
  };
};

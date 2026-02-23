import Map "mo:core/Map";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";

module {
  type OldRoomListing = {
    id : Text;
    title : Text;
    rentAmount : Nat;
    location : Text;
    roomType : { #single; #sharedRoom };
    amenities : [Text];
    contactInfo : Text;
    availability : { #available; #occupied };
  };

  type OldActor = {
    roomListings : Map.Map<Text, OldRoomListing>;
  };

  type NewRoomListing = {
    id : Text;
    title : Text;
    rentAmount : Nat;
    location : Text;
    roomType : { #single; #sharedRoom };
    amenities : [Text];
    contactInfo : Text;
    availability : { #available; #occupied };
    photos : [Storage.ExternalBlob];
  };

  type NewActor = {
    roomListings : Map.Map<Text, NewRoomListing>;
  };

  public func run(old : OldActor) : NewActor {
    let newRoomListings = old.roomListings.map<Text, OldRoomListing, NewRoomListing>(
      func(_id, oldListing) { { oldListing with photos = [] } }
    );
    { roomListings = newRoomListings };
  };
};

# Specification

## Summary
**Goal:** Add room photo upload functionality to allow users to upload and display multiple photos for each room listing.

**Planned changes:**
- Add photos field to RoomListing type in backend to store array of image data
- Add multi-image upload form with preview to AddListingPage
- Update RoomCard to display first uploaded photo instead of placeholder
- Create photo gallery/carousel on RoomDetailPage to display all room photos
- Update frontend hooks to handle photos field in queries and mutations

**User-visible outcome:** Users can upload 3-5 photos when creating a room listing, see the first photo on listing cards, and browse all photos in a gallery on the detail page.

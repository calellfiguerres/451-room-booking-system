
import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import Box from "~/Components/Box";
import RoomDisplay from "~/Components/RoomDisplay";
import type { Room } from "../../../server/src/Models/Room";
import { useNavigate } from "react-router";
import HomeBox from "~/Components/HomeBox";

export default function roomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  // form state for creating a new room
  const [inName, setName] = useState("");
  const [inDescription, setDescription] = useState("");
  const [inLocation, setLocation] = useState("");
  
  // search form state
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // function to submit a new room
  async function submitNewRoom() {

    await api.auth.newRoom.mutate({
      name: inName,
      description: inDescription,
      location: inLocation,
    });

    // reset form
    setName("");
    setDescription("");
    setLocation("");
    
    // refresh room list
    fetchRooms();
  }
  
  // function to search rooms
  async function searchRooms() {
    setIsSearching(true);
    setLoading(true);
    
    try {
      const searchResults = await (api.rooms as any).searchRooms.query({
        name: searchName || undefined,
        location: searchLocation || undefined,
        description: searchDescription || undefined
      });
      
      setRooms(searchResults);
    } catch (error) {
      console.error("Error searching rooms:", error);
    } finally {
      setLoading(false);
    }
  }
  
  // function to clear search and get all rooms
  function clearSearch() {
    setSearchName("");
    setSearchLocation("");
    setSearchDescription("");
    setIsSearching(false);
    fetchRooms();
  }
  
  // function to fetch all rooms
  async function fetchRooms() {
    setLoading(true);
    try {
      const result = await (api.rooms as any).getAllRooms.query();
      setRooms(result);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  return (

    <div className="w-full pb-10 bg-black/10 height-minus-nav">
      
      <div className="absolute top-5 right-5 flex items-center space-x-3 z-10">             
                  <HomeBox homeLink="/" />
              </div>

      <h1 className="text-2xl text-center py-2">Rooms</h1>
      
      {/* Room Search Form */}
      <div className="max-w-[1240px] mx-auto px-2 py-4">
        <div className="bg-white rounded-md p-4 mb-6">
          <h2 className="text-xl mb-4 text-black">Search Rooms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="searchNameInput" className="block text-sm font-medium text-black mb-1">Room Name</label>
              <input 
                type="text" 
                id="searchNameInput"
                className="rounded-md bg-white border border-gray-300 px-2 py-1 w-full text-black"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search by name"
              />
            </div>
            
            <div>
              <label htmlFor="searchLocationInput" className="block text-sm font-medium text-black mb-1">Location</label>
              <input 
                type="text" 
                id="searchLocationInput"
                className="rounded-md bg-white border border-gray-300 px-2 py-1 w-full text-black"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search by location"
              />
            </div>
            
            <div>
              <label htmlFor="searchDescriptionInput" className="block text-sm font-medium text-black mb-1">Description</label>
              <input 
                type="text" 
                id="searchDescriptionInput"
                className="rounded-md bg-white border border-gray-300 px-2 py-1 w-full text-black"
                value={searchDescription}
                onChange={(e) => setSearchDescription(e.target.value)}
                placeholder="Search by description"
              />
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={searchRooms}
              className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              Search
            </button>
            
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-md bg-gray-200 text-gray-800 px-4 py-2 hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      
      {/* Form to add a new room */}
      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); submitNewRoom(); }} className="max-w-[1240px] mx-auto px-2">
        <div className="bg-white rounded-md p-4 mb-6">
          <h2 className="text-xl mb-4 text-black">Add New Room</h2>
          
          <label htmlFor="nameInput" className="text-xl px-5 text-black">Name</label>
          <input 
            type="text" 
            name="name" 
            id="nameInput" 
            className="rounded-md bg-white border border-gray-300 px-2 text-black" 
            value={inName} 
            onChange={(e) => setName(e.target.value)} 
          />
          <br className="py-5" />

          <label htmlFor="descriptionInput" className="text-xl px-5 text-black">Description</label>
          <input 
            type="text" 
            name="description" 
            id="descriptionInput" 
            className="rounded-md bg-white border border-gray-300 px-2 text-black" 
            value={inDescription} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          <br className="py-5" />

          <label htmlFor="locationInput" className="text-xl px-5 text-black">Location</label>
          <input 
            type="text" 
            name="location" 
            id="locationInput" 
            className="rounded-md bg-white border border-gray-300 px-2 text-black" 
            value={inLocation} 
            onChange={(e) => setLocation(e.target.value)} 
          />
          <br className="py-5" />

          <button 
            type="submit" 
            className="rounded-md bg-green-600 text-white px-4 py-2 hover:bg-green-700"
          >
            Add Room
          </button>
        </div>
      </form>

      {/* Display rooms */}
      <div className="max-w-[1240px] py-8 px-2 mx-auto space-y-4">
        <div className="rounded-md bg-white py-8 my-4">
          <p className="text-2xl text-center tracking-widest text-black">
            {isSearching ? "Search Results" : "All Rooms"}
          </p>
          {isSearching && (
            <p className="text-center text-gray-600 mt-2">
              Filters: {[
                searchName && `Name: ${searchName}`,
                searchLocation && `Location: ${searchLocation}`,
                searchDescription && `Description: ${searchDescription}`
              ].filter(Boolean).join(' | ')}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8">
            {isSearching ? "No rooms match your search criteria" : "No rooms available"}
          </div>
        ) : (
          <div className="mx-auto my-4 columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4">
            {rooms.map(room => (
              <RoomDisplay
                key={room.id}
                name={room.name}
                description={room.description}
                location={room.location}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
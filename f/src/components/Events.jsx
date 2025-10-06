import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { EditIcon, PlusIcon, XIcon } from 'lucide-react';
import EventEditModal from './EventEditModal';

const Events = ({ instId, username, owner }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [events, setEvents] = useState([]);
  const [addEventForm, setAddEventForm] = useState(false);
  const { getData, postData, deleteData } = useApi();

  // State for the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEventToEdit, setCurrentEventToEdit] = useState(null);

  const toggleAddEventForm = () => {
    setAddEventForm(!addEventForm);
  };

  const fetchEvents = async () => {
    try {
      const res = await getData(`/institutions/${instId}/events/`);
      const now = new Date();
      const upcoming = res?.filter((event) => new Date(event.start_date_time) >= now);
      setEvents(upcoming);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    if (instId) {
      fetchEvents();
    }
  }, [instId]);

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteData(`/events/${eventId}/delete/`);
      alert("Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = { name, description, start_date_time: dateTime };
    try {
      await postData(`/institutions/${instId}/events/add/`, newEvent);
      fetchEvents();
      alert("Event added successfully!");
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setAddEventForm(false);
    }
  };

  // Helper function for weekday
  const getWeekday = (dateString, format = 'short') => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    const formatter = new Intl.DateTimeFormat('en-US', { weekday: format });
    return formatter.format(date);
  };

  // Function to open the edit modal
  const handleEditClick = (event) => {
    setCurrentEventToEdit(event);
    setIsEditModalOpen(true);
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEventToEdit(null); // Clear the state to prevent stale data
  };

  return (
    <div className='dark:text-gray-200'>
      {addEventForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-600 dark:text-gray-200 p-6 rounded-2xl shadow-md">
          <div className='flex justify-between'>
            <h2 className="text-xl font-bold">Add Event</h2>
            <button onClick={toggleAddEventForm}><XIcon className='text-red-500' /></button>
          </div>
          <input type="text" placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded-lg" />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg"></textarea>
          <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required className="w-full p-2 border rounded-lg" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Save Event</button>
        </form>
      )}

      <div className='flex justify-between p-2'>
        <h2 className="text-gray-900  dark:text-gray-100 text-xl font-bold">Upcoming Events</h2>
        {(username === owner && !addEventForm) && <button className='rounded px-2 py-1 bg-amber-200 text-gray-800 mx-2 flex justify-between' onClick={toggleAddEventForm}><PlusIcon className='text-gray-900 font-extrabold text-2xl' /><span className='hidden sm:inline'>Add Event</span></button>}
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">No upcoming events.</p>
      ) : (
        <ul className="space-y-4 mt-3 p-2">
          {events.map((event) => (
            <li key={event.id} className="p-4 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-xl shadow">
              <div className='flex justify-between'>
                <h3 className="text-lg font-semibold">{event.name}</h3>
                {username === owner && (
                  <div className='flex gap-2'>
                    {/* Corrected onClick handler for the edit button */}
                    <button onClick={() => handleEditClick(event)}><EditIcon /></button>
                    <button onClick={() => handleDeleteEvent(event.id)}><XIcon className='text-red-600' /></button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-50 mt-2">
                <span className="text-gray-700 dark:text-gray-200">
                  {new Date(event.start_date_time).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                    hour: 'numeric', minute: 'numeric', hour24: true,
                  })}
                </span>
                <span className='text-gray-900 dark:text-gray-100 font-extrabold px-1'>EAT</span>
                <span className="font-semibold text-gray-700 dark:text-gray-400">
                  ({getWeekday(event.start_date_time, 'long')})
                </span>
              </p>
               {/* Render the modal when isEditModalOpen is true */}
                {isEditModalOpen && (
                    <EventEditModal
                    event={currentEventToEdit}
                    onClose={handleCloseEditModal}
                    fetchEvents={fetchEvents}
                    />
                )}
            </li>
          ))}
        </ul>
      )}

     
    </div>
  );
};

export default Events;
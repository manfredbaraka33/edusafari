import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

const EventEditModal = ({ event, onClose, fetchEvents }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const { patchData } = useApi();

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDescription(event.description);
      const formattedDateTime = new Date(event.start_date_time)
        .toISOString()
        .slice(0, 16);
      setDateTime(formattedDateTime);
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name,
      description,
      start_date_time: dateTime,
    };
    try {
      const res = await patchData(`/events/${event.id}/update/`, updatedData);
      console.log('API Response:', res);
      await fetchEvents();
      alert("Event successfully updated!");
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert("An error occurred!");
    }
  };

  if (!event) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg"
          ></textarea>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditModal;
import { useEffect, useState } from 'react'; 
import { IoNotifications } from "react-icons/io5"; 

const NotificationManage = () => {
  const [unreadCount, setUnreadCount] = useState(0); 
  const [error, setError] = useState(null); 

  // useEffect to fetch notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Retrieve the token from local storage for authentication
        const token = localStorage.getItem('token');
        
        // Make the API request to fetch notifications
        const response = await fetch('http://localhost:3000/api/notifications', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);

        // Check if the response is OK (status code 2xx)
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server Error: ${response.status} - ${errorText}`); 
        }

        // Parse the response as JSON
        const data = await response.json();
        
        // Filter unread notifications and update the unread count
        const unreadNotifications = data.notifications.filter((notification) => !notification.read);
        setUnreadCount(unreadNotifications.length); 
      } catch (err) {
        // Catch any errors during the fetching process
        console.error('Error fetching notifications:', err.message); 
        setError('Failed to load notifications. Please try again later.'); 
      }
    };

    fetchNotifications(); 
  }, []); 

  // Handle click on the notification icon to mark all as read
  const handleIconClick = () => {
    setUnreadCount(0); 
  };

  return (
    <div className="relative inline-block">
      <span
        className="text-yellow-500 hover:text-red-500 cursor-pointer transition-all"
        onClick={handleIconClick} 
      >
        <IoNotifications
          className="inline-block mr-2 transition-transform transform hover:scale-110 duration-200 ease-in-out"
          size={28} 
        />
      </span>
      
      {/* Display unread notification count if there are any unread notifications */}
      {unreadCount > 0 && (
        <span className="absolute bottom-2 right-0 bg-red-600 text-white rounded-full text-xs font-bold px-2 py-1">
          {unreadCount}
        </span>
      )}

      {/* Display error message if there was an issue fetching notifications */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default NotificationManage;

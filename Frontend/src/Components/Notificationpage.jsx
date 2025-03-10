import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);  // Correctly destructure the state here

  // Fetch notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }

        const response = await fetch('http://localhost:3000/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Check if the notifications are valid and an array
        if (data.notifications && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        } else {
          throw new Error('Invalid response structure from API.');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();  // Call the function when the component mounts

    // Cleanup socket connection on unmount
    return () => {
      if (socket) {
        socket.disconnect(); // Disconnect the socket when the component is unmounted
      }
    };
  }, [socket]);  // Add socket as a dependency to handle its cleanup

  useEffect(() => {
    // Connect to the Socket.IO server
    const socketIo = io("http://localhost:3000");  // Connect to the server
    setSocket(socketIo);  // Store the socket instance

    // Listen for new notifications from the server
    socketIo.on('new_notification', (newNotification) => {
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
    });

    // Cleanup socket connection on unmount
    return () => {
      socketIo.disconnect(); // Disconnect the socket when the component is unmounted
    };
  }, []); // Empty dependency array ensures this runs only once

  // Handle marking a notification as read
  const handleMarkAsRead = async (id, status, feedback) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/notifications/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, feedback }), // Send the status and feedback in the body
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read.');
      }

      // Update the UI by marking the notification as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-gray-500">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[url('/6.jpg')] bg-cover bg-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-500 text-center mt-10">Notifications</h1>

      {/* Display a message if there are no notifications */}
      {notifications.length === 0 ? (
        <p className="text-lg text-gray-500">No notifications yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`relative p-6 h-[12rem] w-[25rem] bg-slate-50 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl ${
                notification.read ? 'bg-slate-50' : 'bg-white'
              }`}
            >
              <span
                className={`absolute top-3 right-3 inline-block w-3 h-3 rounded-full ${
                  notification.read ? 'bg-green-500' : 'bg-red-500'
                }`}></span>

              <div>
                <p className="text-xl font-medium text-blue-600">{notification.message}</p>
                <p className="text-sm text-gray-600 mt-2">Deadline: {notification.deadline || 'Not mentioned'}</p>
                <p className="text-sm text-gray-600 mt-2">RealTime: {notification.createdAt || 'Not mentioned'}</p>
              
                {notification.feedback && (
                  <p className="text-xl text-blue-700 mt-3">
                    <strong>Feedback:</strong> {notification.feedback}
                  </p>
                )}
              </div>

              {/* Mark as Read button if the notification is unread */}
              {!notification.read && (
                <div className="mt-4 text-right">
                  <button
                    onClick={() => handleMarkAsRead(notification._id, 'read', notification.feedback)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

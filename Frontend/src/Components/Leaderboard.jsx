import { useState, useEffect } from "react";

function Leaderboard() {
  const [users, setUsers] = useState([]); 
  const [status, setStatus] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); 
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          setStatus("Please log in to see the leaderboard.");
          setLoading(false);
          return;
        }
        
        const response = await fetch("http://localhost:3000/api/users", {
          method: "GET", 
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching users.");
        }

        const data = await response.json(); 
        console.log("API Response:", data);  // Debugging API response

        // Process users with scores and attempts
        const usersWithScores = data
          .map((user) => {
            const quizScores = user.profile?.quizScores || [];
            const latestScore = quizScores.length
              ? quizScores[quizScores.length - 1].score
              : 0; // If no scores, set to 0
            const attempts = quizScores.length; // Number of attempts
            
            return {
              ...user,
              score: Number(latestScore) || 0, // Ensure it's a valid number
              attempts, // Number of times user attempted the quiz
            };
          })
          .sort((a, b) => b.attempts - a.attempts); // Sort users by attempts in descending order

        setUsers(usersWithScores);
      } catch (error) {
        setStatus("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); 

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
      
      {loading && <p className="text-gray-500 text-center">Loading...</p>}
      {status && <p className="text-red-500 text-center">{status}</p>}
      
      {!loading && users.length > 0 && (
        <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-100">
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-700">Name</th>
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-700">Job Applied</th> {/* Updated Column Name */}
              <th className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-700">Badge</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-6 py-3">{user.name}</td>
                <td className="border border-gray-300 px-6 py-3">{user.attempts}</td>  
                <td className="border border-gray-300 px-6 py-3">
                  {/* Debugging Badge Logic */}
                  {console.log(`User: ${user.name}, Attempts: ${user.attempts}`)}

                  {user.attempts > 5 ? (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Top Performer
                    </span>
                  ) : user.attempts >= 3 ? (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Average Performer
                    </span>
                  ) : user.attempts >= 1 ? (
                    <span className="bg-red-500 text-white  px-3 py-1 rounded-full text-sm">
                      Normal
                    </span>
                  ):(
                    <span className="bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Participant
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && users.length === 0 && (
        <p className="text-gray-500 text-center">No users available.</p>
      )}
    </div>
  );
}

export default Leaderboard;

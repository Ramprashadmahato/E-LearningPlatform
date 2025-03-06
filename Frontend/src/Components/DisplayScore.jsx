import { useEffect, useState } from "react";

const DisplayScore = () => {
  const [user, setUser] = useState(null);
  const userId = "67a0c5f7d7030d3706c9670c"; // Replace with dynamic user ID

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        const data = await response.json();
        
        // Debugging: log the user data structure to ensure we have quizScores
        console.log(data);

        if (response.ok) {
          setUser(data);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-4">User Scores</h2>
      {user ? (
        <div>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Obtained Score</th>
              </tr>
            </thead>
            <tbody>
              {/* Display all attempts in separate rows */}
              {user.profile.quizScores && user.profile.quizScores.length > 0 ? (
                user.profile.quizScores.map((attempt, index) => (
                  <tr key={index} className="border border-gray-300 bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(attempt.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{attempt.score}</td>
                  </tr>
                ))
              ) : (
                <tr className="border border-gray-300">
                  <td colSpan="3" className="text-lg text-center px-4 py-2">
                    No scores recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DisplayScore;

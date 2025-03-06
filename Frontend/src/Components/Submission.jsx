import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackgroundImage from "../Image/Bg2.png";

const Submission = () => {
  const { _id } = useParams(); // Get opportunity ID from route params
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [userSubmission, setUserSubmission] = useState(null); // Store user's specific submission
  const [opportunity, setOpportunity] = useState(null); // Store opportunity details

  // Fetch opportunity details
  useEffect(() => {
    const fetchOpportunity = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:3000/api/opportunities/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        if (!response.ok) throw new Error("Failed to fetch opportunity.");
        const data = await response.json();
        setOpportunity(data); // Set opportunity details
      } catch (error) {
        console.error("Error fetching opportunity:", error);
        setStatus(`Error: ${error.message}`);
      }
    };

    fetchOpportunity(); 
  }, [_id]); 

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a file is selected
    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('opportunityId', _id);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/submissions/submit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading file.');
      }

      const data = await response.json();
      setStatus('Submission successful!');
      setUserSubmission(data); // Update submission state with new data
    } catch (error) {
      setStatus('Error uploading file.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
        <div className="max-w-xl w-full p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-center text-green-700 mb-2">
            Submit Your CV
          </h1>
          {/* Status Message */}
          {status && (
            <div
              className={`mb-2 text-center text-lg font-medium ${status.includes('successful') ? 'text-green-600' : 'text-red-600'}`}
            >
              {status}
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File input field */}
            <div>
              <label
                htmlFor="file"
                className="block text-lg font-medium text-gray-700"
              >
                Choose File:
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="w-full mt-2 rounded-lg border border-gray-300 p-3 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 active:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </form>
          {/* Display User's Submission */}
          {userSubmission ? (
            
            <div className="mb-6">
             <h1 className="text-2xl font-bold text-center text-green-700 mt-3 mb-2">Your Submission</h1>
            <h2 className="text-2xl font-bold">{opportunity.title}</h2>
            <p className="text-gray-600">Type: {opportunity.type}</p>
            <p className="text-gray-600">Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</p>
            <p className="text-lg text-gray-600 "><strong>Status:</strong> {Submission.status || "Pending"}</p>
            <p className=" text-gray-700"><strong>Feedback:</strong> {Submission.feedback || "No feedback yet"}</p>
          </div>
        ) : (
          <p className="text-lg text-gray-600 mt-4">You have not submitted yet.</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default Submission;

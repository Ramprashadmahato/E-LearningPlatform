import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import emailjs from '@emailjs/browser';

const EditSubmission = () => {
  const { _id } = useParams(); // Ensure the backend expects "_id". Otherwise, change this to "id".
  const [submission, setSubmission] = useState(null);
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/submissions/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch submission (Status: ${response.status})`);
        }

        const data = await response.json();
        setSubmission(data);
        setStatus(data.status);
        setFeedback(data.feedback || '');
      } catch (error) {
        console.error('Error fetching submission:', error);
        alert('Error fetching submission details. Please try again.');
      }
    };

    fetchSubmission();
  }, [_id]);

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/submissions/${_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, feedback }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update submission (Status: ${response.status})`);
      }

      const responseData = await response.json();
      console.log(responseData)
      const userEmail = responseData.userEmail; // Get email from backend response

      if (userEmail) {
        const emailParams = {
          to_email: userEmail,
          submission_id: _id,
          status,
          feedback,
        };
        emailjs
          .send('service_w71c2ts', 'template_msyeina', emailParams, 'e1KxchnbJw-CarP1_')
          .then(() => {
            alert('Submission updated and email sent successfully!');
            navigate('/submission-manage');
          })
          .catch(() => {
            alert('Submission updated, but email notification failed.');
            navigate('/submission-manage');
          });
      } else {
        alert('Submission updated, but user email is missing.');
        navigate('/submission-manage');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('Error updating submission. Please try again.');
    }
  };


  if (!submission) {
    return <div className="text-center mt-20 text-xl text-gray-600">Loading...</div>;
  }

  return (
    <div className="bg-cover bg-center h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <div>
          
            <img
              src={submission.fileUrl}
              alt="Submission"
              className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
            />
         

        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Edit Submission</h1>
        <form onSubmit={handleEdit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 active:bg-blue-800 transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubmission;

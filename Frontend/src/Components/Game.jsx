
import { useState} from "react";
 function Game() {
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizQuestion, setQuizQuestion] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const quizQuestions = [
        { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
        { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
        { question: "Who wrote 'Hamlet'?", options: ["Charles Dickens", "William Shakespeare", "J.K. Rowling", "Mark Twain"], answer: "William Shakespeare" },
        { question: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: "Pacific Ocean" },
        { question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: "7" },
        { question: "Which animal is known as the King of the Jungle?", options: ["Lion", "Tiger", "Elephant", "Bear"], answer: "Lion" },
        { question: "In what year did the Titanic sink?", options: ["1912", "1905", "1923", "1889"], answer: "1912" }
    ];
    
    const handleGameEnd = async () => {
        
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/users/67a0c5f7d7030d3706c9670c/update-score`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, 
                    
                },
                body: JSON.stringify({ score }),
            });

            console.log("Score updated:", response);
    
            const data = await response.json();
            console.log("Score updated:", data);
            if (!response.ok) {
                throw new Error(data.message || "Failed to update score");
            }
    
            console.log("Score updated:", data);
        } catch (error) {
            console.error("Error updating score:", error);
        }
    };
  


    const handleAnswer = (option) => {
        if (option === quizQuestions[quizQuestion].answer) {
            setScore(score + 1);
        }
        if (quizQuestion + 1 < quizQuestions.length) {
            setQuizQuestion(quizQuestion + 1);
        } else {
            setShowResult(true);
            handleGameEnd();
        }
    };


  return (
    <div className="flex justify-center items-center p-2 gap-80">
        <section className="mt-12 p-6 border border-gray-300 rounded-lg shadow-md text-center">
    <h2 className="text-2xl font-semibold mb-4">Play a Quick Quiz!</h2>
    {!quizStarted ? (
        <button onClick={() => setQuizStarted(true)} className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
            Start Quiz
        </button>
    ) : (
        <div>
            {!showResult ? (
                <div>
                    <h3 className="text-lg font-medium mb-4">{quizQuestions[quizQuestion].question}</h3>
                    <div className="space-y-2">
                        {quizQuestions[quizQuestion].options.map((option, index) => (
                            <button key={index} onClick={() => handleAnswer(option)} className="block w-full px-4 py-2 bg-gray-200 hover:bg-gray-400 rounded-md">
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="text-xl font-semibold">Quiz Completed!</h3>
                    <p className="text-lg">Your Score: {score}/{quizQuestions.length}</p>
                    <button onClick={() => { setQuizStarted(false); setQuizQuestion(0); setScore(0); setShowResult(false); }} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        Play Again
                    </button>
                </div>
            )}
        </div>
    )}
</section>
</div>
  )
}
export default Game;

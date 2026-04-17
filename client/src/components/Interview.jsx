import { useState, useEffect } from "react";
import axios from "axios";
import Result from "./Result";

const questions = [
  "Explain fractions to a 10-year-old",
  "A student is confused. What do you do?",
  "Why do you want to teach?"
];

export default function Interview() {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔊 Speak Question
  const speakQuestion = (text) => {
    speechSynthesis.cancel(); // stop previous voice
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  // 🎤 Speak automatically when question changes
  useEffect(() => {
    speakQuestion(questions[step]);
  }, [step]);

  // ✅ Submit Answer
  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Please answer before submitting");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/evaluate", {
        answer,
        question: questions[step],
      });

      const newEntry = {
        question: questions[step],
        answer: answer,
        evaluation: res.data,
      };

      setResponses((prev) => [...prev, newEntry]);
      setAnswer("");

      if (step < questions.length - 1) {
        setStep((prev) => prev + 1);
      } else {
        setFinished(true);
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🎤 Voice Input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
    };
  };

  // ✅ Final Screen
  if (finished) return <Result responses={responses} />;

  return (
    <div className="card">
      <h2>Question {step + 1}</h2>
      <p>{questions[step]}</p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type or speak your answer..."
      />

      <br />

      <button onClick={startListening}>🎤 Speak</button>

      <button onClick={() => speakQuestion(questions[step])}>
        🔊 Hear Question
      </button>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Evaluating..." : "Submit"}
      </button>
    </div>
  );
}
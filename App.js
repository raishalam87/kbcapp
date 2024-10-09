import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import './App.css';

// Register Chart.js components
Chart.register(...registerables);

const questions = [
  {
    question: 'What is the capital of France?',
    options: ['A) London', 'B) Berlin', 'C) Paris', 'D) Madrid'],
    answer: 'C',
  },
  {
    question: 'What is 2 + 2?',
    options: ['A) 3', 'B) 4', 'C) 5', 'D) 6'],
    answer: 'B',
  },
  {
    question: 'What is the largest planet?',
    options: ['A) Earth', 'B) Mars', 'C) Jupiter', 'D) Saturn'],
    answer: 'C',
  },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [players, setPlayers] = useState([]);
  const [playerScores, setPlayerScores] = useState({});

  const handleJoin = (name) => {
    if (!players.includes(name)) {
      setPlayers([...players, name]);
      setPlayerScores((prev) => ({ ...prev, [name]: 0 }));
    }
  };

  const submitAnswer = (player, selectedAnswer) => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedAnswer === correctAnswer) {
      setPlayerScores((prev) => ({ ...prev, [player]: prev[player] + 1 }));
      alert(`Congratulations ${player}, you answered correctly!`);
    } else {
      alert(`Sorry ${player}, that's incorrect.`);
    }
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('Game Over! Thanks for playing.');
    }
  };

  const data = {
    labels: players,
    datasets: [
      {
        label: 'Scores',
        data: players.map((player) => playerScores[player] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>KBC Game</h1>
        <QRCodeCanvas value="http://your-app-url.com" />
        <JoinGame onJoin={handleJoin} />
        {currentQuestionIndex < questions.length && (
          <Question
            question={questions[currentQuestionIndex]}
            players={players}
            submitAnswer={submitAnswer}
          />
        )}
        <h2>Scoreboard</h2>
        <Bar data={data} />
      </header>
    </div>
  );
}

const JoinGame = ({ onJoin }) => {
  const [name, setName] = useState('');

  const handleJoin = () => {
    if (name) {
      onJoin(name);
      setName('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

const Question = ({ question, players, submitAnswer }) => (
  <div className="Question">
    <h3>{question.question}</h3>
    {question.options.map((option, index) => (
      <div key={index}>
        {players.map((player) => (
          <button key={player} onClick={() => submitAnswer(player, option.charAt(0))}>
            {option}
          </button>
        ))}
      </div>
    ))}
  </div>
);

export default App;

"use client"

import { useState } from 'react';
import Head from 'next/head';
import styles from './styles/home.module.css';

const questions = [
  {
    id: 1,
    question: "¿Cuánto es 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: 1
  },
  {
    id: 2,
    question: "¿Cuál es la capital de Colombia?",
    options: ["Medellín", "Cali", "Bogotá", "Barranquilla"],
    correct: 2
  },
  {
    id: 3,
    question: "¿Cuántos días tiene una semana?",
    options: ["5", "6", "7", "8"],
    correct: 2
  },
  {
    id: 4,
    question: "¿En qué año se fundó la Universidad del Atlántico?",
    options: ["1941", "1946", "1950", "1955"],
    correct: 1
  },
  {
    id: 5,
    question: "¿Cuál es el resultado de 10 × 3?",
    options: ["25", "30", "35", "40"],
    correct: 1
  }
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [score, setScore] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowNameInput(false);
    }
  };

  const handleAnswer = (selectedOption: number) => {
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calcular puntuación
      const finalScore = newAnswers.reduce((acc, answer, index) => {
        return questions[index].correct === answer ? acc + 1 : acc;
      }, 0);

      setScore(finalScore);
      setShowResults(true);
    }
  };

  const generateCertificate = async () => {
    if (score < 3) {
      alert('Necesitas al menos 3 respuestas correctas para obtener el certificado.');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const response = await fetch('/api/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          score: score,
          totalQuestions: questions.length
        }),
      });
      console.log("Pase por response: ", response)
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `certificado-${userName.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Error generando el certificado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generando el certificado. Inténtalo de nuevo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setUserName('');
    setShowNameInput(true);
    setScore(0);
  };

  if (showNameInput) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Quiz de Inducción - ABIIDEA</title>
          <meta name="description" content="Quiz de inducción para certificado" />
        </Head>

        <main className={styles.main}>
          <div className={styles.nameForm}>
            <h1 className={styles.title}>Quiz de Inducción</h1>
            <p className={styles.subtitle}>ABIIDEA - Universidad del Atlántico</p>

            <form onSubmit={handleNameSubmit} className={styles.form}>
              <label htmlFor="userName" className={styles.label}>
                Ingresa tu nombre completo:
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={styles.input}
                placeholder="Ej: María García López"
                required
              />
              <button type="submit" className={styles.button}>
                Comenzar Quiz
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Resultados - Quiz de Inducción</title>
        </Head>

        <main className={styles.main}>
          <div className={styles.results}>
            <h1 className={styles.title}>¡Quiz Completado!</h1>
            <p className={styles.userName}>Hola, {userName}</p>

            <div className={styles.scoreCard}>
              <h2>Tu Puntuación</h2>
              <div className={styles.score}>
                {score} / {questions.length}
              </div>
              <p className={styles.percentage}>
                {Math.round((score / questions.length) * 100)}% de aciertos
              </p>
            </div>

            {score >= 3 ? (
              <div className={styles.success}>
                <p>¡Felicitaciones! Has aprobado el quiz.</p>
                <button
                  onClick={generateCertificate}
                  disabled={isGeneratingPDF}
                  className={styles.certificateButton}
                >
                  {isGeneratingPDF ? 'Generando...' : 'Descargar Certificado'}
                </button>
              </div>
            ) : (
              <div className={styles.failure}>
                <p>Necesitas al menos 3 respuestas correctas para obtener el certificado.</p>
              </div>
            )}

            <button onClick={restartQuiz} className={styles.restartButton}>
              Reiniciar Quiz
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Quiz de Inducción - Pregunta {currentQuestion + 1}</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.quiz}>
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className={styles.questionInfo}>
            <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
            <span>Participante: {userName}</span>
          </div>

          <h2 className={styles.question}>
            {questions[currentQuestion].question}
          </h2>

          <div className={styles.options}>
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={styles.option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
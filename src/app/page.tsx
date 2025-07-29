"use client"

import { useMemo, useState } from 'react';
import Head from 'next/head';
import { FormLogin } from '@/components/formLogin/FormLogin';
import { InUserLoginProps } from '@/types/InFormLogin';
import { formatDateForSheet, validateFormData } from '@/utils/function';
import { useQuizStore } from '@/store/question.store';



const initialValuesFormData: InUserLoginProps = {
  fname: "",
  lname: "",
  id: "",
  phone: "",
  email: ""
};

export default function Home() {

  const {
    hasHydrated,
    isGeneratingPDF,
    answerQuestion,
    resetQuiz,
    nextQuestion,
    getCurrentQuestion,
    getScore,
    getTotalQuestions,
    getPercentage,
    isApproved: getApproved,
    currentQuestionIndex,
    isLastQuestion,
    showResults,
    setShowResults,
    setShowNameInput,
    showNameInput,
    setIsGeneratingPDF,
  } = useQuizStore();

  const currentQuestion = getCurrentQuestion();
  const score = getScore();
  const totalQuestions = getTotalQuestions();
  const percentage = getPercentage();
  const isApproved = getApproved();


  const [formDataLogin, setFormDataLogin] = useState<InUserLoginProps>(initialValuesFormData)
  const [isLoading, setIsLoading] = useState(false)

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = validateFormData(formDataLogin);

    if (!result.valid) {
      alert(result.message);
      return;
    }
    setShowNameInput(false)
  };


  const handleAnswer = async (selectedOption: number) => {

    answerQuestion(selectedOption);
    if (!isLastQuestion()) {
      nextQuestion();
    } else {
      await sendResultsToGoogleSheet()
      setShowResults(true)

    }
  };


  const userName = useMemo(() => {
    const fname = formDataLogin.fname?.trim().split(" ")[0] || "";
    const lname = formDataLogin.lname?.trim().length > 20 ? formDataLogin.lname?.trim().split(" ")[0] : formDataLogin.lname?.trim();
    return [fname, lname].filter(Boolean).join(" ");
  }, [formDataLogin.fname, formDataLogin.lname]);



  const sendResultsToGoogleSheet = async () => {
    if (isLoading || !formDataLogin.lname) return
    try {
      setIsLoading(true)
      const secret = process.env.SECRET_KEY_SHEET;
      const currentDate = formatDateForSheet();

      const payload = {
        fname: formDataLogin.fname,
        lname: formDataLogin.lname,
        id: formDataLogin.id,
        phone: formDataLogin.phone,
        mail: formDataLogin.email,
        score: `${score * 10}%`,
        date: currentDate
      }

      await fetch('/api/send-to-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, secret }),
      });
      console.log('✅ Resultados enviados a Google Sheets correctamente');
      setIsLoading(false)

    } catch (error) {
      console.error('❌ Error al enviar a Google Sheets:', error);
      setIsLoading(false)
    }
  };





  const generateCertificate = async () => {
    if (score < 7) {
      alert('Necesitas al menos 7 respuestas correctas para obtener el certificado.');
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
          totalQuestions: totalQuestions
        }),
      });

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


  const handleRestartQuiz = () => {
    resetQuiz();
    setFormDataLogin(initialValuesFormData);
  };


  if (!hasHydrated || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex space-x-2">
          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 animate-bounce" />
        </div>
      </div>
    );
  }


  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
        <Head>
          <title>Quiz de Inducción - ABIUDEA</title>
          <meta name="description" content="Quiz de inducción para certificado" />
        </Head>

        <div className="w-full max-w-md">
          {/* Logo/Icon placeholder */}
          <div className="text-center mb-8">

            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              {/*
              <img
                src="https://abiudea.org/wp-content/uploads/2023/07/LOGO-ABIUDEA.png"
                alt="Logo ABIUDEA"
                className="mx-auto mb-4 w-24 h-24 object-contain "

              />
              */}
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Quiz de Inducción
            </h1>



          </div>

          {/* Card with glassmorphism effect */}
          <FormLogin
            formData={formDataLogin}
            setFormData={setFormDataLogin}
            onSubmit={handleNameSubmit}
          />
        </div>
      </div>
    );
  }

  if (showResults) {
    // const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
        <Head>
          <title>Resultados - Quiz de Inducción</title>
        </Head>

        <div className="w-full max-w-2xl">
          <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg ${isApproved
                ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                : 'bg-gradient-to-br from-red-400 to-pink-500'
                }`}>
                {isApproved ? (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">¡Quiz Completado!</h1>
              <p className="text-xl text-green-600 font-semibold">Hola, {userName}</p>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8 border border-green-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu Puntuación</h2>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-6xl font-bold text-green-600">
                    {score}
                  </div>
                  <div className="text-4xl text-gray-400">/</div>
                  <div className="text-4xl font-bold text-gray-600">
                    {totalQuestions}
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">{percentage}%</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Result Message */}
            {isApproved ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-r-2xl p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-green-800">¡Felicitaciones! Has aprobado el quiz.</p>
                    <p className="text-green-700">Puedes descargar tu certificado de participación.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-r-2xl p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-red-800">Necesitas al menos 7 respuestas correctas para obtener el certificado.</p>
                    <p className="text-red-700">¡No te preocupes! Puedes intentarlo de nuevo.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isApproved && (
                <button
                  onClick={generateCertificate}
                  disabled={isGeneratingPDF}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Descargar Certificado</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleRestartQuiz}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reiniciar Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de preguntas
  if (!currentQuestion) {
    return <div>Cargando pregunta...</div>;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <Head>
        <title>Quiz de Inducción - Pregunta {currentQuestionIndex + 1}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-4xl">
        <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-600">Pregunta {currentQuestionIndex + 1} de {totalQuestions}</span>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                Participante: {`${formDataLogin.fname.split(" ")[0]} ${formDataLogin.lname}`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Inicio</span>
              <span className="text-xs text-gray-500">{Math.round(((currentQuestionIndex) / totalQuestions) * 100)}% completado</span>
              <span className="text-xs text-gray-500">Final</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed text-center">
              {currentQuestion.question}
            </h2>
          </div>
          {/* Options */}
          <div className="grid gap-4 md:gap-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="cursor-pointer group p-6 bg-white/80 hover:bg-white border-2 border-green-200 hover:border-green-400 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center transition-colors duration-300">
                    <span className="text-green-600 font-bold text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium text-sm leading-6 group-hover:text-gray-900 transition-colors duration-300">
                      {option}
                    </p>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Helper Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Selecciona la respuesta que consideres correcta para continuar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client"

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { FormLogin } from '@/components/formLogin/FormLogin';
import { InUserLoginProps } from '@/types/InFormLogin';
import { formatDateForSheet, validateFormData } from '@/utils/function';
import { useQuizStore } from '@/store/question.store';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user.store';





const initialValuesFormData: InUserLoginProps = {
  fname: "",
  lname: "",
  id: "",
  phone: "",
  email: ""
};

export default function Home() {
  const router = useRouter();
  const {
    hasHydrated,
    answerQuestion,
    nextQuestion,
    getCurrentQuestion,
    getScore,
    getTotalQuestions,
    currentQuestionIndex,
    isLastQuestion,
    setShowResults,
    setShowNameInput,
    showNameInput,
    showResults,
    setIsGeneratingPDF,
  } = useQuizStore();

const {formDataLogin, setFormDataLogin}=  useUserStore()

  const currentQuestion = getCurrentQuestion();
  const score = getScore();
  const totalQuestions = getTotalQuestions();


  const [isLoading, setIsLoading] = useState(false)


 useEffect(() => {
    if (showResults) {
      // Espera un ciclo de evento antes de redirigir
      setTimeout(() => {
        router.push('/certificado');
      }, 0);
    }
  }, [showResults]);


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
      goToCertificate()

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


  const goToCertificate = () => {
    router.push(`/certificado`);
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
              <span className="text-xs md:text-sm font-semibold text-gray-600">Pregunta {currentQuestionIndex + 1} de {totalQuestions}</span>
              <span className="hidden lg:block text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
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
              <span className="hidden md:block text-xs text-gray-500">{Math.round(((currentQuestionIndex) / totalQuestions) * 100)}% completado</span>
              <span className="text-xs text-gray-500">Final</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-lg lg:text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed text-center">
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
                    <p className="text-xs md:text-sm text-gray-800 font-medium  leading-6 group-hover:text-gray-900 transition-colors duration-300">
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
            <p className="text-xs md:text-sm text-gray-500">
              Selecciona la respuesta que consideres correcta para continuar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
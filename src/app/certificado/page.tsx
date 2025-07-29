"use client"
import CertificatePreview from "@/components/certificate/preview";
import { useQuizStore } from "@/store/question.store";
import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter()
  const { getTotalQuestions, isApproved: getApproved, showResults, resetQuiz, getScore, getPercentage } = useQuizStore();
  const { getUsername, resetFormDataLogin } = useUserStore()

  const isApproved = getApproved()
  const userName = getUsername()
  const percentage = getPercentage()
  const score = getScore()
  const totalQuestions = getTotalQuestions()


  useEffect(() => {
    if (!showResults) {
      router.push('/');
    }
  }, [showResults, router]);

  const handleResetQuiz = () => {
    resetQuiz();
    resetFormDataLogin();
    router.push('/')
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">

      {isApproved && showResults && (
        <div className="flex flex-col items-center justify-center w-full ">
            <CertificatePreview name={userName} onHandleLogout={handleResetQuiz} />
        </div>


      )}

      {!isApproved && showResults && (

        <div className="w-full max-w-2xl">
          <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl border border-white/20 p-8">
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
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - 50 / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">{percentage}%</span>
                  </div>
                </div>

              </div>
            </div>

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

            <div className="flex flex-col sm:flex-row gap-4">

              <button
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={handleResetQuiz}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reiniciar Quiz</span>
              </button>
            </div>
          </div>
        </div>



      )}


    </div>


  )


}

export default Page;
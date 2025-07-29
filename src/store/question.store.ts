import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QUESTION_DATA as defaultQuestions } from '@/constants/questions/questions';

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number; // índice correcto
};

type Answer = {
  questionId: number;
  selectedIndex: number;
};

type QuizStore = {
  // Estado del quiz
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  showResults: boolean;

  // Estado del usuario
  showNameInput: boolean;

  // Estado del certificado
  isGeneratingPDF: boolean;

  // Estado de hidratación
  hasHydrated: boolean;

  // Acciones del quiz
  answerQuestion: (selectedIndex: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  restartQuiz: () => void;
  getScore: () => number;
  getTotalQuestions: () => number;
  getPercentage: () => number;
  isApproved: () => boolean;

  // Acciones de UI
  setShowNameInput: (show: boolean) => void;
  setShowResults: (show: boolean) => void;
  setIsGeneratingPDF: (isGenerating: boolean) => void;

  // Estado de la pregunta actual
  getCurrentQuestion: () => Question | null;
  isLastQuestion: () => boolean;
  hasAnsweredCurrentQuestion: () => boolean;

  // Funciones de persistencia
  clearPersistedData: () => void;
  hasPersistedData: () => boolean;

  //functiones de hidratacion
  setHasHydrated: (value: boolean) => void;

};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      questions: defaultQuestions,
      answers: [],
      currentQuestionIndex: 0,
      showResults: false,
      showNameInput: true,
      isGeneratingPDF: false,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      // Acciones del quiz
      answerQuestion: (selectedIndex) => {
        const state = get();
        const currentQuestion = state.questions[state.currentQuestionIndex];

        if (!currentQuestion) return;

        // Verificar si ya respondió esta pregunta
        const existingAnswerIndex = state.answers.findIndex(
          (a) => a.questionId === currentQuestion.id
        );

        if (existingAnswerIndex >= 0) {
          // Actualizar respuesta existente
          set((state) => ({
            answers: state.answers.map((answer, index) =>
              index === existingAnswerIndex
                ? { ...answer, selectedIndex }
                : answer
            ),
          }));
        } else {
          // Agregar nueva respuesta
          set((state) => ({
            answers: [...state.answers, {
              questionId: currentQuestion.id,
              selectedIndex
            }],
          }));
        }
      },

      nextQuestion: () => {
        const state = get();
        if (state.currentQuestionIndex < state.questions.length - 1) {
          set((state) => ({
            currentQuestionIndex: state.currentQuestionIndex + 1,
          }));
        } else {
          // Si es la última pregunta, mostrar resultados
          set({ showResults: true });
        }
      },

      resetQuiz: () =>
        set({
          answers: [],
          currentQuestionIndex: 0,
          showResults: false,
          showNameInput: true,
          isGeneratingPDF: false,
        }),

        
      restartQuiz: () =>
        set({
          answers: [],
          currentQuestionIndex: 0,
          showResults: false,
          isGeneratingPDF: false,
        }),

      getScore: () => {
        const { questions, answers } = get();
        return answers.reduce((score, ans) => {
          const question = questions.find((q) => q.id === ans.questionId);
          return question?.correct === ans.selectedIndex ? score + 1 : score;
        }, 0);
      },

      getTotalQuestions: () => get().questions.length,

      getPercentage: () => {
        const { getScore, getTotalQuestions } = get();
        const total = getTotalQuestions();
        return total > 0 ? Math.round((getScore() / total) * 100) : 0;
      },

      isApproved: () => get().getScore() >= 7,

      // Acciones de UI
      setShowNameInput: (show) => set({ showNameInput: show }),

      setShowResults: (show) => set({ showResults: show }),

      setIsGeneratingPDF: (isGenerating) => set({ isGeneratingPDF: isGenerating }),

      // Helpers para la pregunta actual
      getCurrentQuestion: () => {
        const { questions, currentQuestionIndex } = get();
        return questions[currentQuestionIndex] || null;
      },

      isLastQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        return currentQuestionIndex >= questions.length - 1;
      },

      hasAnsweredCurrentQuestion: () => {
        const { answers, getCurrentQuestion } = get();
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion) return false;
        return answers.some(answer => answer.questionId === currentQuestion.id);
      },

      // Funciones de persistencia
      clearPersistedData: () => {
        // Limpiar localStorage manualmente
        localStorage.removeItem('quiz-storage');
        // Resetear el estado
        set({
          answers: [],
          currentQuestionIndex: 0,
          showResults: false,
          showNameInput: true,
          isGeneratingPDF: false,
        });
      },

      hasPersistedData: () => {
        const stored = localStorage.getItem('quiz-storage');
        if (!stored) return false;
        try {
          const parsed = JSON.parse(stored);
          return parsed.state && (
            parsed.state.answers?.length > 0 ||
            parsed.state.currentQuestionIndex > 0 ||
            parsed.state.showResults === true
          );
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'quiz-storage', // nombre único para el localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir ciertos campos (opcional)
      partialize: (state) => ({
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        showResults: state.showResults,
        showNameInput: state.showNameInput,
      }),
      // Versión para manejar migraciones si cambias la estructura
      version: 1,
      // Función para migrar datos de versiones anteriores (opcional)
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Migrate from version 0 to version 1
          return {
            ...(persistedState as Record<string, unknown>),
            // Add new fields with default values here if needed
          };
        }
        return persistedState as QuizStore;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
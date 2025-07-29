import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InUserLoginProps {
  fname: string;
  lname: string;
  id: string;
  phone: string;
  email: string;
}

const initialValuesFormData: InUserLoginProps = {
  fname: "",
  lname: "",
  id: "",
  phone: "",
  email: ""
};

interface UserStore {
  formDataLogin: InUserLoginProps;
  setFormDataLogin: (data: InUserLoginProps) => void;
  resetFormDataLogin: () => void;
  getUsername: () => string;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      formDataLogin: initialValuesFormData,
      setFormDataLogin: (data) => set({ formDataLogin: data }),
      resetFormDataLogin: () => set({ formDataLogin: initialValuesFormData }),
      getUsername: () => {
        const { fname, lname } = get().formDataLogin;
        const firstName = fname.trim().split(' ')[0] || '';
        const lastNames = lname.trim().split(' ').slice(0, 2).join(' ');
        return [firstName, lastNames].filter(Boolean).join(' ').trim();
      }
    }),
    {
      name: 'user-store',
    }
  )
);
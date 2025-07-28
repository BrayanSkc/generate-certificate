import { ITEMS_FORMS_LOGIN } from '@/constants/form/login';
import { InUserLoginProps } from '@/types/InFormLogin';
import React from 'react';

interface InFormLoginProps {
  formData: InUserLoginProps;
  setFormData: (data: InFormLoginProps["formData"]) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const FormLogin: React.FC<InFormLoginProps> = ({
  formData,
  setFormData,
  onSubmit,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl border border-white/20 p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        {ITEMS_FORMS_LOGIN.map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
              {label}
            </label>
            <input
              type={type}
              id={name}
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              placeholder={placeholder}
              autoComplete='off'
              required
              className="w-full px-4 py-4 bg-white/80 border-2 border-green-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span>Comenzar Quiz</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </form>
    </div>
  );
};

import { InUserLoginProps } from "@/types/InFormLogin";


export function validateFormData(data: InUserLoginProps): { valid: boolean; message?: string } {
  const { fname, lname, id, phone, email } = data;

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
  const idRegex = /^\d{6,12}$/;
  const phoneRegex = /^\d{7,12}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameRegex.test(fname.trim()) || fname.trim().split(" ").length < 1) {
    return { valid: false, message: "Por favor ingresa un nombre completo válido (al menos un nombre)." };
  }

  if (!nameRegex.test(lname.trim()) || lname.trim().split(" ").length < 2) {
    return { valid: false, message: "Por favor ingresa apellidos válidos (al menos dos apellidos)." };
  }

  if (!idRegex.test(id.trim())) {
    return { valid: false, message: "La cédula debe tener entre 6 y 12 dígitos." };
  }

  if (!phoneRegex.test(phone.trim())) {
    return { valid: false, message: "El teléfono debe tener entre 7 y 12 dígitos." };
  }

  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: "Por favor ingresa un correo electrónico válido." };
  }

  return { valid: true };
}




export const formatDateForSheet = () => {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Bogota', // Asegura hora colombiana
  });

  // Obtenemos "28/07/2025 18:48" como una sola string
  return formatter.format(date).replace(',', '');
};

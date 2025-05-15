import { cycle_days, start_date } from "../config";
import { differenceInDays, addDays } from "date-fns";

/**
 * Día actual dentro del ciclo, contado desde la fecha de inicio
 */
export function getCurrentCycleDay() {
  const today = new Date();
  const diffTime = today - start_date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays % cycle_days) + 1;
}

/**
 * Fecha concreta a partir de un día dentro del ciclo
 */
export function getDateFromCycleDay(day) {
  const resultDate = new Date(start_date);
  resultDate.setDate(start_date.getDate() + day - 1);
  return resultDate.toISOString().split("T")[0];
}

// Día siguiente de la fecha prevista para la menstruación 
export function getNextMenstruationDate() {
  const today = new Date();
  const diffDays = differenceInDays(today, start_date);
  const cyclesPassed = Math.floor(diffDays / cycle_days);
  const nextStart = addDays(start_date, (cyclesPassed + 1) * cycle_days);
  return nextStart;
}

// Formatea la fecha al formato "DD/MM/YYYY"
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Calcula la edad a partir de una fecha de nacimiento
export const calculateAge = (birthDate) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

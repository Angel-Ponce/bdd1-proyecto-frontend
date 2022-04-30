import { format } from "date-fns";

const formatDate = (date: string): string => {
  return format(new Date(date), "dd/MM/yyyy 'a las' HH:mm");
};

const ES_MONTHS = [
  "Ninguno",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export { formatDate, ES_MONTHS };

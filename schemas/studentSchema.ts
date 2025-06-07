import { z } from 'zod';

export const studentFormSchema = z.object({
  email: z.string().email({ message: "Formato de e-mail inválido." }).min(1, {message: "E-mail é obrigatório."}),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
  fullName: z.string().min(3, { message: "Nome completo é obrigatório." }),
  cpf: z.string()
    .min(1, { message: "CPF é obrigatório."})
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "Formato de CPF inválido. Use 000.000.000-00." }),
  phone: z.string()
    .optional()
    .transform(value => value === "" ? undefined : value) 
    .refine(value => value === undefined || /^\(\d{2}\) \d{5}-\d{4}$/.test(value), {
      message: "Formato de telefone inválido. Use (00) 00000-0000.",
    }),
  dateOfBirth: z.string().min(1, {message: "Data de nascimento é obrigatória."}).refine(val => {
    const date = new Date(val);
    const today = new Date();
    date.setUTCHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return date <= today;
  }, { message: "Data de nascimento não pode ser futura." }),
  objectives: z.array(z.string().min(1, { message: "Objetivo não pode ser vazio."}))
              .min(1, { message: "Selecione pelo menos um objetivo." })
              .max(10, { message: "Máximo de 10 objetivos."}), // Optional: limit max tags
  avatar: z.string().optional(), 
  observations: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;
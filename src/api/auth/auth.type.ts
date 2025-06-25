import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      message: "El email es requerido",
    })
    .email({
      message: "El email no es válido",
    }),
  password: z.string({
    message: "La contraseña es requerida",
  }),
});

export type LoginDto = z.infer<typeof LoginSchema>;

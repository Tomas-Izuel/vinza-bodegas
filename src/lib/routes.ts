import z from "zod";

export enum Routes {
  HOME = "/",
  LOGIN = "/login",
  REGISTER = "/register",
  FORGOT_PASSWORD = "/forgot-password",
  RESET_PASSWORD = "/reset-password",
  RESERVAS = "/reservas",
  EVENTOS = "/eventos",
  BODEDA = "/bodega",
  BODEDA_INFORMACION = "/bodega/informacion",
  BODEDA_USUARIOS = "/bodega/usuarios",
  LOGOUT = "/logout",
}

export const RouteSchema = z.nativeEnum(Routes);

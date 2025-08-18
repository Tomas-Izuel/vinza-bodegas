import z from "zod";

export enum Routes {
  HOME = "/",
  LOGIN = "/login",
  REGISTER = "/register",
  FORGOT_PASSWORD = "/forgot-password",
  RESET_PASSWORD = "/reset-password",
  RESERVAS = "/reservas",
  EVENTOS = "/eventos",
  CREAR_EVENTO = "/eventos/crear",
  EDITAR_EVENTO = "/eventos/editar/",
  VER_EVENTO = "/eventos/",
  BODEDA = "/bodega",
  BODEDA_INFORMACION = "/bodega/informacion",
  USUARIOS = "/usuarios",
  CREAR_USUARIO = "/usuarios/crear",
  LOGOUT = "/logout",
}

export const RouteSchema = z.nativeEnum(Routes);

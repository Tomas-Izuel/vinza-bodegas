import z from "zod";

export enum Routes {
  HOME = "/",
  LOGIN = "/iniciar-sesion",
  LOGOUT = "/cerrar-sesion",
  REGISTER = "/registro",
  FORGOT_PASSWORD = "/forgot-password",
  RESET_PASSWORD = "/reset-password",
  PERFIL = "/perfil",
  RESERVAS = "/reservas",
  EVENTOS = "/eventos",
  CREAR_EVENTO = "/eventos/crear",
  VER_EVENTO = "/eventos/",
  BODEDA = "/bodega",
  BODEDA_INFORMACION = "/bodega/informacion",
  USUARIOS = "/usuarios",
  CREAR_USUARIO = "/usuarios/crear",
  ESPERANDO_VALIDACION = "/esperando-validacion",
}

export const RouteSchema = z.nativeEnum(Routes);

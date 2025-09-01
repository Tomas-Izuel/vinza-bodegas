import z from "zod";

export enum Routes {
  HOME = "/",
  LOGIN = "/iniciar-sesion",
  LOGOUT = "/cerrar-sesion",
  REGISTER = "/registro",
  UNAUTHORIZED = "/no-autorizado",
  FORGOT_PASSWORD = "/forgot-password",
  RESET_PASSWORD = "/reset-password",
  PERFIL = "/perfil",
  RESERVAS = "/reservas",
  EVENTOS = "/eventos",
  CREAR_EVENTO = "/eventos/crear",
  VER_EVENTO = "/eventos/",
  BODEGA = "/bodega",
  BODEGA_INFORMACION = "/bodega/informacion",
  CREAR_BODEGA = "/bodega/crear",
  USUARIOS = "/usuarios",
  CREAR_USUARIO = "/usuarios/crear",
}

export const RouteSchema = z.nativeEnum(Routes);

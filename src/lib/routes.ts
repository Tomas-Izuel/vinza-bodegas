import z from "zod";

export enum Routes {
  HOME = "/",
  LOGIN = "/iniciar-sesion",
  LOGOUT = "/cerrar-sesion",
  REGISTER = "/registro",
  VALIDATE_ACCOUNT = "/validar-cuenta",
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
  SUCURSALES = "/sucursales",
  VER_SUCURSAL = "/sucursales/",
  CREAR_SUCURSAL = "/sucursales/crear",
  USUARIOS = "/usuarios",
  CREAR_USUARIO = "/usuarios/crear",
  ESPERANDO_VALIDACION = "/esperando-validacion",
}

export const RouteSchema = z.nativeEnum(Routes);

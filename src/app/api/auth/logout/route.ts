import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { Routes } from "@/lib/routes";
import { errorLogger } from "@/lib/utils";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);

    // Retornar respuesta exitosa
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al cerrar sesión";
    errorLogger(error, "logout");

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);

    // Redirigir al login después de logout
    return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
  } catch (error) {
    errorLogger(error, "logout");

    // En caso de error, redirigir al login de todas formas
    return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
  }
}

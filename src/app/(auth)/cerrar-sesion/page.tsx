import { redirect } from "next/navigation";

// Forzar renderizado dinámico para evitar error de cookies
export const dynamic = "force-dynamic";

const LogoutPage = async () => {
  // Redirigir directamente al Route Handler de logout
  redirect("/api/auth/logout");
};

export default LogoutPage;

import { Routes } from "@/lib/routes";
import { redirect } from "next/navigation";
import { errorLogger } from "@/lib/utils";
import { logout } from "@/api/auth/auth.service";

// Forzar renderizado dinámico para evitar error de cookies
export const dynamic = "force-dynamic";

const LogoutPage = async () => {
  try {
    await logout();
    redirect(Routes.LOGIN);
  } catch (error) {
    errorLogger(error, "logout");
  }

  return redirect(Routes.LOGIN);
};

export default LogoutPage;

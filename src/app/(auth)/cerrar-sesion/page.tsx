import { Routes } from "@/lib/routes";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { errorLogger } from "@/lib/utils";

const LogoutPage = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
  } catch (error) {
    errorLogger(error, "logout");
  }

  return redirect(Routes.LOGIN);
};

export default LogoutPage;

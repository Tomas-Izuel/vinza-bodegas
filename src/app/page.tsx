import { Routes } from "@/lib/routes";
import { validateAuthCookie } from "@/lib/utils.server";
import { redirect } from "next/navigation";

export default async function Home() {
  const authCookie = await validateAuthCookie();
  console.log(authCookie);
  if (!authCookie) {
    redirect(Routes.LOGIN);
  } else {
    redirect(Routes.DASHBOARD);
  }
}

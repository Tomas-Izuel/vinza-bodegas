import { validateAuthCookie } from "@/lib/utils.server";
import { redirect } from "next/navigation";

export default async function Home() {
  const authCookie = await validateAuthCookie();
  console.log(authCookie);
  if (!authCookie) {
    redirect("/iniciar-sesion");
  } else {
    redirect("/dashboard");
  }
}

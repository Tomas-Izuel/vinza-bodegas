import { AUTH_COOKIE_NAME } from "./constants";
import { cookies } from "next/headers";
import z from "zod";
import { errorLogger } from "./utils";

export const authCookieSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["admin", "user"]),
});

export const validateAuthCookie = async (): Promise<
  boolean | z.infer<typeof authCookieSchema>
> => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!authCookie) {
    errorLogger("No auth cookie found", "validateAuthCookie");
    return false;
  }

  const decodedCookie = authCookieSchema.safeParse(authCookie.value);
  if (!decodedCookie.success) {
    errorLogger("Invalid auth cookie", "validateAuthCookie");
    return false;
  }

  return decodedCookie.data;
};

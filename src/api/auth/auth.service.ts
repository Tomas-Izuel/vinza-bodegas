"use server";

import { errorLogger } from "@/lib/utils";
import { LoginDto } from "./auth.type";

export const login = async (data: LoginDto) => {
  try {
    // TODO: Implement login logic
    console.log(data);
  } catch (error) {
    errorLogger(error, "login");
  }
};

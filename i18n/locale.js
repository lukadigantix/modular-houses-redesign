"use server";

import { cookies } from "next/headers";
import { defaultLocale, locales } from "./config";

// We store the active locale in a cookie (no URL-based routing).
const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  const value = cookies().get(COOKIE_NAME)?.value;
  return locales.includes(value) ? value : defaultLocale;
}

export async function setUserLocale(locale) {
  const next = locales.includes(locale) ? locale : defaultLocale;
  cookies().set(COOKIE_NAME, next, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}

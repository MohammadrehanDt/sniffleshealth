import type { Response, CookieOptions } from "express";

export const ACCESS_TOKEN_COOKIE = "sniffles_access_token";
export const REFRESH_TOKEN_COOKIE = "sniffles_refresh_token";

const isProduction = () => process.env.NODE_ENV === "production";

function baseCookieOptions(): CookieOptions {
  const prod = isProduction();
  return {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? "none" : "lax",
    path: "/",
  };
}

/**
 * When rememberMe is true  → persistent cookies (access 15m, refresh 30d)
 * When rememberMe is false → access gets maxAge 15m, refresh is a session cookie (cleared on browser close)
 */
export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  rememberMe = false,
) {
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseCookieOptions(),
    maxAge: 15 * 60 * 1000,
  });

  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...baseCookieOptions(),
    ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
  });
}

export function clearAuthCookies(res: Response) {
  const opts = baseCookieOptions();
  res.clearCookie(ACCESS_TOKEN_COOKIE, opts);
  res.clearCookie(REFRESH_TOKEN_COOKIE, opts);
}

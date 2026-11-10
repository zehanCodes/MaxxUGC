// In local development, skip the login form entirely (see app/dev/login).
export const LOGIN_PATH =
  process.env.NODE_ENV === "development" ? "/dev/login" : "/login"

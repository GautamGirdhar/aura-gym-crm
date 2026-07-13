export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/members/:path*",
    "/dashboard/:path*",
    "/import/:path*",
    "/expiring/:path*",
  ],
};

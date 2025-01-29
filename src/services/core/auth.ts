import type { AstroGlobal } from "astro";

export const getAccessToken = (Astro: AstroGlobal): string | null => {
  return Astro.cookies.get("access_token")?.value || null;
};

export const logout = (Astro: AstroGlobal) => {
  Astro.cookies.delete("access_token");
  Astro.cookies.delete("refresh_token");
  Astro.redirect("/login");
};

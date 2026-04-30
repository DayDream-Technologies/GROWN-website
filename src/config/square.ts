/**
 * Square Application ID (public). Override with `VITE_SQUARE_APPLICATION_ID` for
 * a different app (e.g. sandbox) in `.env` or Amplify build settings.
 */
const fromEnv = import.meta.env.VITE_SQUARE_APPLICATION_ID?.trim();

export const SQUARE_APPLICATION_ID =
  fromEnv && fromEnv.length > 0 ? fromEnv : "sq0idp-pnD1Ri5un2ZCGgtq9bzq5Q";

import { createClient } from "@supabase/supabase-js";

const EXTERNAL_SUPABASE_URL = "https://desrtxnrbqiwqpraupii.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlc3J0eG5yYnFpd3FwcmF1cGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzcxNDksImV4cCI6MjA4NTYxMzE0OX0.D3VSPI_eW7Lp6FUY3sGgbL7RDEhZ4WkwIkI6zbGOpVY";

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY);

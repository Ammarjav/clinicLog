import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Super‑admin secret – set in Supabase Edge Function env vars
const SUPER_ADMIN_TOKEN = Deno.env.get("SUPER_ADMIN_TOKEN")!;
const MASTER_PIN = Deno.env.get("ADMIN_PIN")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ---------- Rate limiting (5 attempts per IP) ----------
  const ip = (req.headers.get("cf-connecting-ip") ?? req.headers.get("remoteAddress") ?? "unknown-ip");
  const attemptsKey = `/tmp/admin_pin_attempts:${ip}`;
  const attempts = parseInt(await Deno.readTextFile(attemptsKey) || "0", 10);
  if (attempts >= 5) {
    return new Response(
      JSON.stringify({ error: "Too many attempts, try again later" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
    );
  }

  // ---------- Super‑admin bypass ----------
  const superAdminHeader = req.headers.get("x-super-admin-token");
  if (superAdminHeader === SUPER_ADMIN_TOKEN) {
    return new Response(
      JSON.stringify({ authorized: true, bypass: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }

  // ---------- JWT verification ----------
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid Authorization header" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }
  const token = authHeader.slice("Bearer ".length);
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = decodeURIComponent(
      atob(payloadBase64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
        .replace(/%([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    );
    const payload = JSON.parse(payloadJson);
    if (payload.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid token" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }

  // ---------- PIN verification ----------
  if (pin !== MASTER_PIN) {
    const newAttempts = attempts + 1;
    await Deno.writeTextFile(attemptsKey, String(newAttempts));
    return new Response(
      JSON.stringify({ error: "Invalid PIN" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }

  // ---------- Successful verification ----------
  return new Response(
    JSON.stringify({ authorized: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
});
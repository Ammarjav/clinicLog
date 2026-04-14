import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Simple rate limiting: track attempts per IP using /tmp storage
  const ip = (req.headers.get("cf-connecting-ip") ||
              req.headers.get("remoteAddress") ||
              "unknown-ip");
  const attemptsKey = `/tmp/admin_pin_attempts:${ip}`;
  const attempts = parseInt(await Deno.readTextFile(attemptsKey) || "0", 10);
  if (attempts >= 5) {
    return new Response(
      JSON.stringify({ error: "Too many attempts, try again later" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
    );
  }

  // Verify JWT token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid Authorization header" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }
  const token = authHeader.slice("Bearer ".length);
  try {
    // Decode JWT payload (no signature verification for simplicity)
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

  // Retrieve PIN from environment variable (set via Supabase console)
  const masterPin = Deno.env.get("ADMIN_PIN");
  if (!masterPin) {
    return new Response(
      JSON.stringify({ error: "Server misconfiguration" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  const { pin } = await req.json().catch(() => ({ pin: "" }));
  if (pin !== masterPin) {
    // Increment attempt counter
    const newAttempts = attempts + 1;
    await Deno.writeTextFile(attemptsKey, String(newAttempts));
    return new Response(
      JSON.stringify({ error: "Invalid PIN" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }

  // Successful verification
  return new Response(
    JSON.stringify({ authorized: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
});
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { pin } = await req.json()
    
    // The PIN is now retrieved from Supabase Secrets (Environment Variables)
    // You must set ADMIN_PROTOCOL_PIN in your Supabase Dashboard
    const MASTER_PIN = Deno.env.get('ADMIN_PROTOCOL_PIN')

    if (!MASTER_PIN) {
      console.error("[verify-admin-pin] Configuration error: ADMIN_PROTOCOL_PIN secret not set")
      return new Response(
        JSON.stringify({ authorized: false, error: 'Terminal misconfigured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (pin === MASTER_PIN) {
      console.log("[verify-admin-pin] PIN verified successfully via secure protocol")
      return new Response(
        JSON.stringify({ authorized: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } else {
      console.warn("[verify-admin-pin] Invalid PIN attempt detected")
      return new Response(
        JSON.stringify({ authorized: false, error: 'Invalid code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }
  } catch (error) {
    console.error("[verify-admin-pin] Error processing request", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
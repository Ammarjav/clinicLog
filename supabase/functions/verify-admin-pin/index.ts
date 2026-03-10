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
    
    // The PIN is now stored here on the server, invisible to the browser
    const MASTER_PIN = "200317"

    if (pin === MASTER_PIN) {
      console.log("[verify-admin-pin] PIN verified successfully")
      return new Response(
        JSON.stringify({ authorized: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } else {
      console.warn("[verify-admin-pin] Invalid PIN attempt")
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
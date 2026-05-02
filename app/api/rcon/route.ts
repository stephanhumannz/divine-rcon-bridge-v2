import { Rcon } from 'rcon-client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// This handler allows you to test the link in your browser (GET)
export async function GET() {
  return new Response(JSON.stringify({ status: "Bridge Online" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// This handler processes the RCON commands from your website (POST)
export async function POST(req: Request) {
  try {
    const { command } = await req.json();
    const { data: config, error } = await supabase.from('server_configs').select('*').single();

    if (error || !config) return new Response(JSON.stringify({ error: 'No Config Found' }), { status: 404 });

    const rcon = await Rcon.connect({
      host: config.ip,
      port: config.rcon_port,
      password: config.rcon_password,
    });

    const output = await rcon.send(command);
    await rcon.end();

    return new Response(JSON.stringify({ output }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

// Handles browser security checks
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

import { Rcon } from 'rcon-client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const { command } = await req.json();
    const { data: config } = await supabase.from('server_configs').select('*').single();

    if (!config) return new Response('No Config', { status: 404 });

    const rcon = await Rcon.connect({
      host: config.ip,
      port: config.rcon_port,
      password: config.rcon_password,
    });

    const output = await rcon.send(command);
    await rcon.end();

    return new Response(JSON.stringify({ output }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

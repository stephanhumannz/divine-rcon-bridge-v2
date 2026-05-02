import { Rcon } from 'rcon-client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { command } = await req.json();

    const { data: config, error } = await supabase
      .from('server_configs')
      .select('ip, rcon_port, rcon_password')
      .single();

    if (error || !config) throw new Error("Config not found in Supabase.");

    const rcon = await Rcon.connect({
      host: config.ip,
      port: config.rcon_port,
      password: config.rcon_password,
    });

    const response = await rcon.send(command);
    await rcon.end();

    return new Response(JSON.stringify({ output: response }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

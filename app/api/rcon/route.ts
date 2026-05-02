import { NextResponse } from 'next/server';
import { Rcon } from 'rcon-client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

// This handles the "OPTIONS" request seen in your logs
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  try {
    const { command } = await req.json();
    const { data: config, error } = await supabase.from('server_configs').select('*').single();

    if (error || !config) {
      return NextResponse.json({ error: 'Server configuration not found' }, { status: 404 });
    }

    const rcon = await Rcon.connect({
      host: config.ip,
      port: config.rcon_port,
      password: config.rcon_password,
    });

    const output = await rcon.send(command);
    await rcon.end();

    return NextResponse.json({ output }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { 
      status: 500, 
      headers: { 'Access-Control-Allow-Origin': '*' } 
    });
  }
}

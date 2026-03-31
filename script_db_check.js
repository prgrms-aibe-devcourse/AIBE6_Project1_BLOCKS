const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: planner, error: err1 } = await supabase.from('planner').select('*').order('planner_id', { ascending: false }).limit(2);
  const { data: plans, error: err2 } = await supabase.from('plans').select('*').order('plan_id', { ascending: false }).limit(5);

  console.log("LAST PLANNERS:", planner);
  console.log("LAST PLANS:", plans);
  if (err1) console.error("ERR1", err1);
  if (err2) console.error("ERR2", err2);
}

check();

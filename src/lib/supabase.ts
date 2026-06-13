import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  'https://aocufvhlqjkhigtpqtrv.supabase.co';

const supabaseKey =
  'sb_publishable_afz8JYrFxs9ouK2ghwQJig_DKoJ_N6p';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
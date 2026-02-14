import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'PASTE_URL_HERE'
const SUPABASE_ANON_KEY = 'PASTE_ANON_KEY_HERE'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

globalThis.supabase = globalThis.supabase || {}
globalThis.supabase.client = supabase

export { supabase }

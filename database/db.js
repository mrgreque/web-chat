const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://vdypxzucbrxswuubdsck.supabase.co";

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = supabase;
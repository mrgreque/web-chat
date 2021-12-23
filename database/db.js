const { createClient } = require("@supabase/supabase-js");

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDEwOTYwNywiZXhwIjoxOTU1Njg1NjA3fQ.rhhyVZUJ1WYaVUnJmwrtqJsvi2rrC848lXWJtl1sxz4';
const SUPABASE_URL = "https://iykkgmfeaqdxtetklswl.supabase.co";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
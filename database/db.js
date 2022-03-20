const { createClient } = require("@supabase/supabase-js");

// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDEwOTYwNywiZXhwIjoxOTU1Njg1NjA3fQ.rhhyVZUJ1WYaVUnJmwrtqJsvi2rrC848lXWJtl1sxz4';
// const SUPABASE_URL = "https://iykkgmfeaqdxtetklswl.supabase.co";
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkeXB4enVjYnJ4c3d1dWJkc2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc3OTgyODcsImV4cCI6MTk2MzM3NDI4N30.3E9A1VzzlI39zlDVY0x_6zcZDUXlqgrog5hJzpCGNCE';
const SUPABASE_URL = "https://vdypxzucbrxswuubdsck.supabase.co";

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY || SUPABASE_KEY);

module.exports = supabase;
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aovdihtqfarbnxehgqta.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdmRpaHRxZmFyYm54ZWhncXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDEwNzcsImV4cCI6MjA4MDkxNzA3N30.fh4eoVe8VZJyt_-dyB0HdD9PDbLczqAJpQgTmgByOFA";
export const supabase = createClient(supabaseUrl, supabaseKey);

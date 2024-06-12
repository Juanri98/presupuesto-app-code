import { createClient } from '@supabase/supabase-js';

const supabaseApiURL = 'https://tuqyysyywwhustfrhvsz.supabase.co';
const supabaseApiKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cXl5c3l5d3dodXN0ZnJodnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUzMzY2OTgsImV4cCI6MjAxMDkxMjY5OH0.T58v7aAaJsVEEb0N1y6S1ff4Q8dvMEN8P2Xgb-CGyzc';

export const supabase = createClient(supabaseApiURL, supabaseApiKey);

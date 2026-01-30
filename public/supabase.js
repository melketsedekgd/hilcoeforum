import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xlrnaxmjykcldherfywy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhscm5heG1qeWtjbGRoZXJmeXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTAzNTcsImV4cCI6MjA4NTMyNjM1N30.00eWFylerK7u76JiRc6wecMf_CpeAV2m2YqSDPR_170';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
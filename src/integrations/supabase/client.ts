import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fxpmhorehhlvnjxtfznm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cG1ob3JlaGhsdm5qeHRmem5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTA2MzcsImV4cCI6MjA5MjE4NjYzN30.05NxjV3i8IFGnVgKkKhQcK6ZPzW46O8AfV-IRla7XIQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

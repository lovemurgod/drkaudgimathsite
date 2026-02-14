(function () {
  const SUPABASE_URL = 'https://bkjczbsawazkondzaxgi.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramN6YnNhd2F6a29uZHpheGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDEzMzksImV4cCI6MjA4NjU3NzMzOX0.oqYEsNBM5iBn7Gv4w_Y2wRhj1VBdULwov5NBDdlq4WU';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase library is not loaded.');
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabaseClient = client;
  window.supabase = client;
})();

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PMDashboard from "@/components/PMDashboard";
import Login from "@/components/Login";

export default function App() {
  const [user, setUser]       = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if a session already exists (e.g. user refreshes page)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });

    // Listen for login / logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setChecking(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Still checking session — show nothing briefly
  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#07090f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "DM Sans, sans-serif",
        color: "#4e5f74",
        fontSize: 13,
      }}>
        Loading...
      </div>
    );
  }

  // Not logged in — show login screen
  if (!user) return <Login />;

  // Logged in — show dashboard
  return <PMDashboard />;
}

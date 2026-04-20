import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Login from "@/components/Login";
import Index from "@/pages/Index";

export default function App() {
  const [ready, setReady] = useState(false);
  const [user, setUser]   = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  if (!ready) return (
    <div style={{
      minHeight: "100vh",
      background: "#07090f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#4e5f74",
      fontFamily: "sans-serif",
      fontSize: 13,
    }}>
      Loading...
    </div>
  );

  if (!user) return <Login />;

  return <Index />;
}

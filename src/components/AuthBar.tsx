import { LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

interface AuthBarProps {
  user: User | null;
}

export const AuthBar = ({ user }: AuthBarProps) => {
  const handleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast("Sign-in failed", { description: String(result.error.message ?? result.error) });
      return;
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast("Signed out");
  };

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="chunky-btn bg-sunshine text-forest px-4 h-12 flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" strokeWidth={2.5} />
        <span className="text-sm">Sign in with Google</span>
      </button>
    );
  }

  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="chunky-card bg-cream px-3 py-2 flex items-center gap-2">
      {avatar ? (
        <img src={avatar} alt={name} className="h-8 w-8 rounded-full border-2 border-forest" />
      ) : (
        <div className="h-8 w-8 rounded-full border-2 border-forest bg-kiwi flex items-center justify-center text-forest font-bold">
          {String(name ?? "🥑")[0]?.toUpperCase()}
        </div>
      )}
      <span className="text-sm font-bold text-forest max-w-[140px] truncate">{name}</span>
      <button
        onClick={handleSignOut}
        aria-label="Sign out"
        title="Sign out"
        className="chunky-btn bg-cream h-8 w-8 flex items-center justify-center"
      >
        <LogOut className="h-4 w-4 text-forest" strokeWidth={2.5} />
      </button>
    </div>
  );
};
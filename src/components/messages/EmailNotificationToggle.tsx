import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export const EmailNotificationToggle = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("email_new_message_notifications")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setEnabled(data?.email_new_message_notifications ?? true);
      });
  }, [user]);

  const onToggle = async (value: boolean) => {
    if (!user) return;
    setSaving(true);
    const prev = enabled;
    setEnabled(value);
    const { error } = await supabase
      .from("profiles")
      .update({ email_new_message_notifications: value })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      setEnabled(prev);
      toast.error(language === "it" ? "Impossibile aggiornare la preferenza" : "Could not update preference");
    } else {
      toast.success(
        value
          ? language === "it"
            ? "Notifiche email attivate"
            : "Email notifications enabled"
          : language === "it"
            ? "Notifiche email disattivate"
            : "Email notifications disabled"
      );
    }
  };

  if (enabled === null) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Mail className="h-4 w-4 text-muted-foreground" />
      <Label htmlFor="email-msg-notif" className="cursor-pointer">
        {language === "it" ? "Notifiche email nuovi messaggi" : "Email me new messages"}
      </Label>
      <Switch
        id="email-msg-notif"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={saving}
      />
    </div>
  );
};

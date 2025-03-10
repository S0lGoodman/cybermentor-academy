import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface StudentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentCreateModal({ isOpen, onClose, onSuccess }: StudentCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send invite email which will create the user if they don't exist
      const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(formData.email);

      if (inviteError) throw inviteError;

      // Get the user data after invitation
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers({
        filter: {
          email: formData.email
        }
      });

      if (userError) throw userError;

      const user = userData.users[0];
      if (user) {
        // Update user metadata
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          user_metadata: {
            name: formData.name,
            is_new_user: true
          }
        });

        // Create or update the profile using admin client
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({ 
            id: user.id,
            name: formData.name,
            role: 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            email: formData.email
          });

        if (profileError) throw profileError;
      }

      toast({
        title: "Success",
        description: "Student invited successfully. They will receive an email with instructions to set up their account.",
      });

      onSuccess();
      onClose();
      setFormData({ email: "", name: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to invite student",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john@example.com"
              required
            />
          </div>
          <p className="text-sm text-muted-foreground">
            An email will be sent to the student with instructions to set up their account.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending Invite..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from 'uuid';

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
      // DIRECT APPROACH: Create a profile record directly
      // Generate a UUID for the student
      const studentId = uuidv4();
      console.log('Creating profile with ID:', studentId);

      // First, create a student record with all fields
      const { error: studentError } = await supabaseAdmin
        .from('students')
        .insert({
          id: studentId,
          email: formData.email,
          name: formData.name,
          status: 'invited',
          role: 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          program_start_date: new Date().toISOString(),
          progress: 0,
          enrolled_courses: 0,
          months_paid: 0
          // No payment-related fields
        });

      if (studentError) {
        console.error('Student creation error:', studentError);
        throw studentError;
      }

      console.log('Student created successfully');

      // Then, create a profile record for admin dashboard compatibility
      try {
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: studentId,
            email: formData.email,
            name: formData.name,
            role: 'student',
            status: 'invited',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue anyway - the student was created
        } else {
          console.log('Profile created successfully');
        }
      } catch (profileError) {
        console.error('Profile creation exception:', profileError);
        // Continue anyway - the student was created
      }

      // This block is now redundant - we already checked for studentError above
      // Removing it to avoid duplicate code

      // Send an invite email using a more robust approach
      try {
        console.log('Sending invite email to:', formData.email);

        // First try the admin invite method
        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(formData.email, {
          data: {
            name: formData.name,
            role: 'student'
          }
        });

        if (inviteError) {
          console.error('Admin invite error:', inviteError);

          // If admin invite fails, try creating the user directly
          console.log('Trying alternative approach: creating user directly');
          const { error: createUserError } = await supabaseAdmin.auth.admin.createUser({
            email: formData.email,
            email_confirm: true,
            user_metadata: {
              name: formData.name,
              role: 'student'
            },
            password: Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2) + '!1'
          });

          if (createUserError) {
            console.error('Create user error:', createUserError);
            throw createUserError;
          }

          // Then send a password reset email
          const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: formData.email
          });

          if (resetError) {
            console.error('Password reset error:', resetError);
            throw resetError;
          }

          console.log('User created and password reset email sent');
        } else {
          console.log('Invite sent successfully');
        }

        // Update the student status to 'invited'
        const { error: updateError } = await supabaseAdmin
          .from('students')
          .update({ status: 'invited' })
          .eq('id', studentId);

        if (updateError) {
          console.error('Status update error:', updateError);
          // Continue anyway - the invite was sent
        }
      } catch (inviteError: any) {
        console.error('Invitation process error:', inviteError);

        // Show a warning but don't fail the operation
        toast({
          title: "Warning",
          description: `Student was created but invitation email could not be sent: ${inviteError.message || 'Unknown error'}`,
          variant: "destructive",
        });
      }

      toast({
        title: "Success",
        description: "Student invited successfully. They will receive an email with instructions to set up their account.",
      });

      onSuccess();
      onClose();
      setFormData({ email: "", name: "" });
    } catch (error: any) {
      console.error('Student creation error:', error);

      // Try to get more detailed error information
      let errorMessage = "Failed to add student";
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.details) {
        errorMessage += " - " + error.details;
      }
      if (error.hint) {
        errorMessage += " (Hint: " + error.hint + ")";
      }

      toast({
        title: "Error",
        description: errorMessage,
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
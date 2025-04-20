import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface StudentCreateModalBasicProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentCreateModalBasic({ isOpen, onClose, onSuccess }: StudentCreateModalBasicProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form data
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error("Please fill in all required fields");
      }

      // Generate a simple password
      const password = `${formData.firstName.toLowerCase()}123!`;

      console.log("Creating user with:", {
        email: formData.email,
        password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber
      });

      // Step 1: Check if user already exists
      const { data: existingUsers } = await supabaseAdmin
        .from('students')
        .select('email')
        .eq('email', formData.email);

      if (existingUsers && existingUsers.length > 0) {
        throw new Error(`A student with email ${formData.email} already exists`);
      }

      // Step 2: Create the user in auth system
      const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password: password,
        email_confirm: true
      });

      if (createUserError) {
        console.error('Create user error:', createUserError);

        // Special handling for common errors
        if (createUserError.message.includes('duplicate key')) {
          throw new Error(`A user with email ${formData.email} already exists in the authentication system`);
        }

        throw new Error(`Auth error: ${createUserError.message}`);
      }

      if (!userData || !userData.user) {
        throw new Error('User created but no user data returned');
      }

      const userId = userData.user.id;
      console.log("User created with ID:", userId);

      // Step 3: Create a minimal student record
      try {
        // First try with all fields
        const studentData = {
          id: userId,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber || null,
          status: 'active',
          role: 'student'
        };

        console.log("Creating student with data:", studentData);

        const { error: studentError } = await supabaseAdmin
          .from('students')
          .insert(studentData);

        if (studentError) {
          console.error('First attempt student creation error:', studentError);

          // Try with absolute minimal fields
          console.log("Trying with minimal fields...");
          const minimalData = {
            id: userId,
            email: formData.email,
            status: 'active',
            role: 'student'
          };

          const { error: minimalError } = await supabaseAdmin
            .from('students')
            .insert(minimalData);

          if (minimalError) {
            console.error('Minimal student creation error:', minimalError);
            throw new Error(`Database error: ${minimalError.message}`);
          } else {
            console.log("Created student with minimal fields, now updating with full data");

            // Now try to update with the rest of the fields
            const { error: updateError } = await supabaseAdmin
              .from('students')
              .update({
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone_number: formData.phoneNumber || null
              })
              .eq('id', userId);

            if (updateError) {
              console.error('Update error after minimal creation:', updateError);
              // Continue anyway since the basic record was created
            }
          }
        }
      } catch (studentError: any) {
        console.error('Student creation error:', studentError);

        // Try to delete the auth user since we couldn't create the student record
        try {
          await supabaseAdmin.auth.admin.deleteUser(userId);
          console.log('Deleted auth user after student record creation failed');
        } catch (deleteError) {
          console.error('Failed to delete auth user:', deleteError);
        }

        throw new Error(`Database error: ${studentError.message}`);
      }

      console.log("Student created successfully");

      // Success!
      toast({
        title: "Success",
        description: `Student created successfully with email: ${formData.email} and password: ${password}`,
      });

      onSuccess();
      onClose();
      setFormData({ email: "", firstName: "", lastName: "", phoneNumber: "" });
    } catch (error: any) {
      console.error('Student creation error:', error);
      setError(error.message || "Failed to create student");

      toast({
        title: "Error",
        description: error.message || "Failed to create student",
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
          <DialogTitle>Add New Student (Basic)</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="student@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="John"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="0612345678"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Password will be automatically generated as [firstname]123!
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
              {isLoading ? "Creating..." : "Create Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

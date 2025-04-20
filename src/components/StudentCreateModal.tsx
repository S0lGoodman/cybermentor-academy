import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from "./ui/card";
import { Copy } from "lucide-react";

interface StudentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentCreateModal({ isOpen, onClose, onSuccess }: StudentCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });
  const [generatedCredentials, setGeneratedCredentials] = useState({
    email: "",
    password: "",
    fullName: "",
    whatsappUrl: ""
  });
  const [showCredentials, setShowCredentials] = useState(false);
  const { toast } = useToast();

  // Generate email in the format [initial of firstname].[complete last name]@cybermentor.ma
  const generateEmail = (firstName: string, lastName: string): string => {
    if (!firstName || !lastName) return "";

    const initial = firstName.trim().charAt(0).toLowerCase();
    const lastNameFormatted = lastName.trim().toLowerCase();
    return `${initial}.${lastNameFormatted}@cybermentor.ma`;
  };

  // Generate WhatsApp URL from phone number
  const generateWhatsappUrl = (phoneNumber: string): string => {
    if (!phoneNumber) return "";

    // Remove any non-digit characters
    let phone = phoneNumber.replace(/\D/g, '');

    // If phone starts with 0, replace it with 212
    if (phone.startsWith('0')) {
      phone = '212' + phone.substring(1);
    }

    // If phone doesn't start with 212, add it
    if (!phone.startsWith('212')) {
      phone = '212' + phone;
    }

    return `https://wa.me/${phone}`;
  };

  // Generate a random password
  const generatePassword = (): string => {
    // Generate a password with at least 8 characters, including uppercase, lowercase, numbers, and a special character
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const specialChars = "!@#$%^&*";

    let password = "";
    // Add at least one uppercase, one lowercase, one number
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password characters
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  };

  // Update generated credentials when form data changes
  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const email = generateEmail(formData.firstName, formData.lastName);
      const password = generatePassword();
      const whatsappUrl = generateWhatsappUrl(formData.phoneNumber);

      setGeneratedCredentials({
        email,
        password,
        fullName,
        whatsappUrl
      });
    }
  }, [formData.firstName, formData.lastName, formData.phoneNumber]);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  // Function to copy all credentials at once
  const copyAllCredentials = () => {
    const credentialsText = `
    Student: ${generatedCredentials.fullName}
    Email: ${generatedCredentials.email}
    Password: ${generatedCredentials.password}
    WhatsApp: ${generatedCredentials.whatsappUrl}
    `;

    navigator.clipboard.writeText(credentialsText.trim());
    toast({
      title: "All credentials copied",
      description: "All credentials have been copied to your clipboard.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.firstName) {
      toast({
        title: "Error",
        description: "Please enter a first name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.lastName) {
      toast({
        title: "Error",
        description: "Please enter a last name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number.",
        variant: "destructive",
      });
      return;
    }

    // Show credentials before creating the account
    setShowCredentials(true);
  };

  // Check if a user with the given email already exists
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      // Check in auth users
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      if (users && users.users) {
        const existingUser = users.users.find(user => user.email === email);
        if (existingUser) {
          console.log('User already exists in auth system:', existingUser.id);
          return true;
        }
      }

      // Check in students table
      const { data: students, error: studentsError } = await supabaseAdmin
        .from('students')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (studentsError) {
        console.error('Error checking students table:', studentsError);
      } else if (students && students.length > 0) {
        console.log('User already exists in students table:', students[0].id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking if email exists:', error);
      return false; // Assume it doesn't exist if we can't check
    }
  };

  const createStudent = async () => {
    setIsLoading(true);

    try {
      console.log('Creating student with credentials:', {
        email: generatedCredentials.email,
        fullName: generatedCredentials.fullName
      });

      // Check if the email already exists
      const emailExists = await checkEmailExists(generatedCredentials.email);
      if (emailExists) {
        throw new Error(`A user with the email ${generatedCredentials.email} already exists.`);
      }

      // First, create the user in auth system with the generated credentials
      const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: generatedCredentials.email,
        password: generatedCredentials.password,
        email_confirm: true,
        user_metadata: {
          name: generatedCredentials.fullName,
          role: 'student'
        }
      });

      if (createUserError) {
        console.error('Create user error:', createUserError);
        throw createUserError;
      }

      if (!userData || !userData.user) {
        console.error('User created but no user data returned');
        throw new Error('User created but no user data returned');
      }

      console.log('User created successfully with ID:', userData.user.id);

      // Use the user ID from the created auth user
      const userId = userData.user.id;

      // Create a student record with all fields
      try {
        // Log the student data we're about to insert for debugging
        const studentData = {
          id: userId,
          email: generatedCredentials.email,
          // Remove name field since it's been replaced with first_name and last_name
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          whatsapp_url: generatedCredentials.whatsappUrl,
          status: 'active', // Set as active since we're creating with credentials
          role: 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          program_start_date: new Date().toISOString(),
          progress: 0,
          enrolled_courses: 0,
          months_paid: 0
        };

        console.log('Inserting student with data:', studentData);

        const { error: studentError } = await supabaseAdmin
          .from('students')
          .insert(studentData);

        if (studentError) {
          console.error('Student creation error:', studentError);
          console.error('Error details:', JSON.stringify(studentError, null, 2));

          // Check for specific error types
          if (studentError.code === '23502') {
            console.error('NOT NULL constraint violation. A required field is missing.');
          } else if (studentError.code === '23505') {
            console.error('Unique constraint violation. A record with this ID or email already exists.');
          } else if (studentError.code === '42P01') {
            console.error('Table does not exist. Check if the students table is properly created.');
          } else if (studentError.code === '42703') {
            console.error('Column does not exist. Check if all columns in the insert exist in the table.');
          }

          throw studentError;
        }

        console.log('Student record created successfully');
      } catch (studentError) {
        console.error('Student record creation failed:', studentError);

        // Try with minimal fields as a fallback
        console.log('Attempting fallback with minimal fields...');
        try {
          const minimalStudentData = {
            id: userId,
            email: generatedCredentials.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'student',
            status: 'active'
          };

          console.log('Inserting student with minimal data:', minimalStudentData);

          const { error: fallbackError } = await supabaseAdmin
            .from('students')
            .insert(minimalStudentData);

          if (fallbackError) {
            console.error('Fallback student creation also failed:', fallbackError);
            // Now try to delete the auth user since we couldn't create the student record
            try {
              await supabaseAdmin.auth.admin.deleteUser(userId);
              console.log('Deleted auth user after student record creation failed');
            } catch (deleteError) {
              console.error('Failed to delete auth user after student record creation failed:', deleteError);
            }
            throw new Error('Failed to create student record in database');
          } else {
            console.log('Student created with minimal fields successfully');
            // Continue with the rest of the process
          }
        } catch (fallbackError) {
          console.error('Fallback attempt failed:', fallbackError);
          // Try to delete the auth user since we couldn't create the student record
          try {
            await supabaseAdmin.auth.admin.deleteUser(userId);
            console.log('Deleted auth user after student record creation failed');
          } catch (deleteError) {
            console.error('Failed to delete auth user after student record creation failed:', deleteError);
          }
          throw new Error('Failed to create student record in database');
        }
      }

      // Create a profile record for admin dashboard compatibility
      try {
        // Create profile data object for insertion
        const profileData = {
          id: userId,
          email: generatedCredentials.email,
          // Use first_name and last_name if the profiles table has been updated
          // Otherwise, keep the name field for backward compatibility
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'student',
          status: 'active', // Set as active since we're creating with credentials
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('Inserting profile with data:', profileData);

        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          console.error('Profile error details:', JSON.stringify(profileError, null, 2));

          // Try with minimal fields as a fallback
          console.log('Attempting profile creation with minimal fields...');
          try {
            const minimalProfileData = {
              id: userId,
              email: generatedCredentials.email,
              role: 'student',
              status: 'active'
            };

            const { error: fallbackProfileError } = await supabaseAdmin
              .from('profiles')
              .insert(minimalProfileData);

            if (fallbackProfileError) {
              console.error('Fallback profile creation also failed:', fallbackProfileError);
              // Continue anyway - the student was created
            } else {
              console.log('Profile created with minimal fields successfully');
            }
          } catch (fallbackProfileError) {
            console.error('Fallback profile attempt failed:', fallbackProfileError);
            // Continue anyway - the student was created
          }
        } else {
          console.log('Profile created successfully');
        }
      } catch (profileError) {
        console.error('Profile creation exception:', profileError);
        // Continue anyway - the student was created
      }

      toast({
        title: "Success",
        description: "Student account created successfully. Share the credentials with the student via WhatsApp.",
      });

      onSuccess();
      // Don't close the modal yet, let the admin copy the credentials
    } catch (error: any) {
      console.error('Student creation error:', error);

      // Try to get more detailed error information
      let errorMessage = "Failed to add student";

      // Handle specific error cases
      if (error.code === "23505") {
        errorMessage = "A user with this email already exists.";
      } else if (error.code === "23503") {
        errorMessage = "Database constraint violation. Please check the data.";
      } else if (error.code === "42P01") {
        errorMessage = "Table does not exist. Database setup may be incomplete.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Add additional details if available
      if (error.details) {
        errorMessage += " - " + error.details;
      }
      if (error.hint) {
        errorMessage += " (Hint: " + error.hint + ")";
      }

      // Log the full error for debugging
      console.log('Detailed error:', JSON.stringify(error, null, 2));

      toast({
        title: "Error Creating Student",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: ""
    });
    setGeneratedCredentials({
      email: "",
      password: "",
      fullName: "",
      whatsappUrl: ""
    });
    setShowCredentials(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      resetForm();
      onClose();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{showCredentials ? "Student Credentials" : "Add New Student"}</DialogTitle>
        </DialogHeader>

        {!showCredentials ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
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
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              A student account will be created with auto-generated credentials that you can share via WhatsApp.
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Generate Credentials
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Button
                  variant="outline"
                  className="w-full mb-2 flex items-center justify-center gap-2"
                  onClick={copyAllCredentials}
                >
                  <Copy className="h-4 w-4" /> Copy All Credentials
                </Button>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{generatedCredentials.fullName}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(generatedCredentials.fullName)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{generatedCredentials.email}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(generatedCredentials.email)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Password</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{generatedCredentials.password}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(generatedCredentials.password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">WhatsApp Link</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{generatedCredentials.whatsappUrl}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(generatedCredentials.whatsappUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground">
              Copy these credentials and share them with the student via WhatsApp. The student will use these to log in.
            </p>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCredentials(false)}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button
                onClick={createStudent}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
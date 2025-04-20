import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface StudentCreateDirectSQLProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentCreateDirectSQL({ isOpen, onClose, onSuccess }: StudentCreateDirectSQLProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${message}`]);
    console.log(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setLogs([]);

    try {
      // Validate form data
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error("Please fill in all required fields");
      }

      // Generate a simple password
      const password = `${formData.firstName.toLowerCase()}123!`;

      addLog(`Creating user with email: ${formData.email}`);

      // Step 1: Create the user in auth system
      const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password: password,
        email_confirm: true
      });

      if (createUserError) {
        addLog(`Auth error: ${createUserError.message}`);
        throw new Error(`Auth error: ${createUserError.message}`);
      }

      if (!userData || !userData.user) {
        throw new Error('User created but no user data returned');
      }

      const userId = userData.user.id;
      addLog(`User created with ID: ${userId}`);

      // Step 2: Create a student record using direct SQL
      addLog("Attempting to create student record using direct SQL...");

      // Format phone number for WhatsApp URL
      let whatsappUrl = null;
      if (formData.phoneNumber) {
        let phone = formData.phoneNumber.replace(/\\D/g, '');
        if (phone.startsWith('0')) {
          phone = '212' + phone.substring(1);
        } else if (!phone.startsWith('212')) {
          phone = '212' + phone;
        }
        whatsappUrl = `https://wa.me/${phone}`;
      }

      // Current timestamp
      const now = new Date().toISOString();

      // SQL query to insert student
      const sqlQuery = `
        INSERT INTO students (
          id,
          email,
          first_name,
          last_name,
          phone_number,
          whatsapp_url,
          status,
          role,
          created_at,
          updated_at
        ) VALUES (
          '${userId}',
          '${formData.email}',
          '${formData.firstName}',
          '${formData.lastName}',
          ${formData.phoneNumber ? `'${formData.phoneNumber}'` : 'NULL'},
          ${whatsappUrl ? `'${whatsappUrl}'` : 'NULL'},
          'active',
          'student',
          '${now}',
          '${now}'
        )
      `;

      addLog("Executing SQL query...");
      addLog(sqlQuery);

      try {
        // First try using the exec_sql RPC function
        const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', { query: sqlQuery });

        if (sqlError) {
          addLog(`SQL RPC error: ${sqlError.message}`);
          addLog("Falling back to direct insert...");

          // Fallback to direct insert
          const { error: insertError } = await supabaseAdmin
            .from('students')
            .insert({
              id: userId,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone_number: formData.phoneNumber || null,
              whatsapp_url: whatsappUrl,
              status: 'active',
              role: 'student',
              created_at: now,
              updated_at: now
            });

          if (insertError) {
            addLog(`Insert error: ${insertError.message}`);

            // Try with minimal fields
            addLog("Trying with minimal fields...");
            const { error: minimalError } = await supabaseAdmin
              .from('students')
              .insert({
                id: userId,
                email: formData.email,
                status: 'active',
                role: 'student'
              });

            if (minimalError) {
              addLog(`Minimal insert error: ${minimalError.message}`);
              throw minimalError;
            } else {
              addLog("Created with minimal fields, now updating...");
              // Update with remaining fields
              const { error: updateError } = await supabaseAdmin
                .from('students')
                .update({
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  phone_number: formData.phoneNumber || null
                })
                .eq('id', userId);

              if (updateError) {
                addLog(`Update error: ${updateError.message}`);
                // Continue anyway since the basic record was created
              }
            }
          }
        }
      } catch (error: any) {
        addLog(`Database error: ${error.message}`);

        // Try to delete the auth user since we couldn't create the student record
        try {
          await supabaseAdmin.auth.admin.deleteUser(userId);
          addLog('Deleted auth user after student record creation failed');
        } catch (deleteError: any) {
          addLog(`Failed to delete auth user: ${deleteError.message}`);
        }

        throw new Error(`Database error: ${error.message}`);
      }

      addLog("Student created successfully!");

      // Success!
      toast({
        title: "Success",
        description: `Student created successfully with email: ${formData.email} and password: ${password}`,
      });

      onSuccess();
      onClose();
      setFormData({ email: "", firstName: "", lastName: "", phoneNumber: "" });
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student (Direct SQL)</DialogTitle>
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

          {logs.length > 0 && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono h-40 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
            </div>
          )}

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

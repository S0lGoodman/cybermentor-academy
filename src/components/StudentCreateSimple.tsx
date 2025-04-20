import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { Card, CardContent } from "./ui/card";
import { Copy } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client with service role key
// This is not ideal for client-side code, but we're desperate at this point
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface StudentCreateSimpleProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentCreateSimple({ isOpen, onClose, onSuccess }: StudentCreateSimpleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [createdUser, setCreatedUser] = useState<{
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${message}`]);
    console.log(message);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: ""
    });
    setError("");
    setLogs([]);
    setCreatedUser(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setLogs([]);
    setCreatedUser(null);

    try {
      // Validate form data
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error("Please fill in all required fields");
      }

      addLog(`Creating student with email: ${formData.email}`);
      
      // Generate a UUID for the user
      const userId = uuidv4();
      addLog(`Generated user ID: ${userId}`);
      
      // Generate a simple password
      const password = `${formData.firstName.toLowerCase()}123!`;
      
      // Format phone number for WhatsApp URL
      let whatsappUrl = null;
      if (formData.phoneNumber) {
        let phone = formData.phoneNumber.replace(/\D/g, '');
        if (phone.startsWith('0')) {
          phone = '212' + phone.substring(1);
        } else if (!phone.startsWith('212')) {
          phone = '212' + phone;
        }
        whatsappUrl = `https://wa.me/${phone}`;
      }
      
      // Current timestamp
      const now = new Date().toISOString();
      
      // Sign up the user using Supabase Auth
      addLog("Creating auth user...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });
      
      if (authError) {
        addLog(`Auth error: ${authError.message}`);
        throw new Error(`Failed to create auth user: ${authError.message}`);
      }
      
      if (!authData.user) {
        addLog("No user data returned from auth signup");
        throw new Error("Failed to create auth user: No user data returned");
      }
      
      const newUserId = authData.user.id;
      addLog(`Auth user created with ID: ${newUserId}`);
      
      // Insert into students table
      addLog("Inserting into students table...");
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          id: newUserId,
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
        
      if (studentError) {
        addLog(`Error inserting into students table: ${studentError.message}`);
        throw new Error(`Failed to create student record: ${studentError.message}`);
      }
      
      addLog("Student record created successfully!");
      
      // Store the created user info
      setCreatedUser({
        id: newUserId,
        email: formData.email,
        password: password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      toast({
        title: "Success",
        description: "Student created successfully!",
      });
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

  const handleClose = () => {
    if (createdUser) {
      onSuccess();
    }
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Student (Simple Method)</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {!createdUser ? (
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
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Student"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-green-600 font-medium">
              Student created successfully! Here are the login credentials:
            </p>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">User ID</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{createdUser.id}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => copyToClipboard(createdUser.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{createdUser.email}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => copyToClipboard(createdUser.email)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Password</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{createdUser.password}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => copyToClipboard(createdUser.password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{createdUser.firstName} {createdUser.lastName}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => copyToClipboard(`${createdUser.firstName} ${createdUser.lastName}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <DialogFooter>
              <Button onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

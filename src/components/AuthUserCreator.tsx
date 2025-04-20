import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Card, CardContent } from "./ui/card";
import { Copy } from "lucide-react";

interface AuthUserCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthUserCreator({ isOpen, onClose, onSuccess }: AuthUserCreatorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [createdUser, setCreatedUser] = useState<{
    id: string;
    email: string;
    password: string;
  } | null>(null);
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${message}`]);
    console.log(message);
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

      // Generate a simple password
      const password = `${formData.firstName.toLowerCase()}123!`;
      
      addLog(`Creating auth user with email: ${formData.email}`);

      // Create the user in auth system only
      const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password: password,
        email_confirm: true,
        user_metadata: {
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      });

      if (createUserError) {
        addLog(`Auth error: ${createUserError.message}`);
        throw new Error(`Auth error: ${createUserError.message}`);
      }
      
      if (!userData || !userData.user) {
        throw new Error('User created but no user data returned');
      }
      
      const userId = userData.user.id;
      addLog(`Auth user created successfully with ID: ${userId}`);
      
      // Store the created user info
      setCreatedUser({
        id: userId,
        email: formData.email,
        password: password
      });
      
      toast({
        title: "Auth User Created",
        description: "Auth user created successfully. Please copy the credentials and then manually add the student record.",
      });
      
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      setError(error.message || "Failed to create auth user");
      
      toast({
        title: "Error",
        description: error.message || "Failed to create auth user",
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
    setFormData({ email: "", firstName: "", lastName: "" });
    setCreatedUser(null);
    setLogs([]);
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Auth User Only</DialogTitle>
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
                {isLoading ? "Creating..." : "Create Auth User"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-green-600 font-medium">
              Auth user created successfully! Please copy these credentials and then manually add the student record.
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
                  <Label className="text-xs text-muted-foreground">SQL Insert Statement</Label>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs bg-gray-100 p-2 rounded w-full overflow-x-auto">
                      {`INSERT INTO students (id, email, first_name, last_name, status, role) 
VALUES ('${createdUser.id}', '${createdUser.email}', '${formData.firstName}', '${formData.lastName}', 'active', 'student');`}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 ml-2 flex-shrink-0" 
                      onClick={() => copyToClipboard(`INSERT INTO students (id, email, first_name, last_name, status, role) 
VALUES ('${createdUser.id}', '${createdUser.email}', '${formData.firstName}', '${formData.lastName}', 'active', 'student');`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-sm text-muted-foreground">
              After copying the credentials, you can close this dialog and then manually add the student record using the SQL statement.
            </p>
            
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

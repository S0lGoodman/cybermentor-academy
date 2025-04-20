import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { Card, CardContent } from "./ui/card";
import { Copy } from "lucide-react";
// Import the client-side student service
import { createStudent } from "@/lib/student-service-client";

interface StudentCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentCreate({ isOpen, onClose, onSuccess }: StudentCreateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    phoneNumber: string;
    whatsappUrl: string;
    authSuccess?: boolean;
  } | null>(null);
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${message}`]);
    console.log(message);
  };

  const resetForm = () => {
    setFormData({
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

  // Email and WhatsApp formatting is now handled by the API

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setLogs([]);
    setCreatedUser(null);

    try {
      // Validate form data
      if (!formData.firstName || !formData.lastName) {
        throw new Error("Please fill in all required fields");
      }

      addLog("Creating student directly using service...");

      // Use the student service directly
      const result = await createStudent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || undefined
      });

      if (!result.success || !result.student) {
        addLog(`Student creation error: ${result.error}`);
        throw new Error(result.error || "Failed to create student");
      }

      addLog("Student created successfully!");

      // Store the created user info
      setCreatedUser({
        id: result.student.id,
        email: result.student.email,
        password: result.student.password,
        firstName: result.student.firstName,
        lastName: result.student.lastName,
        phoneNumber: result.student.phoneNumber || "",
        whatsappUrl: result.student.whatsappUrl || "",
        authSuccess: true
      });

      toast({
        title: "Success",
        description: "Student created successfully with login credentials!",
        variant: "default"
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
          <DialogTitle>Add Student</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!createdUser ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
              <p><strong>Email</strong> will be automatically generated as: <span className="font-mono">[first initial].[last name]@cybermentor.ma</span></p>
              <p><strong>Password</strong> will be automatically generated as: <span className="font-mono">[firstname]123!</span></p>
            </div>

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
            {createdUser.authSuccess ? (
              <p className="text-sm text-green-600 font-medium">
                Student created successfully! Here are the login credentials:
              </p>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-4">
                <p className="font-medium">Warning: Auth User Creation Failed</p>
                <p className="text-sm mt-1">The student record was created in the database, but the authentication user could not be created. The login credentials below may not work until this is fixed.</p>
              </div>
            )}

            <Card>
              <CardContent className="pt-6 space-y-4">
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

                {createdUser.phoneNumber && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Phone Number</Label>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{createdUser.phoneNumber}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(createdUser.phoneNumber)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {createdUser.whatsappUrl && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">WhatsApp Link</Label>
                    <div className="flex items-center justify-between">
                      <a
                        href={createdUser.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Open in WhatsApp
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(createdUser.whatsappUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
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

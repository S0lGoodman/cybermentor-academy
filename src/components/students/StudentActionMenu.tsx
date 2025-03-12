import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Ban, Play, RefreshCw, Mail, Eye, AlertTriangle } from "lucide-react";
import { Student } from "@/types/student";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StudentActionMenuProps {
  student: Student;
  onAction: (action: string, metadata?: any) => Promise<void>;
}

export function StudentActionMenu({ student, onAction }: StudentActionMenuProps) {
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const handleSuspend = async () => {
    await onAction("suspend", {
      reason: suspensionReason
    });
    setShowSuspendDialog(false);
    setSuspensionReason("");
  };

  const handleSendEmail = async () => {
    await onAction("send_email", {
      subject: emailSubject,
      body: emailBody
    });
    setShowEmailDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {student.status === 'active' ? (
            <DropdownMenuItem onClick={() => setShowSuspendDialog(true)}>
              <Ban className="mr-2 h-4 w-4" />
              Suspend Account
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onAction("activate")}>
              <Play className="mr-2 h-4 w-4" />
              Activate Account
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => onAction("reset_password")}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Password
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onAction("view_profile")}>
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => onAction("delete")}
            className="text-red-600"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Suspend Account Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Account</DialogTitle>
            <DialogDescription>
              This will temporarily prevent the student from accessing the platform.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Suspension Reason</Label>
              <Textarea
                id="reason"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Enter the reason for suspension..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send a custom email to the student.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Type your message here..."
                className="h-32"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 
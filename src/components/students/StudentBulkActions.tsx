import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Ban, Play, Mail, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BulkAction } from "@/types/student";

interface StudentBulkActionsProps {
  selectedCount: number;
  onAction: (action: BulkAction) => Promise<void>;
  disabled?: boolean;
}

export function StudentBulkActions({ selectedCount, onAction, disabled }: StudentBulkActionsProps) {
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">
          {selectedCount} student{selectedCount !== 1 ? 's' : ''} selected
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={disabled}>
              Bulk Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowSuspendDialog(true)}>
              <Ban className="mr-2 h-4 w-4" />
              Suspend Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction({ type: 'activate', studentIds: [] })}>
              <Play className="mr-2 h-4 w-4" />
              Activate Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
              <Mail className="mr-2 h-4 w-4" />
              Email Selected
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Multiple Students</DialogTitle>
            <DialogDescription>
              This will suspend access for {selectedCount} selected students.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bulkReason">Suspension Reason</Label>
              <Textarea
                id="bulkReason"
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
            <Button 
              variant="destructive" 
              onClick={() => {
                onAction({
                  type: 'suspend',
                  studentIds: [],
                  metadata: {
                    reason: suspensionReason
                  }
                });
                setShowSuspendDialog(false);
                setSuspensionReason("");
              }}
            >
              Suspend Students
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Email Multiple Students</DialogTitle>
            <DialogDescription>
              Send an email to {selectedCount} selected students.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bulkSubject">Subject</Label>
              <Input
                id="bulkSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bulkBody">Message</Label>
              <Textarea
                id="bulkBody"
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
            <Button 
              onClick={() => {
                onAction({
                  type: 'send_email',
                  studentIds: [],
                  metadata: {
                    subject: emailSubject,
                    message: emailBody
                  }
                });
                setShowEmailDialog(false);
              }}
            >
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Multiple Students</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} students? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                onAction({
                  type: 'delete',
                  studentIds: []
                });
                setShowDeleteDialog(false);
              }}
            >
              Delete Students
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 
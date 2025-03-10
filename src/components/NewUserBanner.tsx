import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface NewUserBannerProps {
  userRole: 'student' | 'admin' | 'instructor';
}

export function NewUserBanner({ userRole }: NewUserBannerProps) {
  return (
    <Alert variant="warning" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          Welcome! Please change your temporary password to secure your account.
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/${userRole}/settings`}>
            Go to Settings
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
} 
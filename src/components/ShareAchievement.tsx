import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Achievement {
  title: string;
  description: string;
  icon: React.ElementType;
  date: string;
  points: number;
}

interface ShareAchievementProps {
  achievement: Achievement;
}

export function ShareAchievement({ achievement }: ShareAchievementProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const Icon = achievement.icon;

  const shareUrl = `${window.location.origin}/achievements/${encodeURIComponent(achievement.title)}`;
  const shareText = `لقد حصلت على شارة "${achievement.title}" في أكاديمية الأمن السيبراني! 🎉`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ الرابط إلى الحافظة",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-[#00C896]/10">
          <Share2 className="w-4 h-4 text-[#00C896]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>مشاركة الإنجاز</DialogTitle>
          <DialogDescription>
            شارك إنجازك مع أصدقائك وزملائك!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="p-2 rounded-full bg-[#00C896]/10">
              <Icon className="w-6 h-6 text-[#00C896]" />
            </div>
            <div>
              <h4 className="font-medium">{achievement.title}</h4>
              <p className="text-sm text-muted-foreground">{achievement.points} نقطة</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open(twitterUrl, "_blank")}
            >
              <Twitter className="w-4 h-4" />
              مشاركة على تويتر
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open(facebookUrl, "_blank")}
            >
              <Facebook className="w-4 h-4" />
              مشاركة على فيسبوك
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open(linkedinUrl, "_blank")}
            >
              <Linkedin className="w-4 h-4" />
              مشاركة على لينكد إن
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#00C896]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              نسخ الرابط
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
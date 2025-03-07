import React from "react";
import { Helmet } from "react-helmet";
import { AdminNavbar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useSidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  KeyRound,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock data - replace with actual data from your backend
const subscriptionData = {
  type: "شهري",
  status: "نشط",
  nextPayment: "2024-04-15",
  amount: 1500,
  paidMonths: ["2024-01", "2024-02", "2024-03"],
  dueMonths: ["2024-04"],
};

export const Settings = () => {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="" />
        <main className="p-6">
          <div className={cn("max-w-4xl mx-auto", !expanded && "mr-16")}>
            <Helmet>
              <title>الإعدادات | أكاديمية الأمن السيبراني</title>
            </Helmet>

            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">الإعدادات</h1>
              <p className="text-muted-foreground">إدارة حسابك ومعلومات الاشتراك</p>
            </div>

            <div className="space-y-6">
              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الحساب</CardTitle>
                  <CardDescription>تحديث معلومات حسابك الشخصية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar Upload Section */}
                  <div className="flex flex-col items-center space-y-4 pb-6">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 border-2 border-[#00C896]/20 transition-all duration-300 group-hover:border-[#00C896]/50 group-hover:shadow-lg group-hover:shadow-[#00C896]/20">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>MA</AvatarFallback>
                      </Avatar>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        تغيير الصورة
                      </label>
                      <input 
                        type="file" 
                        id="avatar-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Here you would typically upload the file to your server
                            // For now, we'll just show a preview
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = document.querySelector('.avatar-preview') as HTMLImageElement;
                              if (img && event.target?.result) {
                                img.src = event.target.result as string;
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      اختر صورة بحجم أقل من 2 ميجابايت
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <div className="flex gap-2">
                      <Input type="email" placeholder="your@email.com" dir="ltr" />
                      <Button variant="secondary">
                        <Mail className="w-4 h-4 ml-2" />
                        تحديث
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>كلمة المرور</Label>
                    <div className="flex gap-2">
                      <Input type="password" placeholder="••••••••" dir="ltr" />
                      <Button variant="secondary">
                        <KeyRound className="w-4 h-4 ml-2" />
                        تغيير
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الاشتراك والدفع</CardTitle>
                  <CardDescription>إدارة اشتراكك ومدفوعاتك</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Subscription Status */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">حالة الاشتراك</h3>
                        <div className="text-sm text-muted-foreground">
                          اشتراك {subscriptionData.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[#00C896]">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">{subscriptionData.status}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>الدفعة القادمة</span>
                        </div>
                        <span dir="ltr">
                          {`${new Date(subscriptionData.nextPayment).getDate().toString().padStart(2, '0')}/${(new Date(subscriptionData.nextPayment).getMonth() + 1).toString().padStart(2, '0')}/${new Date(subscriptionData.nextPayment).getFullYear()}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <span>قيمة الاشتراك الشهري</span>
                        </div>
                        <span dir="ltr">{subscriptionData.amount} درهم</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="space-y-4">
                    <h3 className="font-medium">حالة المدفوعات</h3>
                    
                    {/* Paid Months */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">الأشهر المدفوعة</Label>
                      <div className="flex flex-wrap gap-2">
                        {subscriptionData.paidMonths.map((month) => (
                          <div key={month} className="bg-[#00C896]/10 text-[#00C896] text-sm rounded-full px-3 py-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span dir="ltr">
                              {new Date(month).getFullYear()} {new Date(month).toLocaleDateString('ar', { month: 'long' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Due Months */}
                    {subscriptionData.dueMonths.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">الأشهر المستحقة</Label>
                        <div className="flex flex-wrap gap-2">
                          {subscriptionData.dueMonths.map((month) => (
                            <div key={month} className="bg-yellow-500/10 text-yellow-500 text-sm rounded-full px-3 py-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span dir="ltr">
                                {new Date(month).getFullYear()} {new Date(month).toLocaleDateString('ar', { month: 'long' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button className="w-full sm:w-auto" variant="default">
                    <CreditCard className="w-4 h-4 ml-2" />
                    دفع المستحقات
                  </Button>
                  <Button className="w-full sm:w-auto" variant="outline">
                    <MessageCircle className="w-4 h-4 ml-2" />
                    تواصل مع الدعم
                  </Button>
                  <Button className="w-full sm:w-auto" variant="ghost">
                    <ExternalLink className="w-4 h-4 ml-2" />
                    سجل المدفوعات
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}; 
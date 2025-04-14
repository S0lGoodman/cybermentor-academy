import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { toast } from "../ui/use-toast";

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  due_date: string;
  payment_status: 'paid' | 'due_soon' | 'overdue';
  created_at: string;
}

interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  is_one_time: boolean;
}

interface Student {
  id: string;
  full_name: string | null;
  email: string | null;
  status: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
  payment_plan_id?: string;
  program_start_date?: string;
  last_payment_date?: string;
  months_paid?: number;
  payments?: Payment[];
}

export function PaymentManagement() {
  const [students, setStudents] = useState<(Student & { payment: Payment | null, plan?: PaymentPlan })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchPaymentPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*');

      if (error) {
        console.error('Error fetching payment plans:', error);
        return [];
      }

      setPaymentPlans(data || []);
      return data || [];
    } catch (error) {
      console.error('Error in fetchPaymentPlans:', error);
      return [];
    }
  };

  const fetchStudents = async () => {
    try {
      console.log('Fetching students...');
      setLoading(true);

      // Fetch payment plans first
      const plans = await fetchPaymentPlans();

      // Get all student profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*, payment_plan_id, program_start_date, last_payment_date, months_paid')
        .eq('role', 'student');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Error",
          description: "Failed to fetch student profiles",
          variant: "destructive",
        });
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('No profiles found');
        setStudents([]);
        setLoading(false);
        return;
      }

      // Get all payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .in('user_id', profiles.map(p => p.id));

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
        toast({
          title: "Error",
          description: "Failed to fetch payment information",
          variant: "destructive",
        });
        return;
      }

      // Combine profiles with their latest payment and subscription plan
      const studentsWithPayments = profiles.map(student => {
        const studentPayments = payments?.filter(p => p.user_id === student.id) || [];
        const latestPayment = studentPayments.length > 0
          ? studentPayments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
          : null;

        // Find the student's payment plan
        const plan = plans.find(p => p.id === student.payment_plan_id);

        return {
          ...student,
          payment: latestPayment,
          plan: plan
        };
      });

      setStudents(studentsWithPayments);
    } catch (error) {
      console.error('Error in fetchStudents:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatuses = async () => {
    try {
      // Call the database function to check payment statuses
      const { error } = await supabase.rpc('check_payment_due');

      if (error) {
        console.error('Error calling check_payment_due:', error);
        throw error;
      }

      // Refresh the students list
      fetchStudents();

      toast({
        title: "Success",
        description: "Payment statuses updated successfully",
      });
    } catch (error) {
      console.error('Error updating payment statuses:', error);
      toast({
        title: "Error",
        description: "Failed to update payment statuses",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const processPayment = async (userId: string) => {
    try {
      setLoading(true);

      // Call the simplified function to mark payment as paid
      const { error } = await supabase.rpc('mark_payment_paid', {
        user_id: userId
      });

      if (error) {
        console.error('Error processing payment:', error);
        throw error;
      }

      // Refresh the students list
      await fetchStudents();

      toast({
        title: "Success",
        description: "Payment processed successfully",
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-500';
      case 'due_soon':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'overdue':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const filteredStudents = students.filter(student => {
    // If there's no search query, show all students
    if (!searchQuery.trim()) {
      return true;
    }

    const searchLower = searchQuery.toLowerCase().trim();
    const fullName = (student.full_name || '').toLowerCase();
    const email = (student.email || '').toLowerCase();

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Debug log for filtered results
  console.log('Filtered students count:', filteredStudents.length);
  console.log('First filtered student:', filteredStudents[0]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Payment Management</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Find Student"
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="default"
            onClick={updatePaymentStatuses}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Statuses"}
          </Button>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <div className="bg-card rounded-lg">
        <div className="grid grid-cols-7 gap-4 p-4 border-b border-border text-sm text-muted-foreground">
          <div>Student</div>
          <div>Payment Status</div>
          <div>Due Date</div>
          <div>Amount</div>
          <div>Plan</div>
          <div>Next Payment</div>
          <div>Access Status</div>
        </div>

        <div className="divide-y divide-border">
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No students found
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="grid grid-cols-7 gap-4 p-4 items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(student.full_name || '')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{student.full_name || ''}</div>
                    <div className="text-xs text-muted-foreground">{student.email || ''}</div>
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(student.payment?.payment_status || 'none')}`}>
                    {student.payment?.payment_status ?
                      student.payment.payment_status.replace('_', ' ').charAt(0).toUpperCase() +
                      student.payment.payment_status.slice(1).replace('_', ' ')
                      : 'No Payment'}
                  </span>
                  {student.payment?.payment_status === 'due_soon' || student.payment?.payment_status === 'overdue' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 text-xs w-full"
                      onClick={() => processPayment(student.id)}
                      disabled={loading}
                    >
                      Mark Paid
                    </Button>
                  ) : null}
                </div>
                <div>{student.payment?.due_date ? format(new Date(student.payment.due_date), 'MM/dd/yyyy') : '-'}</div>
                <div>{student.payment?.amount ? `${student.payment.amount} MAD` : student.plan?.price ? `${student.plan.price} MAD` : '-'}</div>
                <div>
                  <span className="text-xs">
                    {student.plan?.name || 'No Plan'}
                  </span>
                </div>
                <div>
                  <span className="text-xs">
                    {student.created_at ?
                      `Joined: ${format(new Date(student.created_at), 'MM/dd/yyyy')}` :
                      '-'}
                  </span>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    student.status === 'suspended' || student.status === 'payment_due' ? 'bg-red-500/10 text-red-500' :
                    student.status === 'active' ? 'bg-green-500/10 text-green-500' :
                    student.status === 'invited' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                    {student.status === 'payment_due' ? 'Payment due' :
                     student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'Unknown'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
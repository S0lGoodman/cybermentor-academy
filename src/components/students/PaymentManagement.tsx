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

interface Student {
  id: string;
  full_name: string | null;
  email: string | null;
  status: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
  payments?: Payment[];
}

export function PaymentManagement() {
  const [students, setStudents] = useState<(Student & { payment: Payment | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      console.log('Fetching students...');
      setLoading(true);
      
      // First, get all student profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
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

      console.log('Fetched profiles:', profiles);
      console.log('Number of profiles:', profiles?.length || 0);
      console.log('Profile fields example:', profiles?.[0] ? Object.keys(profiles[0]) : 'No profiles');

      if (!profiles || profiles.length === 0) {
        console.log('No profiles found');
        setStudents([]);
        setLoading(false);
        return;
      }

      // Then, get all payments
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

      console.log('Fetched payments:', payments);

      // Combine profiles with their latest payment
      const studentsWithPayments = profiles.map(student => {
        const studentPayments = payments?.filter(p => p.user_id === student.id) || [];
        const latestPayment = studentPayments.length > 0 
          ? studentPayments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
          : null;

        return {
          ...student,
          payment: latestPayment
        };
      });

      console.log('Processed students:', studentsWithPayments);
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
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*');

      if (error) throw error;

      for (const payment of payments) {
        const dueDate = new Date(payment.due_date);
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        let newStatus = payment.payment_status;

        if (payment.payment_status !== 'paid') {
          if (now > oneDayAgo && dueDate < oneDayAgo) {
            newStatus = 'overdue';
            // Suspend the user's account
            await supabase
              .from('profiles')
              .update({ status: 'suspended' })
              .eq('id', payment.user_id);
          } else if (now < dueDate && dueDate <= threeDaysFromNow) {
            newStatus = 'due_soon';
          }

          if (newStatus !== payment.payment_status) {
            await supabase
              .from('payments')
              .update({ payment_status: newStatus })
              .eq('id', payment.id);
          }
        }
      }

      // Refresh the students list
      fetchStudents();
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
          <Button variant="default">Export Report</Button>
        </div>
      </div>

      <div className="bg-card rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-border text-sm text-muted-foreground">
          <div>Student</div>
          <div>Payment Status</div>
          <div>Due Date</div>
          <div>Amount</div>
          <div>Access Status</div>
        </div>

        <div className="divide-y divide-border">
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No students found
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="grid grid-cols-5 gap-4 p-4 items-center">
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
                </div>
                <div>{student.payment?.due_date ? format(new Date(student.payment.due_date), 'MM/dd/yyyy') : '-'}</div>
                <div>{student.payment?.amount ? `${student.payment.amount} MAD` : '-'}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    student.status === 'suspended' ? 'bg-red-500/10 text-red-500' :
                    student.status === 'active' ? 'bg-green-500/10 text-green-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                    {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'Unknown'}
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
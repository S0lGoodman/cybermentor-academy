import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "../ui/use-toast";
import { DatePicker } from "../ui/date-picker";

interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  is_one_time: boolean;
}

interface PaymentPlanSelectorProps {
  userId: string;
  onComplete: () => void;
}

export function PaymentPlanSelector({ userId, onComplete }: PaymentPlanSelectorProps) {
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPaymentPlans();
  }, []);

  const fetchPaymentPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*');

      if (error) {
        console.error('Error fetching payment plans:', error);
        return;
      }

      setPaymentPlans(data || []);
      if (data && data.length > 0) {
        setSelectedPlanId(data[0].id);
      }
    } catch (error) {
      console.error('Error in fetchPaymentPlans:', error);
    }
  };

  const initializePaymentPlan = async () => {
    if (!selectedPlanId) {
      toast({
        title: "Error",
        description: "Please select a payment plan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('initialize_student_payment', {
        user_id: userId,
        plan_id: selectedPlanId,
        start_date: startDate?.toISOString()
      });

      if (error) {
        console.error('Error initializing payment plan:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Payment plan initialized successfully",
      });
      
      onComplete();
    } catch (error) {
      console.error('Error in initializePaymentPlan:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedPlan = () => {
    return paymentPlans.find(plan => plan.id === selectedPlanId);
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">Initialize Payment Plan</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Payment Plan</label>
        <Select
          value={selectedPlanId}
          onValueChange={setSelectedPlanId}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a payment plan" />
          </SelectTrigger>
          <SelectContent>
            {paymentPlans.map(plan => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name} - {plan.price} MAD {plan.is_one_time ? '(One-time)' : '(Monthly)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Program Start Date</label>
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          disabled={loading}
        />
      </div>

      {getSelectedPlan() && (
        <div className="text-sm">
          <p><strong>Price:</strong> {getSelectedPlan()?.price} MAD</p>
          <p><strong>Type:</strong> {getSelectedPlan()?.is_one_time ? 'One-time payment' : 'Monthly payment for 6 months'}</p>
          {getSelectedPlan()?.description && (
            <p><strong>Description:</strong> {getSelectedPlan()?.description}</p>
          )}
        </div>
      )}

      <Button 
        onClick={initializePaymentPlan} 
        disabled={loading || !selectedPlanId}
        className="w-full"
      >
        {loading ? "Initializing..." : "Initialize Payment Plan"}
      </Button>
    </div>
  );
}

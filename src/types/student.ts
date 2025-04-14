export type StudentStatus = 'active' | 'inactive' | 'invited' | 'suspended' | 'all';

export interface Student {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_active?: string;
  status: StudentStatus;
  progress?: number;
  enrolled_courses?: number;
  role: string;
  suspended_until?: string | null;
  suspension_reason?: string | null;
  // Additional fields (non-payment related)
  program_start_date?: string | null;
  months_paid?: number | null;
}

export interface StudentFilters {
  status?: StudentStatus;
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  courseId?: string;
}

export interface BulkAction {
  type: 'suspend' | 'activate' | 'delete' | 'send_email';
  studentIds: string[];
  metadata?: {
    reason?: string;
    duration?: number;
    message?: string;
  };
}
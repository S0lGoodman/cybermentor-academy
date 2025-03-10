export type StudentStatus = 'active' | 'suspended' | 'inactive' | 'pending' | 'all';

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
  user_metadata?: {
    is_new_user?: boolean;
    suspended_until?: string;
    suspension_reason?: string;
  };
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
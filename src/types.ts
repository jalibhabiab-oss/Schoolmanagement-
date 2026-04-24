export interface School {
  id: string;
  school_name: string;
  owner_name: string;
  phone: string;
  subscription_plan: string;
  ai_credits: number;
  joined_date: any; // Timestamp
}

export interface Student {
  id?: string;
  school_id: string;
  student_name: string;
  father_name: string;
  roll_number: string;
  class_name: string;
  parent_whatsapp: string;
  monthly_fee: number;
  status: 'active' | 'inactive';
}

export interface Teacher {
  id?: string;
  school_id: string;
  teacher_name: string;
  phone: string;
  subject: string;
  salary: number;
  login_pin: string;
}

export interface Attendance {
  id?: string;
  school_id: string;
  class_name: string;
  date: string; // YYYY-MM-DD
  present_students: string[]; // IDs
  absent_students: string[]; // IDs
  marked_by: string;
}

export interface Result {
  id?: string;
  school_id: string;
  exam_type: string;
  subject: string;
  class_name: string;
  marks_data: Record<string, number>; // student_id -> marks
}

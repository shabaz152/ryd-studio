export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  name: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  age: number;
  avatarUrl: string;
  notes?: string;
  lastAttendance?: AttendanceStatus;
}

export interface Batch {
  id: string;
  name: string;
  code: string; // e.g. "RYD-HIP-01"
  style: string; // e.g. "Hip-Hop Juniors", "Contemporary Elite"
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass';
  scheduleTime: string; // "16:00 - 17:30"
  days: string[]; // ["Mon", "Wed", "Fri"]
  studioRoom: string; // "Studio Alpha - Hall 2"
  locationName: string; // "RYD Downtown Central"
  address: string; // "742 Broadway Ave, Suite 300"
  mapCoordinates: {
    lat: number;
    lng: number;
  };
  navigationUrl: string;
  students: Student[];
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface Session {
  id: string;
  batchId: string;
  batchName: string;
  date: string; // "2026-09-10"
  timeSlot: string; // "16:00 - 17:30"
  studioRoom: string;
  locationName: string;
  monthIndex: number; // 2 -> 2nd Month
  classIndex: number; // 3 -> 3rd Class
  status: 'scheduled' | 'checked_in' | 'completed' | 'cancelled' | 'rescheduled';
  checkInTime?: string;
  checkOutTime?: string;
  durationMinutes: number;
  teacherHoursLogged?: number;
  teacherEarnings?: number;
  studentAttendance?: AttendanceRecord[];
  rescheduleReason?: string;
  proposedDate?: string;
  proposedTime?: string;
  parentNotified?: boolean;
  calendarCode?: string; // e.g. "2:3ab" or "2:3res"
}

export interface Lead {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  styleInterest: string;
  ageGroup: string;
  source: 'Walk-In' | 'Phone Call' | 'Instagram' | 'Referral' | 'Website' | 'Front Desk Enquiry';
  leadType?: 'enquiry' | 'walk_in';
  status: 'new' | 'trial_scheduled' | 'enrolled' | 'follow_up';
  trialDate?: string;
  notes: string;
  createdAt: string;
}

export interface UpdateMessage {
  id: string;
  type: 'broadcast' | 'direct';
  recipientName: string; // e.g. "All Parents (Hip-Hop Juniors)" or "Aria Vance (Parent: Marcus)"
  batchName?: string;
  batchId?: string;
  subject: string;
  message: string;
  sentAt: string;
  status: 'delivered' | 'read';
  channels: ('app' | 'sms' | 'whatsapp')[];
}

export interface WorkbookOrder {
  id: string;
  batchName: string;
  studentName: string;
  itemTitle: string; // "Hip-Hop Foundations Vol. 2"
  edition: string;
  quantity: number;
  status: 'ordered' | 'dispatched' | 'in_transit' | 'delivered';
  trackingNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  studioAddress: string;
}

export interface FreeSlot {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  period: 'Morning' | 'Afternoon' | 'Evening';
  timeRange: string; // "10:00 - 12:00"
  isAvailable: boolean;
  preferredStyle?: string;
}

export interface TeacherReview {
  id: string;
  studentOrParentName: string;
  relationship: 'Student' | 'Parent';
  batchName: string;
  rating: number; // 1 to 5
  date: string;
  reviewText: string;
  categories: {
    energy: number;
    technique: number;
    punctuality: number;
    engagement: number;
  };
  teacherReply?: string;
}

export type ReferralProgressStage =
  | 'starting_referral'
  | 'interview'
  | 'selected'
  | 'successfully_joined';

export interface ReferredCandidate {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  specialty: string;
  stage: ReferralProgressStage;
  dateReferred: string;
  notes?: string;
}

export interface ReferralStats {
  referralCode: string;
  invitesSent: number;
  onboardedTeachers: number;
  bonusEarned: number;
  pendingBonuses: number;
  milestoneTarget: number;
  candidates: ReferredCandidate[];
}

export interface AddSessionParams {
  batchId: string;
  date: string;
  timeSlot: string;
  studioRoom: string;
  type: string;
  durationMinutes?: number;
  customBatchName?: string;
  locationName?: string;
  sendParentNotification?: boolean;
}

export interface AddBatchParams {
  name: string;
  code?: string;
  style: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass';
  scheduleTime: string;
  days: string[];
  studioRoom: string;
  locationName: string;
  address?: string;
  students?: Student[];
  autoScheduleToday?: boolean;
}

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
  code: string; // e.g. "RYD-MATH-01", "RYD-DANCE-01", "RYD-MUSIC-01"
  style: string; // e.g. "Classical Bharatanatyam", "Acoustic Guitar", "Pure Mathematics & Calculus"
  disciplineCategory?: string; // 'dance' | 'music' | 'tuition' | 'art' | 'fitness' | 'custom'
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

export type RescheduleState = 'none' | 'pending_parent_approval' | 'confirmed' | 'declined';

export interface Session {
  id: string;
  batchId: string;
  batchName: string;
  sessionName?: string; // Custom Class / Session Name e.g. "Bharatanatyam Morning Workshop", "Electric Guitar Basics"
  disciplineCategory?: string; // 'dance' | 'music' | 'tuition' | 'art' | 'fitness' | 'custom'
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
  rescheduleState?: RescheduleState;
  rescheduleReason?: string;
  proposedDate?: string;
  proposedTime?: string;
  parentNotified?: boolean;
  parentAcceptedAt?: string;
  isLateArrival?: boolean;
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
  recipientName: string; // e.g. "All Parents (Advanced Calculus)" or "Aria Vance (Parent: Marcus)"
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
  itemTitle: string; // "Calculus & Analytical Geometry Problem Sets"
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
  | 'referred'
  | 'interviewed'
  | 'selected_successfully'
  // Backward compatibility
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
  referringTeacherId?: string;
  referringTeacherName?: string;
  payoutAmount?: number;
  payoutStatus?: 'pending' | 'paid';
  payoutDate?: string;
  notes?: string;
}

export interface TeacherDayPayout {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail?: string;
  candidateId?: string;
  candidateName?: string;
  amountINR: number;
  date: string;
  status: 'pending' | 'paid';
  milestoneDescription: string;
}

export interface ReferralStats {
  referralCode: string;
  invitesSent: number;
  onboardedTeachers: number;
  bonusEarned: number;
  pendingBonuses: number;
  milestoneTarget: number;
  candidates: ReferredCandidate[];
  dayPayouts?: TeacherDayPayout[];
}

export interface AddSessionParams {
  batchId: string;
  sessionName?: string; // Custom Session / Class Name addition
  disciplineCategory?: string; // 'dance' | 'music' | 'tuition' | 'art' | 'fitness' | 'custom'
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
  disciplineCategory?: string; // 'dance' | 'music' | 'tuition' | 'art' | 'fitness' | 'custom'
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

// ---------------- 3-PERSONA ARCHITECTURE TYPES ---------------- //

export type UserRole = 'admin' | 'tutor' | 'parent';

export type TutorOnlineStatus = 'offline' | 'online' | 'in_session' | 'running_late';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  date?: string;
  createdAt?: string;
  type: 'login' | 'logout' | 'check_in' | 'check_out' | 'running_late' | 'reschedule' | 'announcement';
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  targetBatchId?: string;
  targetBatchName?: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
  readByAdmin: boolean;
  readByParent: boolean;
}

export interface TutorLocation {
  lat: number;
  lng: number;
  locationName: string;
  area: string;
  status: 'on_site' | 'in_transit' | 'off_duty';
  etaMinutes?: number;
  distanceKm?: number;
  lastPingTime: string;
  batteryLevel?: number;
  speedKmH?: number;
  isWithinGeofence: boolean;
}

export interface TutorAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  subjects: string[];
  hourlyRate: number;
  totalHoursMonth: number;
  totalEarningsMonth: number;
  rating: number;
  status: TutorOnlineStatus;
  lastLoginTime?: string;
  lastLogoutTime?: string;
  location?: TutorLocation;
}

export interface DesignatedHallLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  geofenceRadiusMeters: number;
  code?: string;
  designatedBy?: string;
  updatedAt?: string;
  notes?: string;
}

export interface ParentAccount {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  location?: TutorLocation;
  children: {
    studentId: string;
    studentName: string;
    grade: string;
    enrolledBatches: string[];
  }[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  title: string;
  studentId?: string;
}

export interface AuthorizedUser extends AuthUser {
  password: string;
  isAuthorized: boolean;
  authorizedAt: string;
  authorizedBy: string;
}


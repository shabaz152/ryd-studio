import {
  Batch,
  Lead,
  UpdateMessage,
  WorkbookOrder,
  FreeSlot,
  TeacherReview,
  ReferralStats,
  Session,
  Student,
  TutorAccount,
  ParentAccount,
  ActivityEvent
} from '../types';


export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch-math-01',
    name: 'Advanced Calculus & Vectors',
    code: 'RYD-MATH-01',
    style: 'Pure Mathematics & Calculus',
    level: 'Advanced',
    scheduleTime: '16:00 - 17:30',
    days: ['Mon', 'Wed', 'Fri'],
    studioRoom: 'Tutoring Pod Alpha - Room 1',
    locationName: 'RYD Downtown Learning Center',
    address: '742 Broadway Ave, Floor 3, Downtown',
    mapCoordinates: { lat: 40.7128, lng: -74.0060 },
    navigationUrl: 'https://maps.google.com/?q=742+Broadway+Ave+Downtown',
    students: []
  },
  {
    id: 'batch-physics-02',
    name: 'Physics Mechanics & Dynamics',
    code: 'RYD-PHYS-02',
    style: 'Classical Mechanics & Problem Solving',
    level: 'Intermediate',
    scheduleTime: '18:00 - 19:30',
    days: ['Tue', 'Thu'],
    studioRoom: 'STEM Suite Beta - Room 3',
    locationName: 'RYD West End Academy',
    address: '128 West End Blvd, Academic Pavilion',
    mapCoordinates: { lat: 40.7589, lng: -73.9851 },
    navigationUrl: 'https://maps.google.com/?q=128+West+End+Blvd',
    students: []
  },
  {
    id: 'batch-chem-03',
    name: 'Organic & Physical Chemistry',
    code: 'RYD-CHEM-03',
    style: 'Reaction Mechanisms & Stoichiometry',
    level: 'Masterclass',
    scheduleTime: '19:45 - 21:15',
    days: ['Wed', 'Sat'],
    studioRoom: 'Chemistry Lab Gamma - Hall 2',
    locationName: 'RYD Metro Academic Hub',
    address: '500 Metroplex Way, Science Hall',
    mapCoordinates: { lat: 40.7484, lng: -73.9857 },
    navigationUrl: 'https://maps.google.com/?q=500+Metroplex+Way',
    students: []
  },
  {
    id: 'batch-cs-04',
    name: 'Computer Science & Python Coding',
    code: 'RYD-CS-04',
    style: 'Algorithms, Logic & Data Structures',
    level: 'Beginner',
    scheduleTime: '14:30 - 15:45',
    days: ['Tue', 'Fri'],
    studioRoom: 'Computing Lab Delta - Room 4',
    locationName: 'RYD Uptown Study Center',
    address: '88 Park Avenue, Suite 100',
    mapCoordinates: { lat: 40.7712, lng: -73.9742 },
    navigationUrl: 'https://maps.google.com/?q=88+Park+Avenue+Uptown',
    students: []
  }
];

// Clean 0-Baseline by default for a new teacher/account
export const INITIAL_SESSIONS: Session[] = [];

// Sample Demo Sessions for Demo Mode
export const DEMO_SESSIONS: Session[] = [
  {
    id: 'sess-today-01',
    batchId: 'batch-math-01',
    batchName: 'Advanced Calculus & Vectors',
    date: '2026-09-10',
    timeSlot: '16:00 - 17:30',
    studioRoom: 'Tutoring Pod Alpha - Room 1',
    locationName: 'RYD Downtown Learning Center',
    monthIndex: 2,
    classIndex: 3,
    status: 'scheduled',
    durationMinutes: 90,
    calendarCode: '2:3ab'
  },
  {
    id: 'sess-today-02',
    batchId: 'batch-physics-02',
    batchName: 'Physics Mechanics & Dynamics',
    date: '2026-09-10',
    timeSlot: '18:00 - 19:30',
    studioRoom: 'STEM Suite Beta - Room 3',
    locationName: 'RYD West End Academy',
    monthIndex: 2,
    classIndex: 4,
    status: 'scheduled',
    durationMinutes: 90,
    calendarCode: '2:4sch'
  },
  {
    id: 'sess-prev-01',
    batchId: 'batch-chem-03',
    batchName: 'Organic & Physical Chemistry',
    date: '2026-09-09',
    timeSlot: '19:45 - 21:15',
    studioRoom: 'Chemistry Lab Gamma - Hall 2',
    locationName: 'RYD Metro Academic Hub',
    monthIndex: 2,
    classIndex: 2,
    status: 'scheduled',
    durationMinutes: 90,
    teacherHoursLogged: 0,
    teacherEarnings: 0,
    calendarCode: '2:2pr'
  }
];

export const INITIAL_LEADS: Lead[] = [];

export const INITIAL_UPDATES: UpdateMessage[] = [
  {
    id: 'msg-1',
    type: 'broadcast',
    recipientName: 'All Parents & Students (Advanced Calculus)',
    batchName: 'Advanced Calculus & Vectors',
    batchId: 'batch-math-01',
    subject: 'Mid-Term Practice Worksheet & Calculus Key Released',
    message: 'Hello RYD families! The practice problem set for our upcoming calculus milestone review is now uploaded to your student portal. Please have students review problems 1–15 before tomorrow’s tutoring session.',
    sentAt: 'Today, 11:30 AM',
    status: 'read',
    channels: ['app', 'whatsapp']
  },
  {
    id: 'msg-2',
    type: 'direct',
    recipientName: 'David Chen (Parent of Leo Chen)',
    batchName: 'Physics Mechanics & Dynamics',
    batchId: 'batch-physics-02',
    subject: 'Feedback: Great Progress in Vectors & Dynamics',
    message: 'Hi David, just wanted to highlight Leo’s exceptional improvement in resolving multi-body force vectors today. He solved the challenging equilibrium question independently!',
    sentAt: 'Yesterday, 6:40 PM',
    status: 'read',
    channels: ['app', 'sms']
  },
  {
    id: 'msg-3',
    type: 'broadcast',
    recipientName: 'All Batches (Academic Center Notice)',
    subject: 'Study Hall Protocol & Scientific Calculator Guidelines',
    message: 'Reminder to all students to bring scientific calculators, graph notebooks, and practice worksheets. Quiet study pods are open daily from 3 PM.',
    sentAt: 'Sep 08, 09:00 AM',
    status: 'delivered',
    channels: ['app', 'sms', 'whatsapp']
  }
];

export const INITIAL_WORKBOOK_ORDERS: WorkbookOrder[] = [
  {
    id: 'wb-101',
    batchName: 'Advanced Calculus & Vectors',
    studentName: 'Leo Chen',
    itemTitle: 'Calculus & Analytical Geometry Problem Sets',
    edition: 'Edition 2026 (Level 2)',
    quantity: 1,
    status: 'delivered',
    trackingNumber: 'RYD-TRK-88291',
    orderDate: '2026-09-04',
    estimatedDelivery: '2026-09-07',
    studioAddress: 'RYD Downtown Learning Center - Desk 14'
  },
  {
    id: 'wb-102',
    batchName: 'Physics Mechanics & Dynamics',
    studentName: 'Sophia Laurent',
    itemTitle: 'Physics Dynamics & Kinetic Problem Workbook',
    edition: 'Senior Prep Series Vol. 1',
    quantity: 1,
    status: 'in_transit',
    trackingNumber: 'RYD-TRK-99032',
    orderDate: '2026-09-08',
    estimatedDelivery: '2026-09-11',
    studioAddress: 'RYD West End Academy - Reception'
  },
  {
    id: 'wb-103',
    batchName: 'Organic & Physical Chemistry',
    studentName: 'Rohan Sharma',
    itemTitle: 'Organic Synthesis & Reaction Mechanisms Guide',
    edition: 'Board Prep Gold 2026',
    quantity: 1,
    status: 'dispatched',
    trackingNumber: 'RYD-TRK-10492',
    orderDate: '2026-09-09',
    estimatedDelivery: '2026-09-12',
    studioAddress: 'RYD Metro Academic Hub - Office'
  }
];

export const INITIAL_FREE_SLOTS: FreeSlot[] = [
  { id: 'fs-1', dayOfWeek: 'Monday', period: 'Morning', timeRange: '09:00 - 11:00', isAvailable: true, preferredStyle: 'Math Office Hours' },
  { id: 'fs-2', dayOfWeek: 'Monday', period: 'Afternoon', timeRange: '13:00 - 15:30', isAvailable: true, preferredStyle: '1-on-1 Physics Tutoring' },
  { id: 'fs-3', dayOfWeek: 'Tuesday', period: 'Morning', timeRange: '10:00 - 12:00', isAvailable: false },
  { id: 'fs-4', dayOfWeek: 'Tuesday', period: 'Afternoon', timeRange: '14:00 - 16:00', isAvailable: true, preferredStyle: 'Chemistry Problem Clinics' },
  { id: 'fs-5', dayOfWeek: 'Wednesday', period: 'Morning', timeRange: '09:30 - 11:30', isAvailable: true },
  { id: 'fs-6', dayOfWeek: 'Thursday', period: 'Morning', timeRange: '10:00 - 12:00', isAvailable: true, preferredStyle: 'Exam Makeup Sessions' },
  { id: 'fs-7', dayOfWeek: 'Friday', period: 'Morning', timeRange: '09:00 - 12:00', isAvailable: true },
  { id: 'fs-8', dayOfWeek: 'Saturday', period: 'Morning', timeRange: '08:30 - 10:30', isAvailable: true, preferredStyle: 'Calculus Masterclasses' },
  { id: 'fs-9', dayOfWeek: 'Sunday', period: 'Afternoon', timeRange: '14:00 - 17:00', isAvailable: false }
];

export const INITIAL_REVIEWS: TeacherReview[] = [
  {
    id: 'rev-1',
    studentOrParentName: 'Elena Rodriguez',
    relationship: 'Parent',
    batchName: 'Advanced Calculus & Vectors',
    rating: 5,
    date: '2026-09-07',
    reviewText: 'Sarah is an exceptional tutor. Maya looks forward to every single session. Her patience with complex calculus problems and structured step-by-step breakdowns boosted Maya’s grades from 72% to 95%.',
    categories: { energy: 5, technique: 5, punctuality: 5, engagement: 5 },
    teacherReply: 'Thank you so much Elena. Maya brings tremendous focus and curiosity to every study session.'
  },
  {
    id: 'rev-2',
    studentOrParentName: 'Kenneth Ross',
    relationship: 'Parent',
    batchName: 'Physics Mechanics & Dynamics',
    rating: 5,
    date: '2026-09-03',
    reviewText: 'The physics problem breakdowns and free-body diagram tutorials are first rate. Ethan has noticeably improved in analytical problem solving and exam speed.',
    categories: { energy: 5, technique: 5, punctuality: 4, engagement: 5 }
  },
  {
    id: 'rev-3',
    studentOrParentName: 'David Chen',
    relationship: 'Parent',
    batchName: 'Advanced Calculus & Vectors',
    rating: 5,
    date: '2026-08-28',
    reviewText: 'Punctual, organized, and provides structured homework review after every class. The structured calendar codes keep our family study schedule seamlessly updated.',
    categories: { energy: 5, technique: 4, punctuality: 5, engagement: 5 }
  }
];

export const INITIAL_REFERRAL_STATS: ReferralStats = {
  referralCode: 'RYD-SARAH-2026',
  invitesSent: 0,
  onboardedTeachers: 0,
  bonusEarned: 0,
  pendingBonuses: 0,
  milestoneTarget: 5,
  candidates: [],
};

export const DEMO_REFERRAL_STATS: ReferralStats = {
  referralCode: 'RYD-SARAH-2026',
  invitesSent: 4,
  onboardedTeachers: 1,
  bonusEarned: 1500,
  pendingBonuses: 1500,
  milestoneTarget: 5,
  candidates: [
    {
      id: 'cand-1',
      candidateName: 'Marcus Vance',
      email: 'marcus.v@gmail.com',
      phone: '+1 (555) 234-8891',
      specialty: 'AP Physics & Advanced Mechanics',
      stage: 'successfully_joined',
      dateReferred: '2026-09-02',
      notes: 'Onboarded for West End Academy - Weekend problem clinics.'
    },
    {
      id: 'cand-2',
      candidateName: 'Zara Morales',
      email: 'zara.edu@outlook.com',
      phone: '+1 (555) 345-9920',
      specialty: 'Organic Chemistry & Biochemistry',
      stage: 'selected',
      dateReferred: '2026-09-05',
      notes: 'Final academic qualification verification pending.'
    }
  ],
};

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    name: 'Maya Lin',
    parentName: 'Elena Lin',
    parentPhone: '+1 (555) 912-3456',
    parentEmail: 'elena.lin@gmail.com',
    age: 16,
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    notes: 'Grade 11 • AP Calculus candidate. Exceptional analytical speed.',
    lastAttendance: 'present' as const
  },
  {
    id: 'stud-2',
    name: 'Leo Chen',
    parentName: 'David Chen',
    parentPhone: '+1 (555) 987-6543',
    parentEmail: 'david.chen@gmail.com',
    age: 15,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    notes: 'Grade 10 • Preparing for Physics Olympiad & STEM Honors.',
    lastAttendance: 'present' as const
  },
  {
    id: 'stud-3',
    name: 'Aria Vance',
    parentName: 'Marcus Vance',
    parentPhone: '+1 (555) 234-8891',
    parentEmail: 'marcus.vance@gmail.com',
    age: 16,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    notes: 'Grade 11 • Pure Mathematics & Physics candidate.',
    lastAttendance: 'present' as const
  }
];

export const INITIAL_TUTORS: TutorAccount[] = [
  {
    id: 'tutor-shazz',
    name: 'Shazz (Lead Faculty)',
    email: 'shazz.faculty@ryd.edu',
    phone: '+1 (555) 789-0123',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subjects: ['Advanced Calculus & Vectors', 'Physics Mechanics & Dynamics'],
    hourlyRate: 500,
    totalHoursMonth: 0,
    totalEarningsMonth: 0,
    rating: 0,
    status: 'online',
    lastLoginTime: '15:45'
  },
  {
    id: 'tutor-alex',
    name: 'Dr. Alex Mercer',
    email: 'a.mercer@ryd.edu',
    phone: '+1 (555) 678-9012',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    subjects: ['Organic & Physical Chemistry'],
    hourlyRate: 600,
    totalHoursMonth: 12,
    totalEarningsMonth: 7200,
    rating: 4.95,
    status: 'online',
    lastLoginTime: '14:30'
  },
  {
    id: 'tutor-priya',
    name: 'Priya Sundaram',
    email: 'p.sundaram@ryd.edu',
    phone: '+1 (555) 456-7890',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    subjects: ['Computer Science & Python Coding'],
    hourlyRate: 550,
    totalHoursMonth: 8,
    totalEarningsMonth: 4400,
    rating: 4.9,
    status: 'offline',
    lastLogoutTime: '13:00'
  }
];

export const INITIAL_PARENTS: ParentAccount[] = [
  {
    id: 'parent-marcus',
    parentName: 'Marcus Vance',
    phone: '+1 (555) 234-8891',
    email: 'marcus.vance@gmail.com',
    children: [
      {
        studentId: 'stud-3',
        studentName: 'Aria Vance',
        grade: '11th Grade STEM',
        enrolledBatches: ['batch-math-01', 'batch-physics-02']
      }
    ]
  },
  {
    id: 'parent-elena',
    parentName: 'Elena Lin',
    phone: '+1 (555) 912-3456',
    email: 'elena.lin@gmail.com',
    children: [
      {
        studentId: 'stud-1',
        studentName: 'Maya Lin',
        grade: '11th Grade AP Honors',
        enrolledBatches: ['batch-math-01']
      }
    ]
  },
  {
    id: 'parent-david',
    parentName: 'David Chen',
    phone: '+1 (555) 987-6543',
    email: 'david.chen@gmail.com',
    children: [
      {
        studentId: 'stud-2',
        studentName: 'Leo Chen',
        grade: '10th Grade STEM',
        enrolledBatches: ['batch-physics-02']
      }
    ]
  }
];

export const INITIAL_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'act-init-1',
    timestamp: '15:45',
    type: 'login',
    actorId: 'tutor-shazz',
    actorName: 'Shazz (Lead Faculty)',
    actorRole: 'tutor',
    targetBatchId: 'batch-math-01',
    targetBatchName: 'Advanced Calculus & Vectors',
    title: 'Tutor Online & Shift Started',
    description: 'Tutor Shazz logged in to the portal and initialized today’s schedule.',
    readByAdmin: true,
    readByParent: true
  },
  {
    id: 'act-init-2',
    timestamp: '14:30',
    type: 'login',
    actorId: 'tutor-alex',
    actorName: 'Dr. Alex Mercer',
    actorRole: 'tutor',
    targetBatchId: 'batch-chem-03',
    targetBatchName: 'Organic & Physical Chemistry',
    title: 'Tutor Online & Shift Started',
    description: 'Dr. Alex Mercer logged into the academic hub.',
    readByAdmin: true,
    readByParent: true
  }
];

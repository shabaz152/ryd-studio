import { Batch, Lead, UpdateMessage, WorkbookOrder, FreeSlot, TeacherReview, ReferralStats, Session } from '../types';

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch-hiphop-01',
    name: 'Hip-Hop Juniors Crew',
    code: 'RYD-HH-01',
    style: 'Hip-Hop & Urban Street',
    level: 'Intermediate',
    scheduleTime: '16:00 - 17:30',
    days: ['Mon', 'Wed', 'Fri'],
    studioRoom: 'Studio Alpha - Hall 1',
    locationName: 'RYD Downtown Central',
    address: '742 Broadway Ave, Floor 3, Downtown',
    mapCoordinates: { lat: 40.7128, lng: -74.0060 },
    navigationUrl: 'https://maps.google.com/?q=742+Broadway+Ave+Downtown',
    students: []
  },
  {
    id: 'batch-contemporary-02',
    name: 'Contemporary Elite',
    code: 'RYD-CONT-02',
    style: 'Lyrical Contemporary & Flow',
    level: 'Advanced',
    scheduleTime: '18:00 - 19:30',
    days: ['Tue', 'Thu'],
    studioRoom: 'Studio Beta - Hall 3',
    locationName: 'RYD West End Arts',
    address: '128 West End Blvd, Studio Pavilion',
    mapCoordinates: { lat: 40.7589, lng: -73.9851 },
    navigationUrl: 'https://maps.google.com/?q=128+West+End+Blvd',
    students: []
  },
  {
    id: 'batch-bollywood-03',
    name: 'Bollywood Beats Pro',
    code: 'RYD-BOLL-03',
    style: 'Bollywood Fusion & Cinematic',
    level: 'Masterclass',
    scheduleTime: '19:45 - 21:15',
    days: ['Wed', 'Sat'],
    studioRoom: 'Studio Gamma - Grand Arena',
    locationName: 'RYD Metro Stage',
    address: '500 Metroplex Way, Arena Stage',
    mapCoordinates: { lat: 40.7484, lng: -73.9857 },
    navigationUrl: 'https://maps.google.com/?q=500+Metroplex+Way',
    students: []
  },
  {
    id: 'batch-jazz-04',
    name: 'Street Jazz Starters',
    code: 'RYD-JAZZ-04',
    style: 'Street Jazz & Musicality',
    level: 'Beginner',
    scheduleTime: '14:30 - 15:45',
    days: ['Tue', 'Fri'],
    studioRoom: 'Studio Delta - Hall 4',
    locationName: 'RYD Uptown Studios',
    address: '88 Park Avenue, Suite 100',
    mapCoordinates: { lat: 40.7712, lng: -73.9742 },
    navigationUrl: 'https://maps.google.com/?q=88+Park+Avenue+Uptown',
    students: []
  }
];

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'sess-today-01',
    batchId: 'batch-hiphop-01',
    batchName: 'Hip-Hop Juniors Crew',
    date: '2026-09-10',
    timeSlot: '16:00 - 17:30',
    studioRoom: 'Studio Alpha - Hall 1',
    locationName: 'RYD Downtown Central',
    monthIndex: 2,
    classIndex: 3,
    status: 'scheduled',
    durationMinutes: 90,
    calendarCode: '2:3ab'
  },
  {
    id: 'sess-today-02',
    batchId: 'batch-contemporary-02',
    batchName: 'Contemporary Elite',
    date: '2026-09-10',
    timeSlot: '18:00 - 19:30',
    studioRoom: 'Studio Beta - Hall 3',
    locationName: 'RYD West End Arts',
    monthIndex: 2,
    classIndex: 4,
    status: 'scheduled',
    durationMinutes: 90,
    calendarCode: '2:4sch'
  },
  {
    id: 'sess-prev-01',
    batchId: 'batch-bollywood-03',
    batchName: 'Bollywood Beats Pro',
    date: '2026-09-09',
    timeSlot: '19:45 - 21:15',
    studioRoom: 'Studio Gamma - Grand Arena',
    locationName: 'RYD Metro Stage',
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
    recipientName: 'All Parents & Dancers (Hip-Hop Juniors)',
    batchName: 'Hip-Hop Juniors Crew',
    batchId: 'batch-hiphop-01',
    subject: 'Mid-Month Showcase Choreography Song Released',
    message: 'Hello RYD family! The choreography track for our upcoming studio cypher has been updated in your student portal. Please have dancers review the 8-count breakdown before tomorrow’s session.',
    sentAt: 'Today, 11:30 AM',
    status: 'read',
    channels: ['app', 'whatsapp']
  },
  {
    id: 'msg-2',
    type: 'direct',
    recipientName: 'David Chen (Parent of Leo Chen)',
    batchName: 'Hip-Hop Juniors Crew',
    batchId: 'batch-hiphop-01',
    subject: 'Feedback: Great Solo Pop Routine',
    message: 'Hi David, just wanted to highlight Leo’s exceptional improvement with his timing today. He nailed the center stage isolation!',
    sentAt: 'Yesterday, 6:40 PM',
    status: 'read',
    channels: ['app', 'sms']
  },
  {
    id: 'msg-3',
    type: 'broadcast',
    recipientName: 'All Batches (Studio Broadcast)',
    subject: 'Studio Hall Sanitization & Hydration Protocol',
    message: 'Reminder to all dancers to bring labeled water bottles and studio indoor dance sneakers. Outdoor shoes must remain in the entrance lockers.',
    sentAt: 'Sep 08, 09:00 AM',
    status: 'delivered',
    channels: ['app', 'sms', 'whatsapp']
  }
];

export const INITIAL_WORKBOOK_ORDERS: WorkbookOrder[] = [
  {
    id: 'wb-101',
    batchName: 'Hip-Hop Juniors Crew',
    studentName: 'Leo Chen',
    itemTitle: 'Urban Movement & Rhythm Theory Guide',
    edition: 'Edition 2026 (Level 2)',
    quantity: 1,
    status: 'delivered',
    trackingNumber: 'RYD-TRK-88291',
    orderDate: '2026-09-04',
    estimatedDelivery: '2026-09-07',
    studioAddress: 'RYD Downtown Central - Locker 14'
  },
  {
    id: 'wb-102',
    batchName: 'Contemporary Elite',
    studentName: 'Sophia Laurent',
    itemTitle: 'Anatomy & Flow Alignment Handbook',
    edition: 'Elite Master Series Vol. 1',
    quantity: 1,
    status: 'in_transit',
    trackingNumber: 'RYD-TRK-99032',
    orderDate: '2026-09-08',
    estimatedDelivery: '2026-09-11',
    studioAddress: 'RYD West End Arts - Reception'
  },
  {
    id: 'wb-103',
    batchName: 'Bollywood Beats Pro',
    studentName: 'Rohan Sharma',
    itemTitle: 'Cinematic Expressions & Rhythm Syllabus',
    edition: 'Pro Gold 2026',
    quantity: 1,
    status: 'dispatched',
    trackingNumber: 'RYD-TRK-10492',
    orderDate: '2026-09-09',
    estimatedDelivery: '2026-09-12',
    studioAddress: 'RYD Metro Stage - Desk'
  }
];

export const INITIAL_FREE_SLOTS: FreeSlot[] = [
  { id: 'fs-1', dayOfWeek: 'Monday', period: 'Morning', timeRange: '09:00 - 11:00', isAvailable: true, preferredStyle: 'Open Training' },
  { id: 'fs-2', dayOfWeek: 'Monday', period: 'Afternoon', timeRange: '13:00 - 15:30', isAvailable: true, preferredStyle: 'Private Coaching' },
  { id: 'fs-3', dayOfWeek: 'Tuesday', period: 'Morning', timeRange: '10:00 - 12:00', isAvailable: false },
  { id: 'fs-4', dayOfWeek: 'Tuesday', period: 'Afternoon', timeRange: '14:00 - 16:00', isAvailable: true, preferredStyle: 'Workshops' },
  { id: 'fs-5', dayOfWeek: 'Wednesday', period: 'Morning', timeRange: '09:30 - 11:30', isAvailable: true },
  { id: 'fs-6', dayOfWeek: 'Thursday', period: 'Morning', timeRange: '10:00 - 12:00', isAvailable: true, preferredStyle: 'Makeup Classes' },
  { id: 'fs-7', dayOfWeek: 'Friday', period: 'Morning', timeRange: '09:00 - 12:00', isAvailable: true },
  { id: 'fs-8', dayOfWeek: 'Saturday', period: 'Morning', timeRange: '08:30 - 10:30', isAvailable: true, preferredStyle: 'Masterclasses' },
  { id: 'fs-9', dayOfWeek: 'Sunday', period: 'Afternoon', timeRange: '14:00 - 17:00', isAvailable: false }
];

export const INITIAL_REVIEWS: TeacherReview[] = [
  {
    id: 'rev-1',
    studentOrParentName: 'Elena Rodriguez',
    relationship: 'Parent',
    batchName: 'Hip-Hop Juniors Crew',
    rating: 5,
    date: '2026-09-07',
    reviewText: 'Sarah is an exceptional instructor. Maya looks forward to every single session. Her patience with footwork techniques and disciplined encouragement has built Maya’s confidence.',
    categories: { energy: 5, technique: 5, punctuality: 5, engagement: 5 },
    teacherReply: 'Thank you so much Elena. Maya brings focus and positive discipline to the studio every week.'
  },
  {
    id: 'rev-2',
    studentOrParentName: 'Kenneth Ross',
    relationship: 'Parent',
    batchName: 'Contemporary Elite',
    rating: 5,
    date: '2026-09-03',
    reviewText: 'The anatomical cues and musicality breakdowns are first rate. Ethan has noticeably improved in core control and technical stage presence.',
    categories: { energy: 5, technique: 5, punctuality: 4, engagement: 5 }
  },
  {
    id: 'rev-3',
    studentOrParentName: 'David Chen',
    relationship: 'Parent',
    batchName: 'Hip-Hop Juniors Crew',
    rating: 5,
    date: '2026-08-28',
    reviewText: 'Punctual, organized, and provides structured feedback after classes. The structured calendar codes keep our family schedule seamlessly updated.',
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

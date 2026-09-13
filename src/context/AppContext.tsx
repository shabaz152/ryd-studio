import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Batch,
  Session,
  Lead,
  UpdateMessage,
  WorkbookOrder,
  FreeSlot,
  TeacherReview,
  ReferralStats,
  AttendanceRecord,
  AddSessionParams,
  AddBatchParams,
  Student,
  ReferredCandidate,
  ReferralProgressStage,
  UserRole,
  TutorOnlineStatus,
  ActivityEvent,
  TutorAccount,
  ParentAccount,
  AuthUser,
  AuthorizedUser,
  TutorLocation,
  DesignatedHallLocation,
  AccessRequest,
} from '../types';
import {
  INITIAL_BATCHES,
  INITIAL_SESSIONS,
  INITIAL_LEADS,
  INITIAL_UPDATES,
  INITIAL_WORKBOOK_ORDERS,
  INITIAL_FREE_SLOTS,
  INITIAL_REVIEWS,
  INITIAL_REFERRAL_STATS,
  DEMO_SESSIONS,
  DEMO_REFERRAL_STATS,
  DEMO_STUDENTS,
  INITIAL_TUTORS,
  INITIAL_PARENTS,
  INITIAL_ACTIVITY_EVENTS,
  DEMO_AUTH_USERS,
  INITIAL_AUTHORIZED_USERS,
  INITIAL_ACCESS_REQUESTS,
  PRESET_HALL_LOCATIONS,
} from '../data/mockData';
import { sound } from '../utils/sound';
import { generateCalendarCode } from '../utils/calendar';
import {
  fetchRemoteStudioState,
  pushRemoteStudioState,
  onOtherTabSync,
} from '../utils/cloudSync';

export interface ToastMessage {
  id: string;
  type: 'success' | 'alert' | 'info';
  title: string;
  description: string;
}

interface TeacherProfile {
  name: string;
  role: string;
  avatarUrl: string;
  hourlyRate: number;
  totalHoursMonth: number;
  totalEarningsMonth: number;
  rating: number;
  classesCompletedThisWeek: number;
}

interface AppContextType {
  // Navigation & Viewport
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'mobile' | 'responsive';
  toggleViewMode: () => void;
  themeMode: 'light' | 'dark';
  toggleThemeMode: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Splash Screen
  showSplash: boolean;
  dismissSplash: () => void;
  replaySplash: () => void;

  // Teacher Profile
  teacher: TeacherProfile;
  setTeacherName: (name: string) => void;

  // Active Session & Live Status
  isCheckedIn: boolean;
  checkedInSession: Session | null;
  checkInTime: string | null;
  isRunningLate: boolean;
  runningLateMinutes: number | null;
  runningLateReason: string;

  // Core Data
  batches: Batch[];
  sessions: Session[];
  leads: Lead[];
  updates: UpdateMessage[];
  workbookOrders: WorkbookOrder[];
  freeSlots: FreeSlot[];
  reviews: TeacherReview[];
  referralStats: ReferralStats;

  // Toast notifications
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;

  // Modals state
  checkInModalOpen: boolean;
  setCheckInModalOpen: (open: boolean) => void;
  checkOutModalOpen: boolean;
  setCheckOutModalOpen: (open: boolean) => void;
  selectedSessionForCheckOut: Session | null;
  setSelectedSessionForCheckOut: (session: Session | null) => void;
  openCheckOutForSession: (session: Session) => void;
  runningLateModalOpen: boolean;
  setRunningLateModalOpen: (open: boolean) => void;
  rescheduleModalOpen: boolean;
  setRescheduleModalOpen: (open: boolean) => void;
  selectedSessionForReschedule: Session | null;
  openRescheduleForSession: (session: Session) => void;
  parentPreviewModalOpen: boolean;
  setParentPreviewModalOpen: (open: boolean) => void;
  selectedSessionForParentPreview: Session | null;
  openParentPreviewForSession: (session: Session) => void;
  leadModalOpen: boolean;
  setLeadModalOpen: (open: boolean) => void;
  leadModalDefaultType: 'walk_in' | 'enquiry';
  openLeadModalWithType: (type: 'walk_in' | 'enquiry') => void;
  orderWorkbookModalOpen: boolean;
  setOrderWorkbookModalOpen: (open: boolean) => void;
  composeUpdateModalOpen: boolean;
  setComposeUpdateModalOpen: (open: boolean) => void;
  newSessionModalOpen: boolean;
  setNewSessionModalOpen: (open: boolean) => void;

  // Core Actions
  checkIn: (sessionId: string) => void;
  checkOut: (sessionId: string, attendance: AttendanceRecord[], notes?: string) => void;
  reportRunningLate: (minutes: number, reason: string) => void;
  clearRunningLate: () => void;
  requestReschedule: (sessionId: string, proposedDate: string, proposedTime: string, reason: string) => void;
  acceptReschedule: (sessionId: string) => void;
  declineReschedule: (sessionId: string, reason?: string) => void;
  cancelClass: (sessionId: string, reason: string) => void;
  createNewSession: (sessionData: AddSessionParams) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  addNewBatch: (batchData: AddBatchParams) => void;
  deleteBatch: (batchId: string) => void;
  enrollStudent: (batchId: string, studentData: Omit<Student, 'id' | 'lastAttendance'>) => void;
  removeStudent: (batchId: string, studentId: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  deleteLead: (leadId: string) => void;
  clearAllLeads: () => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  createWorkbookOrder: (order: Omit<WorkbookOrder, 'id' | 'orderDate' | 'trackingNumber' | 'status'>) => void;
  toggleFreeSlot: (id: string) => void;
  addFreeSlot: (slot: Omit<FreeSlot, 'id'>) => void;
  sendUpdateMessage: (msg: Omit<UpdateMessage, 'id' | 'sentAt' | 'status'>) => void;
  deleteUpdate: (updateId: string) => void;
  clearAllUpdates: () => void;
  replyToReview: (reviewId: string, replyText: string) => void;
  shareReferralInvite: () => void;
  updateCandidateStage: (candidateId: string, stage: ReferralProgressStage) => void;
  rejectCandidate: (candidateId: string, reason?: string) => void;
  disburseDayPayout: (payoutId: string) => void;
  addCandidateReferral: (candidate: {
    candidateName: string;
    email: string;
    phone: string;
    specialty: string;
    referringTeacherId?: string;
    referringTeacherName?: string;
    notes?: string;
  }) => void;

  // Real-Time Cross-Device Cloud Sync
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: Date | null;
  triggerCloudSync: () => Promise<void>;

  // Demo Mode & Clean 0-Baseline Engine
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  resetToCleanState: () => void;
  loadDemoData: () => void;

  // 7 Core Dynamic Operational Metrics
  todaysClassesCount: number;
  studentsCount: number;
  pendingRequestsCount: number;
  completedSessionsCount: number;
  lateArrivalsCount: number;
  referralsCount: number;
  rewardsINR: number;

  // 3-Persona Triangular Architecture & Role Hierarchy
  currentAuthRole: UserRole;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  loginAsRole: (role: UserRole, studentId?: string) => void;
  logoutAuth: () => void;
  roleGatewayModalOpen: boolean;
  setRoleGatewayModalOpen: (open: boolean) => void;
  tutorOnlineStatus: TutorOnlineStatus;
  loginTutor: () => void;
  logoutTutor: () => void;
  tutors: TutorAccount[];
  parents: ParentAccount[];
  selectedParentStudentId: string;
  setSelectedParentStudentId: (id: string) => void;
  activityEvents: ActivityEvent[];
  addActivityEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp' | 'readByAdmin' | 'readByParent'>) => void;
  unreadAdminActivityCount: number;
  unreadParentActivityCount: number;
  markActivityReadByAdmin: () => void;
  markActivityReadByParent: () => void;

  // Real Credential & Admin-Authorized Authentication
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  authorizedUsers: AuthorizedUser[];
  loginWithCredentials: (
    email: string,
    password: string,
    role?: UserRole
  ) => { success: boolean; error?: string; isPendingApproval?: boolean; isNewAccess?: boolean; isDeclined?: boolean };
  loginWithGoogle: (account: { name: string; email: string; avatarUrl?: string; role: UserRole }) => { success: boolean; error?: string };
  logout: () => void;
  updateMyCredentials: (newEmail: string, newPassword?: string, currentPassword?: string, newName?: string) => { success: boolean; error?: string };
  updateAdminProfileName: (newName: string) => { success: boolean; error?: string };
  requestPasswordReset: (email: string) => { success: boolean; error?: string; otpCode?: string };
  resetPasswordWithCode: (email: string, code: string, newPassword: string) => { success: boolean; error?: string };
  authorizeNewUser: (user: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    title?: string;
    phone?: string;
    subjects?: string;
    studentId?: string;
  }) => { success: boolean; error?: string };
  updateUserCredentials: (
    userId: string,
    updates: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      title?: string;
      phone?: string;
      isAuthorized?: boolean;
    }
  ) => { success: boolean; error?: string };
  toggleUserAuthorization: (userId: string) => { success: boolean; error?: string };
  deleteUser: (userId: string) => { success: boolean; error?: string };
  accountSecurityModalOpen: boolean;
  setAccountSecurityModalOpen: (open: boolean) => void;

  // Admin Access Request & Approval Workflow
  accessRequests: AccessRequest[];
  pendingAccessRequestsCount: number;
  requestAccess: (requestData: {
    name: string;
    email: string;
    password: string;
    role: 'tutor' | 'parent';
    notes?: string;
    phone?: string;
  }) => { success: boolean; error?: string; message?: string };
  grantAccessRequest: (requestId: string) => { success: boolean; error?: string };
  declineAccessRequest: (requestId: string) => { success: boolean; error?: string };
  deleteAccessRequest: (requestId: string) => { success: boolean };

  // Live Tutor & Parent GPS Location Map & Designated Hall
  designatedHall: DesignatedHallLocation;
  updateDesignatedHall: (hall: Partial<DesignatedHallLocation>) => void;
  simulateTutorMovement: () => void;
  pingTutor: (tutorId: string) => void;
  pingParent: (parentId: string) => void;
  setParents: React.Dispatch<React.SetStateAction<ParentAccount[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'ryd_studio_state_v11';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('responsive');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Subtle CRM Light Theme is active by default
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_theme`);
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleThemeMode = () => {
    sound.playClick();
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_theme`, themeMode);
    } catch {
      // ignore
    }
    if (themeMode === 'light') {
      document.documentElement.classList.add('crm-light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('crm-light-viewport');
      document.body.classList.remove('glossy-black-viewport');
    } else {
      document.documentElement.classList.remove('crm-light');
      document.documentElement.classList.add('dark');
      document.body.classList.remove('crm-light-viewport');
      document.body.classList.add('glossy-black-viewport');
    }
  }, [themeMode]);

  // Initial stats set strictly to 0 as requested by the user
  const [teacher, setTeacher] = useState<TeacherProfile>(() => {
    return {
      name: 'Sarah Jenkins',
      role: 'Senior Academic Faculty & STEM Tutor',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      hourlyRate: 500,
      totalHoursMonth: 0,
      totalEarningsMonth: 0,
      rating: 0,
      classesCompletedThisWeek: 0,
    };
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_batches`);
      if (saved) {
        const parsed: Batch[] = JSON.parse(saved);
        const missing = INITIAL_BATCHES.filter((ib) => !parsed.some((b) => b.id === ib.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      }
      return INITIAL_BATCHES;
    } catch {
      return INITIAL_BATCHES;
    }
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sessions`);
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [updates, setUpdates] = useState<UpdateMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_updates`);
      return saved ? JSON.parse(saved) : INITIAL_UPDATES;
    } catch {
      return INITIAL_UPDATES;
    }
  });

  const [workbookOrders, setWorkbookOrders] = useState<WorkbookOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_workbooks`);
      return saved ? JSON.parse(saved) : INITIAL_WORKBOOK_ORDERS;
    } catch {
      return INITIAL_WORKBOOK_ORDERS;
    }
  });

  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_slots`);
      return saved ? JSON.parse(saved) : INITIAL_FREE_SLOTS;
    } catch {
      return INITIAL_FREE_SLOTS;
    }
  });

  const [reviews, setReviews] = useState<TeacherReview[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [referralStats, setReferralStats] = useState<ReferralStats>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_referrals`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.candidates)) {
          if (parsed.candidates.length >= INITIAL_REFERRAL_STATS.candidates.length) {
            return parsed;
          }
          const existingIds = new Set(parsed.candidates.map((c: any) => c.id));
          const missing = INITIAL_REFERRAL_STATS.candidates.filter((c) => !existingIds.has(c.id));
          const mergedCandidates = [...parsed.candidates, ...missing];
          const existingPayoutIds = new Set((parsed.dayPayouts || []).map((p: any) => p.id));
          const missingPayouts = (INITIAL_REFERRAL_STATS.dayPayouts || []).filter((p) => !existingPayoutIds.has(p.id));
          return {
            ...parsed,
            candidates: mergedCandidates,
            dayPayouts: [...(parsed.dayPayouts || []), ...missingPayouts],
          };
        }
      }
      return INITIAL_REFERRAL_STATS;
    } catch {
      return INITIAL_REFERRAL_STATS;
    }
  });

  // Running Late State
  const [isRunningLate, setIsRunningLate] = useState<boolean>(false);
  const [runningLateMinutes, setRunningLateMinutes] = useState<number | null>(null);
  const [runningLateReason, setRunningLateReason] = useState<string>('');
  // Real Credential & Admin-Authorized Authentication State
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_authorized_users`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_AUTHORIZED_USERS;
  });

  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_access_requests`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ACCESS_REQUESTS;
  });

  const pendingAccessRequestsCount = accessRequests.filter((r) => r.status === 'pending').length;

  const [accountSecurityModalOpen, setAccountSecurityModalOpen] = useState<boolean>(false);
  const passwordResetTokens = useRef<Record<string, { code: string; expiresAt: number }>>({});

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_auth_user`);
      if (saved) return JSON.parse(saved);
      const authRole = (localStorage.getItem(`${STORAGE_KEY}_auth_role`) as UserRole) || 'admin';
      const user = INITIAL_AUTHORIZED_USERS.find((u) => u.role === authRole) || INITIAL_AUTHORIZED_USERS[0];
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        title: user.title,
        studentId: user.studentId,
      };
    } catch {
      return INITIAL_AUTHORIZED_USERS[0];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_is_auth`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // 3-Persona Architecture State & Role Guard
  const [currentAuthRole, setCurrentAuthRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_auth_role`);
      return (saved === 'admin' || saved === 'tutor' || saved === 'parent') ? saved : 'admin';
    } catch {
      return 'admin';
    }
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    try {
      const auth = localStorage.getItem(`${STORAGE_KEY}_auth_role`) as UserRole;
      if (auth === 'tutor') return 'tutor';
      if (auth === 'parent') return 'parent';
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_role`);
      return (saved === 'admin' || saved === 'tutor' || saved === 'parent') ? saved : 'admin';
    } catch {
      return 'admin';
    }
  });

  const [roleGatewayModalOpen, setRoleGatewayModalOpen] = useState<boolean>(false);
  const [tutorOnlineStatus, setTutorOnlineStatus] = useState<TutorOnlineStatus>('online');

  const [tutors, setTutors] = useState<TutorAccount[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tutors`);
      return saved ? JSON.parse(saved) : INITIAL_TUTORS;
    } catch {
      return INITIAL_TUTORS;
    }
  });

  const [parents, setParents] = useState<ParentAccount[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_parents`);
      if (saved) {
        const parsed: ParentAccount[] = JSON.parse(saved);
        return parsed.map((p) => {
          const init = INITIAL_PARENTS.find((ip) => ip.id === p.id);
          return {
            ...p,
            avatarUrl: p.avatarUrl || init?.avatarUrl,
            location: p.location || init?.location,
          };
        });
      }
      return INITIAL_PARENTS;
    } catch {
      return INITIAL_PARENTS;
    }
  });

  const [designatedHall, setDesignatedHall] = useState<DesignatedHallLocation>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_designated_hall`);
      return saved ? JSON.parse(saved) : PRESET_HALL_LOCATIONS[0];
    } catch {
      return PRESET_HALL_LOCATIONS[0];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_parents`, JSON.stringify(parents));
    } catch {}
  }, [parents]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_designated_hall`, JSON.stringify(designatedHall));
    } catch {}
  }, [designatedHall]);

  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activity`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_EVENTS;
    } catch {
      return INITIAL_ACTIVITY_EVENTS;
    }
  });

  const [selectedParentStudentId, setSelectedParentStudentIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_parent_stud_id`) || 'stud-3';
    } catch {
      return 'stud-3';
    }
  });

  const setSelectedParentStudentId = (id: string) => {
    setSelectedParentStudentIdState(id);
    try {
      localStorage.setItem(`${STORAGE_KEY}_parent_stud_id`, id);
    } catch {}
  };

  // Modals
  const [checkInModalOpen, setCheckInModalOpen] = useState<boolean>(false);
  const [checkOutModalOpen, setCheckOutModalOpen] = useState<boolean>(false);
  const [selectedSessionForCheckOut, setSelectedSessionForCheckOut] = useState<Session | null>(null);
  const [runningLateModalOpen, setRunningLateModalOpen] = useState<boolean>(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<boolean>(false);
  const [selectedSessionForReschedule, setSelectedSessionForReschedule] = useState<Session | null>(null);
  const [parentPreviewModalOpen, setParentPreviewModalOpen] = useState<boolean>(false);
  const [selectedSessionForParentPreview, setSelectedSessionForParentPreview] = useState<Session | null>(null);


  const openParentPreviewForSession = (session: Session) => {
    sound.playClick();
    setSelectedSessionForParentPreview(session);
    setParentPreviewModalOpen(true);
  };

  // Demo Mode State & Controls
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_demo_mode`) === 'true';
    } catch {
      return false;
    }
  });

  const loadDemoData = () => {
    setIsDemoMode(true);
    try {
      localStorage.setItem(`${STORAGE_KEY}_demo_mode`, 'true');
    } catch {}
    setSessions(DEMO_SESSIONS);
    setBatches((prev) =>
      prev.map((b, i) => ({
        ...b,
        students: i === 0 ? DEMO_STUDENTS : [],
      }))
    );
    setReferralStats(DEMO_REFERRAL_STATS);
    sound.playSuccess();
    showToast({
      type: 'info',
      title: 'Demo Data Loaded',
      description: 'Loaded sample classes, enrolled students, and referral pipeline for demonstration.',
    });
  };

  const resetToCleanState = () => {
    setIsDemoMode(false);
    try {
      localStorage.setItem(`${STORAGE_KEY}_demo_mode`, 'false');
    } catch {}
    setSessions([]);
    setBatches(INITIAL_BATCHES.map((b) => ({ ...b, students: [] })));
    setLeads([]);
    setUpdates([]);
    setReferralStats({
      referralCode: 'RYD-SARAH-2026',
      invitesSent: 0,
      onboardedTeachers: 0,
      bonusEarned: 0,
      pendingBonuses: 0,
      milestoneTarget: 5,
      candidates: [],
    });
    setIsRunningLate(false);
    setRunningLateMinutes(null);
    setRunningLateReason('');
    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Clean 0-Baseline Active',
      description: "Reset to 0 across Today's Classes, Students, Pending Requests, Completed Sessions, Late Arrivals, Referrals, and Rewards (₹0).",
    });
  };

  const toggleDemoMode = () => {
    sound.playClick();
    if (isDemoMode) {
      resetToCleanState();
    } else {
      loadDemoData();
    }
  };

  const [leadModalOpen, setLeadModalOpen] = useState<boolean>(false);
  const [leadModalDefaultType, setLeadModalDefaultType] = useState<'walk_in' | 'enquiry'>('walk_in');

  const openLeadModalWithType = (type: 'walk_in' | 'enquiry') => {
    sound.playClick();
    setLeadModalDefaultType(type);
    setLeadModalOpen(true);
  };
  const [orderWorkbookModalOpen, setOrderWorkbookModalOpen] = useState<boolean>(false);
  const [composeUpdateModalOpen, setComposeUpdateModalOpen] = useState<boolean>(false);
  const [newSessionModalOpen, setNewSessionModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sound sync
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    if (next) sound.playClick();
  };

  const toggleViewMode = () => {
    sound.playClick();
    setViewMode((prev) => (prev === 'mobile' ? 'responsive' : 'mobile'));
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  const dismissSplash = () => {
    setShowSplash(false);
  };

  const replaySplash = () => {
    setShowSplash(true);
    sound.playSplash();
  };

  const setTeacherName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const cleanFirstName = trimmed.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
    const newCode = `RYD-${cleanFirstName || 'FACULTY'}-2026`;
    setTeacher((prev) => ({ ...prev, name: trimmed }));
    setReferralStats((prev) => ({ ...prev, referralCode: newCode }));
    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Faculty Name & Referral Updated',
      description: `Name updated to "${trimmed}". Referral code and QR link updated to ${newCode}.`,
    });
  };

  // =========================================================================
  // REAL-TIME CROSS-DEVICE CLOUD SYNC ENGINE
  // Synchronizes sessions, cohorts, roster enrollments, CRM leads, and teacher
  // progress across all devices (phones, laptops, tablets)
  // =========================================================================
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());
  const isInitialCloudLoadRef = useRef(false);
  const isApplyingRemoteUpdateRef = useRef(false);
  const localTimestampRef = useRef<number>(Date.now());

  // Helper to load remote cloud state into local React state
  const applyRemoteState = useCallback(
    (data: any, remoteTimestamp: number, notifyUser: boolean = true) => {
      isApplyingRemoteUpdateRef.current = true;
      try {
        if (Array.isArray(data.batches)) setBatches(data.batches);
        if (Array.isArray(data.sessions)) {
          // 1:1 Invariance: Active sessions in progress cannot have checkOutTime
          const sanitizedSessions = data.sessions.map((s: any) =>
            s.status === 'checked_in' ? { ...s, checkOutTime: undefined } : s
          );
          setSessions(sanitizedSessions);

          // Reconcile teacher stats strictly based on completed sessions list
          const completedList = sanitizedSessions.filter((s: any) => s.status === 'completed');
          const completedCount = completedList.length;
          const totalHours = completedList.reduce(
            (acc: number, s: any) => acc + (s.teacherHoursLogged || (s.durationMinutes || 90) / 60),
            0
          );
          const totalEarnings = completedList.reduce(
            (acc: number, s: any) => acc + (s.teacherEarnings || ((s.durationMinutes || 90) / 60) * (data.teacher?.hourlyRate || 50)),
            0
          );

          if (data.teacher) {
            setTeacher({
              ...data.teacher,
              totalHoursMonth: +totalHours.toFixed(1),
              totalEarningsMonth: Math.round(totalEarnings),
              classesCompletedThisWeek: completedCount,
            });
          }
        } else if (data.teacher) {
          setTeacher(data.teacher);
        }
        if (Array.isArray(data.leads)) setLeads(data.leads);
        if (Array.isArray(data.updates)) setUpdates(data.updates);
        if (Array.isArray(data.workbookOrders)) setWorkbookOrders(data.workbookOrders);
        if (Array.isArray(data.freeSlots)) setFreeSlots(data.freeSlots);
        if (Array.isArray(data.reviews)) setReviews(data.reviews);
        if (data.referralStats) setReferralStats(data.referralStats);

        localTimestampRef.current = remoteTimestamp;
        setLastSyncedAt(new Date(remoteTimestamp));
        setSyncStatus('synced');

        if (notifyUser) {
          sound.playNotification();
          showToast({
            type: 'info',
            title: 'Live Cloud Sync',
            description: 'Updated with latest sessions, cohorts & studio records from another device.',
          });
        }
      } finally {
        setTimeout(() => {
          isApplyingRemoteUpdateRef.current = false;
        }, 600);
      }
    },
    []
  );

  // 1. Initial Cloud Boot: Fetch the latest global state on startup
  useEffect(() => {
    let isMounted = true;
    setSyncStatus('syncing');

    fetchRemoteStudioState().then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        applyRemoteState(res.data, res.timestamp, false);
      }
      isInitialCloudLoadRef.current = true;
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    });

    return () => {
      isMounted = false;
    };
  }, [applyRemoteState]);

  // 2. Push local state updates to Cloud Storage & LocalStorage
  useEffect(() => {
    // Save to local storage for offline resilience
    try {
      localStorage.setItem(`${STORAGE_KEY}_teacher`, JSON.stringify(reconciledTeacher));
      localStorage.setItem(`${STORAGE_KEY}_batches`, JSON.stringify(batches));
      localStorage.setItem(`${STORAGE_KEY}_sessions`, JSON.stringify(sessions));
      localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
      localStorage.setItem(`${STORAGE_KEY}_updates`, JSON.stringify(updates));
      localStorage.setItem(`${STORAGE_KEY}_workbooks`, JSON.stringify(workbookOrders));
      localStorage.setItem(`${STORAGE_KEY}_slots`, JSON.stringify(freeSlots));
      localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
      localStorage.setItem(`${STORAGE_KEY}_referrals`, JSON.stringify(referralStats));
    } catch {
      // Ignored
    }

    // Guard: Do not push if we haven't loaded initial cloud state yet,
    // or if this update came from a remote sync event
    if (!isInitialCloudLoadRef.current || isApplyingRemoteUpdateRef.current) {
      return;
    }

    setSyncStatus('syncing');
    const newTimestamp = Date.now();
    localTimestampRef.current = newTimestamp;

    const payload = {
      teacher: reconciledTeacher,
      batches,
      sessions,
      leads,
      updates,
      workbookOrders,
      freeSlots,
      reviews,
      referralStats,
    };

    pushRemoteStudioState(payload, (success, syncedTimestamp) => {
      if (success) {
        setSyncStatus('synced');
        setLastSyncedAt(new Date(syncedTimestamp));
        localTimestampRef.current = syncedTimestamp;
      } else {
        setSyncStatus('offline');
      }
    });
  }, [batches, sessions, leads, updates, workbookOrders, freeSlots, reviews, referralStats, teacher]);

  // 3. Real-Time Cross-Device Polling & Window Event Listeners
  useEffect(() => {
    // Multi-tab bus: Instant sync across tabs on same device
    const unsubscribeBus = onOtherTabSync(() => {
      fetchRemoteStudioState().then((res) => {
        if (res.success && res.data && res.timestamp > localTimestampRef.current) {
          applyRemoteState(res.data, res.timestamp, true);
        }
      });
    });

    // Cloud Polling Loop: Check every 3.5s when tab is active
    const pollInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;

      fetchRemoteStudioState().then((res) => {
        if (res.success && res.data && res.timestamp > localTimestampRef.current) {
          applyRemoteState(res.data, res.timestamp, true);
        }
      });
    }, 3500);

    // Immediate sync when tab becomes visible or receives focus
    const handleFocusOrVisible = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchRemoteStudioState().then((res) => {
          if (res.success && res.data && res.timestamp > localTimestampRef.current) {
            applyRemoteState(res.data, res.timestamp, true);
          }
        });
      }
    };

    // When network reconnects
    const handleOnline = () => {
      setSyncStatus('syncing');
      fetchRemoteStudioState().then((res) => {
        if (res.success && res.data) {
          if (res.timestamp > localTimestampRef.current) {
            applyRemoteState(res.data, res.timestamp, true);
          } else {
            setSyncStatus('synced');
          }
        }
      });
    };

    window.addEventListener('visibilitychange', handleFocusOrVisible);
    window.addEventListener('focus', handleFocusOrVisible);
    window.addEventListener('online', handleOnline);

    return () => {
      unsubscribeBus();
      clearInterval(pollInterval);
      window.removeEventListener('visibilitychange', handleFocusOrVisible);
      window.removeEventListener('focus', handleFocusOrVisible);
      window.removeEventListener('online', handleOnline);
    };
  }, [applyRemoteState]);

  // 4. Manual Sync Trigger (Button in Navbar)
  const triggerCloudSync = async () => {
    sound.playClick();
    setSyncStatus('syncing');
    try {
      const res = await fetchRemoteStudioState();
      if (res.success && res.data) {
        applyRemoteState(res.data, res.timestamp, false);
        showToast({
          type: 'success',
          title: 'All Devices in Sync',
          description: 'Latest studio sessions, batches, and records synchronized across all devices.',
        });
      } else {
        const payload = {
          teacher,
          batches,
          sessions,
          leads,
          updates,
          workbookOrders,
          freeSlots,
          reviews,
          referralStats,
        };
        pushRemoteStudioState(payload, (success, syncedTimestamp) => {
          setSyncStatus(success ? 'synced' : 'offline');
          setLastSyncedAt(new Date(syncedTimestamp));
          showToast({
            type: success ? 'success' : 'alert',
            title: success ? 'Pushed to Cloud' : 'Sync Offline',
            description: success
              ? 'Local records successfully published to global cloud for all devices.'
              : 'Could not reach cloud service. Changes are stored locally.',
          });
        });
      }
    } catch {
      setSyncStatus('error');
    }
  };

  // 1:1 Invariance: Active session is derived directly from sessions array.
  // Exactly ONE session can ever have status === 'checked_in'.
  const checkedInSession = sessions.find((s) => s.status === 'checked_in') || null;
  const isCheckedIn = !!checkedInSession;
  const checkedInSessionId = checkedInSession?.id || null;
  const checkInTime = checkedInSession?.checkInTime || null;

  // Reconciled teacher metrics strictly calculated from completed sessions
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const actualCompletedCount = completedSessions.length;
  const actualHours = completedSessions.reduce(
    (sum, s) => sum + (s.teacherHoursLogged || (s.durationMinutes || 90) / 60),
    0
  );
  const actualEarnings = completedSessions.reduce(
    (sum, s) => sum + (s.teacherEarnings || ((s.durationMinutes || 90) / 60) * (teacher.hourlyRate || 500)),
    0
  );

  const reconciledTeacher: TeacherProfile = {
    ...teacher,
    hourlyRate: 500,
    totalHoursMonth: +actualHours.toFixed(1),
    totalEarningsMonth: Math.round(actualEarnings),
    classesCompletedThisWeek: actualCompletedCount,
    rating: actualCompletedCount > 0 ? (teacher.rating > 0 ? teacher.rating : 5.0) : 0,
  };

  // 7 Core Dynamic Operational Metrics (0-baseline for new account)
  const todaysClassesCount = sessions.filter(
    (s) => (s.date === '2026-09-10' || s.date === new Date().toISOString().split('T')[0]) &&
      (s.status === 'scheduled' || s.status === 'checked_in')
  ).length;

  const studentsCount = batches.reduce((sum, b) => sum + b.students.length, 0);

  const pendingRequestsCount = sessions.filter(
    (s) => s.rescheduleState === 'pending_parent_approval'
  ).length;

  const completedSessionsCount = actualCompletedCount;

  const lateArrivalsCount =
    sessions.filter((s) => s.isLateArrival).length + (isRunningLate ? 1 : 0);

  const referralsCount = referralStats.candidates.length;

  const rewardsINR = Math.round(actualEarnings) + (referralStats.bonusEarned || 0);

  // 3-Persona Action Helpers & Role Hierarchy Guard
  const loginAsRole = (role: UserRole, studentId?: string) => {
    // If already authenticated and not admin, block switching personas directly
    if (isAuthenticated && currentAuthRole !== 'admin') {
      sound.playAlert();
      showToast({
        type: 'alert',
        title: 'Access Restricted',
        description: `Only Admin (Head of Platform) can switch roles. As a ${currentAuthRole}, you can only view your own page. Please log out to change accounts.`,
      });
      return;
    }

    sound.playClick();
    const matchedUser = DEMO_AUTH_USERS.find((u) => u.role === role) || DEMO_AUTH_USERS[0];
    const { password: _, ...authData } = matchedUser;
    setCurrentUser(authData);
    setIsAuthenticated(true);
    setCurrentAuthRole(role);
    setActiveRoleState(role);
    setActiveTabState('home');
    try {
      localStorage.setItem(`${STORAGE_KEY}_is_auth`, 'true');
      localStorage.setItem(`${STORAGE_KEY}_auth_user`, JSON.stringify(authData));
      localStorage.setItem(`${STORAGE_KEY}_auth_role`, role);
      localStorage.setItem(`${STORAGE_KEY}_active_role`, role);
    } catch {}
    if (studentId) {
      setSelectedParentStudentId(studentId);
    }
    if (role === 'tutor') {
      loginTutor();
    }
    setRoleGatewayModalOpen(false);
    showToast({
      type: 'info',
      title: `Signed In as ${role === 'admin' ? '👑 Admin (Head of Platform)' : role === 'tutor' ? '🧑‍🏫 Faculty Tutor' : '👨‍👩‍👧 Parent & Student'}`,
      description: role === 'admin' ? 'Admin has head access to view and control all 3 portals.' : `You are restricted to your dedicated ${role.toUpperCase()} UI only.`,
    });
  };

  const logoutAuth = () => {
    sound.playClick();
    logout();
  };

  const loginWithCredentials = (
    email: string,
    password: string,
    role?: UserRole
  ): { success: boolean; error?: string; isPendingApproval?: boolean; isNewAccess?: boolean; isDeclined?: boolean } => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = authorizedUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (user) {
      if (!user.isAuthorized) {
        sound.playAlert();
        return {
          success: false,
          error: 'Access Denied: Your account authorization has been revoked by the Admin. Please contact admin@ryd.studio.',
          isDeclined: true,
        };
      }

      if (user.password !== password) {
        sound.playAlert();
        return { success: false, error: 'Incorrect password. Please check your password or click Forgot Password.' };
      }

    sound.playSuccess();
    const { password: _, ...authData } = user;
    setCurrentUser(authData);
    setIsAuthenticated(true);
    setCurrentAuthRole(authData.role);
    setActiveRoleState(authData.role);
    setActiveTabState('home');

    if (authData.studentId) {
      setSelectedParentStudentId(authData.studentId);
    }
    if (authData.role === 'tutor') {
      loginTutor();
    } else {
      addActivityEvent({
        type: 'login',
        actorId: authData.id,
        actorName: authData.name,
        actorRole: authData.role,
        title: `${authData.role === 'admin' ? 'Admin' : 'Parent'} Online & Signed In`,
        description: `${authData.name} logged into the ${authData.role === 'admin' ? 'Executive Director' : 'Parent'} portal.`,
      });
    }

    try {
      localStorage.setItem(`${STORAGE_KEY}_is_auth`, 'true');
      localStorage.setItem(`${STORAGE_KEY}_auth_user`, JSON.stringify(authData));
      localStorage.setItem(`${STORAGE_KEY}_auth_role`, authData.role);
      localStorage.setItem(`${STORAGE_KEY}_active_role`, authData.role);
    } catch {}

    showToast({
      type: 'success',
      title: `Welcome, ${authData.name}!`,
      description: `Signed in as ${authData.title}.`,
    });

    return { success: true };
  }

  // 2. Check if an access request was submitted
  const existingReq = accessRequests.find(
    (r) => r.email.toLowerCase() === trimmedEmail
  );

  if (existingReq) {
    if (existingReq.status === 'pending') {
      sound.playAlert();
      return {
        success: false,
        error: `Access Request Pending: Your request to log in as ${existingReq.role.toUpperCase()} has been submitted to the Admin. Please wait for the Admin to agree and grant your access before logging in.`,
        isPendingApproval: true,
      };
    }
    if (existingReq.status === 'declined') {
      sound.playAlert();
      return {
        success: false,
        error: 'Access Denied: Your access request was reviewed and declined by the Admin. Please contact admin@ryd.studio.',
        isDeclined: true,
      };
    }
  }

  // 3. Admin credentials must be pre-authorized
  if (role === 'admin') {
    sound.playAlert();
    return {
      success: false,
      error: 'Access Denied: Unrecognized Administrator credentials. Please contact the platform owner.',
    };
  }

  // 4. New member trying to log in as tutor or parent
  sound.playAlert();
  return {
    success: false,
    error: 'Account not recognized. If you are a new Tutor or Parent, please submit an access request to the Admin for approval.',
    isNewAccess: true,
  };
};

  const loginWithGoogle = (account: {
    name: string;
    email: string;
    avatarUrl?: string;
    role: UserRole;
  }): { success: boolean; error?: string } => {
    const trimmedEmail = account.email.trim().toLowerCase();
    const user = authorizedUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!user) {
      sound.playAlert();
      showToast({
        type: 'alert',
        title: 'Google Access Denied',
        description: `The Google account (${account.email}) has not been authorized by the Admin. Only pre-approved accounts can access RYD STUDIO.`,
      });
      return {
        success: false,
        error: `Access Denied: Google account (${account.email}) is not authorized by the Admin.`,
      };
    }

    if (!user.isAuthorized) {
      sound.playAlert();
      showToast({
        type: 'alert',
        title: 'Google Access Revoked',
        description: `Access for ${account.email} has been revoked by the Admin.`,
      });
      return {
        success: false,
        error: `Access Denied: Your account authorization has been revoked by the Admin.`,
      };
    }

    sound.playSuccess();
    const authData: AuthUser = {
      id: user.id,
      name: user.name || account.name,
      email: user.email,
      avatarUrl: account.avatarUrl || user.avatarUrl,
      role: user.role,
      title: user.title,
      studentId: user.studentId,
    };

    setCurrentUser(authData);
    setIsAuthenticated(true);
    setCurrentAuthRole(authData.role);
    setActiveRoleState(authData.role);
    setActiveTabState('home');

    if (authData.studentId) {
      setSelectedParentStudentId(authData.studentId);
    }
    if (authData.role === 'tutor') {
      loginTutor();
    } else {
      addActivityEvent({
        type: 'login',
        actorId: authData.id,
        actorName: authData.name,
        actorRole: authData.role,
        title: `${authData.role === 'admin' ? 'Admin' : 'Parent'} Online (Google)`,
        description: `${authData.name} logged in via Google Authentication.`,
      });
    }

    try {
      localStorage.setItem(`${STORAGE_KEY}_is_auth`, 'true');
      localStorage.setItem(`${STORAGE_KEY}_auth_user`, JSON.stringify(authData));
      localStorage.setItem(`${STORAGE_KEY}_auth_role`, authData.role);
      localStorage.setItem(`${STORAGE_KEY}_active_role`, authData.role);
    } catch {}

    showToast({
      type: 'success',
      title: `Google Sign-In: ${authData.name}`,
      description: `Authenticated via Google as ${authData.role.toUpperCase()}.`,
    });

    return { success: true };
  };

  const updateMyCredentials = (
    newEmail: string,
    newPassword?: string,
    currentPassword?: string,
    newName?: string
  ): { success: boolean; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'No authenticated user session found.' };
    }

    const trimmedNewEmail = newEmail.trim().toLowerCase();
    if (!trimmedNewEmail || !trimmedNewEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const trimmedName = newName && newName.trim().length >= 2 ? newName.trim() : currentUser.name;

    // Find the record of the currently authenticated user in authorizedUsers
    const userIndex = authorizedUsers.findIndex(
      (u) => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()
    );
    if (userIndex === -1) {
      return { success: false, error: 'User record not found in system.' };
    }

    const targetUser = authorizedUsers[userIndex];

    // Verify current password
    if (!currentPassword || currentPassword !== targetUser.password) {
      sound.playAlert();
      return {
        success: false,
        error: 'Current password verification failed. Please enter your correct current password.',
      };
    }

    // Check if new email is taken by someone else
    const duplicateEmail = authorizedUsers.find(
      (u, idx) => idx !== userIndex && u.email.toLowerCase() === trimmedNewEmail
    );
    if (duplicateEmail) {
      sound.playAlert();
      return { success: false, error: 'This email is already registered to another account.' };
    }

    // Validate new password if provided
    if (newPassword && newPassword.trim().length < 4) {
      sound.playAlert();
      return { success: false, error: 'New password must be at least 4 characters long.' };
    }

    const updatedUser: AuthorizedUser = {
      ...targetUser,
      name: trimmedName,
      email: trimmedNewEmail,
      password: newPassword ? newPassword.trim() : targetUser.password,
    };

    const nextAuthorizedUsers = [...authorizedUsers];
    nextAuthorizedUsers[userIndex] = updatedUser;
    setAuthorizedUsers(nextAuthorizedUsers);

    // Update currentUser state
    const nextCurrentUser: AuthUser = {
      ...currentUser,
      name: trimmedName,
      email: trimmedNewEmail,
    };
    setCurrentUser(nextCurrentUser);

    try {
      localStorage.setItem(`${STORAGE_KEY}_authorized_users`, JSON.stringify(nextAuthorizedUsers));
      localStorage.setItem(`${STORAGE_KEY}_auth_user`, JSON.stringify(nextCurrentUser));
    } catch {}

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Profile & Credentials Updated',
      description: 'Your profile name, login email, and security credentials were saved successfully.',
    });

    return { success: true };
  };

  const updateAdminProfileName = (newName: string): { success: boolean; error?: string } => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed.length < 2) {
      sound.playAlert();
      return { success: false, error: 'Profile name must be at least 2 characters long.' };
    }

    if (!currentUser) {
      return { success: false, error: 'No active session found.' };
    }

    const userIndex = authorizedUsers.findIndex(
      (u) => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()
    );

    const nextAuthorizedUsers = [...authorizedUsers];
    if (userIndex !== -1) {
      nextAuthorizedUsers[userIndex] = {
        ...nextAuthorizedUsers[userIndex],
        name: trimmed,
      };
      setAuthorizedUsers(nextAuthorizedUsers);
      try {
        localStorage.setItem(`${STORAGE_KEY}_authorized_users`, JSON.stringify(nextAuthorizedUsers));
      } catch {}
    }

    const nextCurrentUser: AuthUser = {
      ...currentUser,
      name: trimmed,
    };
    setCurrentUser(nextCurrentUser);
    try {
      localStorage.setItem(`${STORAGE_KEY}_auth_user`, JSON.stringify(nextCurrentUser));
    } catch {}

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Profile Name Changed',
      description: `Your profile name is now set to "${trimmed}".`,
    });

    return { success: true };
  };

  const requestPasswordReset = (email: string): { success: boolean; error?: string; otpCode?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = authorizedUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      sound.playAlert();
      return {
        success: false,
        error: 'No authorized account found with this email. Please contact the administrator.',
      };
    }

    if (!user.isAuthorized) {
      sound.playAlert();
      return {
        success: false,
        error: 'This account authorization has been revoked by the Admin. Cannot reset password.',
      };
    }

    // Generate random 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    passwordResetTokens.current[trimmedEmail] = {
      code: otp,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };

    sound.playSuccess();
    return { success: true, otpCode: otp };
  };

  const resetPasswordWithCode = (
    email: string,
    code: string,
    newPassword: string
  ): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCode = code.trim();

    const token = passwordResetTokens.current[trimmedEmail];
    if (!token || token.code !== trimmedCode || Date.now() > token.expiresAt) {
      sound.playAlert();
      return { success: false, error: 'Invalid or expired 6-digit verification code.' };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      sound.playAlert();
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const userIndex = authorizedUsers.findIndex((u) => u.email.toLowerCase() === trimmedEmail);
    if (userIndex === -1) {
      sound.playAlert();
      return { success: false, error: 'Account record could not be found.' };
    }

    const nextAuthorizedUsers = [...authorizedUsers];
    nextAuthorizedUsers[userIndex] = {
      ...nextAuthorizedUsers[userIndex],
      password: newPassword.trim(),
    };
    setAuthorizedUsers(nextAuthorizedUsers);

    delete passwordResetTokens.current[trimmedEmail];

    try {
      localStorage.setItem(`${STORAGE_KEY}_authorized_users`, JSON.stringify(nextAuthorizedUsers));
    } catch {}

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Password Reset Successful',
      description: 'Your password has been updated. You can now sign in with your new credentials.',
    });

    return { success: true };
  };

  const authorizeNewUser = (user: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    title?: string;
    phone?: string;
    subjects?: string;
    studentId?: string;
  }): { success: boolean; error?: string } => {
    const trimmedEmail = user.email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const exists = authorizedUsers.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, error: 'An authorized account already exists for this email.' };
    }

    const assignedPassword = user.password && user.password.trim() ? user.password.trim() : 'ryd2026';
    const assignedTitle =
      user.title?.trim() ||
      (user.role === 'admin'
        ? 'Authorized Executive'
        : user.role === 'tutor'
        ? (user.subjects?.trim() || 'Faculty Tutor')
        : 'Parent & Learner');

    const newUser: AuthorizedUser = {
      id: `user-auth-${Date.now()}`,
      name: user.name.trim(),
      email: trimmedEmail,
      role: user.role,
      password: assignedPassword,
      title: assignedTitle,
      studentId: user.studentId || (user.role === 'parent' ? 'stud-3' : undefined),
      avatarUrl:
        user.role === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : user.role === 'tutor'
          ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isAuthorized: true,
      authorizedAt: new Date().toISOString().split('T')[0],
      authorizedBy: currentUser?.email || 'admin@ryd.studio',
    };

    const nextList = [newUser, ...authorizedUsers];
    setAuthorizedUsers(nextList);

    try {
      localStorage.setItem(`${STORAGE_KEY}_authorized_users`, JSON.stringify(nextList));
    } catch {}

    // Synchronize into tutors or parents list if tutor or parent
    if (user.role === 'tutor') {
      setTutors((prev) => {
        const alreadyExists = prev.some((t) => t.email.toLowerCase() === trimmedEmail);
        if (alreadyExists) return prev;
        const newTutor: TutorAccount = {
          id: `tutor-${Date.now()}`,
          name: user.name.trim(),
          email: trimmedEmail,
          subjects: [user.subjects?.trim() || user.title?.trim() || 'Multi-Discipline Faculty'],
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          hourlyRate: 850,
          phone: user.phone?.trim() || '+1 (555) 300-8800',
          rating: 5.0,
          status: 'offline',
          totalHoursMonth: 0,
          totalEarningsMonth: 0,
          location: {
            lat: 40.7128,
            lng: -74.0060,
            locationName: 'RYD Downtown Hub',
            area: 'Downtown Studio',
            status: 'off_duty',
            lastPingTime: 'Just Now',
            isWithinGeofence: false,
          },
        };
        const updated = [newTutor, ...prev];
        try {
          localStorage.setItem(`${STORAGE_KEY}_tutors`, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } else if (user.role === 'parent') {
      setParents((prev) => {
        const alreadyExists = prev.some((p) => p.email.toLowerCase() === trimmedEmail);
        if (alreadyExists) return prev;
        const newParent: ParentAccount = {
          id: `parent-${Date.now()}`,
          parentName: user.name.trim(),
          email: trimmedEmail,
          phone: user.phone?.trim() || '+1 (555) 400-9900',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          children: [
            {
              studentId: 'stud-new-' + Date.now(),
              studentName: user.title?.trim() || 'Student',
              grade: 'Active Learner',
              enrolledBatches: ['batch-dance-01'],
            },
          ],
        };
        const updated = [newParent, ...prev];
        try {
          localStorage.setItem(`${STORAGE_KEY}_parents`, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    addActivityEvent({
      type: 'access_granted',
      actorId: currentUser?.id || 'admin',
      actorName: currentUser?.name || 'Admin',
      actorRole: 'admin',
      title: `User Added & Credentials Granted: ${newUser.name} (${newUser.role.toUpperCase()})`,
      description: `Admin added ${newUser.name} (${newUser.email}) with granted login credentials.`,
    });

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'User Added & Credentials Granted',
      description: `${newUser.name} (${newUser.email}) added as ${newUser.role.toUpperCase()} with active credentials.`,
    });

    return { success: true };
  };

  const updateUserCredentials = (
    userId: string,
    updates: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      title?: string;
      phone?: string;
      isAuthorized?: boolean;
    }
  ): { success: boolean; error?: string } => {
    const userIndex = authorizedUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User account not found.' };
    }

    const currentTarget = authorizedUsers[userIndex];
    let newEmail = currentTarget.email;
    if (updates.email && updates.email.trim()) {
      const trimmed = updates.email.trim().toLowerCase();
      if (!trimmed.includes('@')) {
        return { success: false, error: 'Please provide a valid email address.' };
      }
      if (trimmed !== currentTarget.email.toLowerCase()) {
        const conflict = authorizedUsers.some(
          (u) => u.id !== userId && u.email.toLowerCase() === trimmed
        );
        if (conflict) {
          return { success: false, error: 'This email is already used by another account.' };
        }
        newEmail = trimmed;
      }
    }

    const updatedUser: AuthorizedUser = {
      ...currentTarget,
      name: updates.name?.trim() || currentTarget.name,
      email: newEmail,
      role: updates.role || currentTarget.role,
      password: updates.password?.trim() ? updates.password.trim() : currentTarget.password,
      title: updates.title?.trim() || currentTarget.title,
      isAuthorized: updates.isAuthorized !== undefined ? updates.isAuthorized : currentTarget.isAuthorized,
    };

    const nextAuthUsers = [...authorizedUsers];
    nextAuthUsers[userIndex] = updatedUser;
    setAuthorizedUsers(nextAuthUsers);

    try {
      localStorage.setItem(`${STORAGE_KEY}_authorized_users`, JSON.stringify(nextAuthUsers));
    } catch {}

    // Synchronize with tutors if tutor
    if (updatedUser.role === 'tutor') {
      setTutors((prev) => {
        const updated = prev.map((t) => {
          if (t.email.toLowerCase() === currentTarget.email.toLowerCase()) {
            return {
              ...t,
              name: updatedUser.name,
              email: updatedUser.email,
              subjects: updates.title ? [updates.title] : t.subjects,
              phone: updates.phone || t.phone,
            };
          }
          return t;
        });
        try {
          localStorage.setItem(`${STORAGE_KEY}_tutors`, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } else if (updatedUser.role === 'parent') {
      setParents((prev) => {
        const updated = prev.map((p) => {
          if (p.email.toLowerCase() === currentTarget.email.toLowerCase()) {
            return {
              ...p,
              parentName: updatedUser.name,
              email: updatedUser.email,
              phone: updates.phone || p.phone,
            };
          }
          return p;
        });
        try {
          localStorage.setItem(`${STORAGE_KEY}_parents`, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    // If currently logged in user was modified, update currentUser state
    if (currentUser?.id === userId || currentUser?.email.toLowerCase() === currentTarget.email.toLowerCase()) {
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updatedUser));
      } catch {}
    }

    addActivityEvent({
      type: 'access_granted',
      actorId: currentUser?.id || 'admin',
      actorName: currentUser?.name || 'Admin',
      actorRole: 'admin',
      title: `Credentials Granted: ${updatedUser.name}`,
      description: `Admin updated and granted new login credentials for ${updatedUser.name} (${updatedUser.email}) as ${updatedUser.role.toUpperCase()}.`,
    });

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Credentials Updated & Granted',
      description: `Granted credentials for ${updatedUser.name} (${updatedUser.email}).`,
    });

    return { success: true };
  };

  const toggleUserAuthorization = (userId: string): { success: boolean; error?: string } => {
    const userIndex = authorizedUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }

    const targetUser = authorizedUsers[userIndex];
    if (targetUser.id === 'user-admin' || targetUser.email.toLowerCase() === 'admin@ryd.studio') {
      return { success: false, error: 'Cannot revoke access for the primary Administrator account.' };
    }

    const nextAuthorizedUsers = [...authorizedUsers];
    const newStatus = !targetUser.isAuthorized;
    nextAuthorizedUsers[userIndex] = {
      ...targetUser,
      isAuthorized: newStatus,
    };
    setAuthorizedUsers(nextAuthorizedUsers);

    try {
      localStorage.setItem(`${STORAGE_KEY}_authorized_users`, JSON.stringify(nextAuthorizedUsers));
    } catch {}

    sound.playSuccess();
    showToast({
      type: newStatus ? 'success' : 'alert',
      title: newStatus ? 'Access Restored' : 'Access Revoked',
      description: `${targetUser.name}'s platform access is now ${newStatus ? 'AUTHORIZED' : 'REVOKED'}.`,
    });

    return { success: true };
  };

  const deleteUser = (userId: string): { success: boolean; error?: string } => {
    const userIndex = authorizedUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }

    const targetUser = authorizedUsers[userIndex];
    if (targetUser.id === 'user-admin' || targetUser.email.toLowerCase() === 'admin@ryd.studio') {
      return { success: false, error: 'Cannot delete the primary Administrator account.' };
    }

    const nextAuthorizedUsers = authorizedUsers.filter((u) => u.id !== userId);
    setAuthorizedUsers(nextAuthorizedUsers);

    // Also remove corresponding tutor or parent records if present
    setTutors((prev) => {
      const next = prev.filter(
        (t) => t.id !== userId && t.email.toLowerCase() !== targetUser.email.toLowerCase()
      );
      try {
        localStorage.setItem(`${STORAGE_KEY}_tutors`, JSON.stringify(next));
      } catch {}
      return next;
    });

    setParents((prev) => {
      const next = prev.filter(
        (p) => p.id !== userId && p.email.toLowerCase() !== targetUser.email.toLowerCase()
      );
      try {
        localStorage.setItem(`${STORAGE_KEY}_parents`, JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      localStorage.setItem(`${STORAGE_KEY}_authorized_users`, JSON.stringify(nextAuthorizedUsers));
    } catch {}

    sound.playSuccess();
    showToast({
      type: 'alert',
      title: 'User Deleted',
      description: `${targetUser.name} (${targetUser.email}) has been permanently deleted from the platform.`,
    });

    return { success: true };
  };

  const requestAccess = (requestData: {
    name: string;
    email: string;
    password: string;
    role: 'tutor' | 'parent';
    notes?: string;
    phone?: string;
  }): { success: boolean; error?: string; message?: string } => {
    const trimmedEmail = requestData.email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!requestData.name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!requestData.password || requestData.password.length < 4) {
      return { success: false, error: 'Please set a password with at least 4 characters.' };
    }

    // Check if already authorized
    const existingUser = authorizedUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingUser && existingUser.isAuthorized) {
      return { success: false, error: 'An authorized account already exists for this email. You can sign in directly!' };
    }

    // Check if an access request is already pending
    const existingReq = accessRequests.find((r) => r.email.toLowerCase() === trimmedEmail);
    if (existingReq && existingReq.status === 'pending') {
      return {
        success: false,
        error: 'An access request for this email is already pending Admin review and approval.',
      };
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + new Date().toISOString().split('T')[0] + ')';
    const newReq: AccessRequest = {
      id: 'req-' + Date.now(),
      name: requestData.name.trim(),
      email: trimmedEmail,
      password: requestData.password,
      role: requestData.role,
      notes: requestData.notes?.trim() || `New ${requestData.role} onboarding request`,
      phone: requestData.phone?.trim() || '',
      status: 'pending',
      requestedAt: nowStr,
    };

    const nextReqs = [newReq, ...accessRequests.filter((r) => r.email.toLowerCase() !== trimmedEmail)];
    setAccessRequests(nextReqs);
    try {
      localStorage.setItem(`${STORAGE_KEY}_access_requests`, JSON.stringify(nextReqs));
    } catch {}

    // Dispatch activity event and internal system update to alert Admin
    addActivityEvent({
      type: 'access_request',
      actorId: newReq.id,
      actorName: newReq.name,
      actorRole: newReq.role,
      title: `New ${newReq.role.toUpperCase()} Access Request: ${newReq.name}`,
      description: `${newReq.name} (${newReq.email}) submitted an access request to log in as ${newReq.role}. Requires Admin agreement to grant access.`,
    });

    const adminAlert: UpdateMessage = {
      id: 'update-' + Date.now(),
      type: 'broadcast',
      recipientName: 'Executive Director (Admin)',
      batchName: 'Admin Authorization Gate',
      subject: `🔐 New ${newReq.role.toUpperCase()} Access Request: ${newReq.name}`,
      message: `${newReq.name} (${newReq.email}) has requested platform access with new credentials. Go to Access Control in the Admin Portal to grant or decline access.`,
      sentAt: 'Just Now',
      status: 'delivered',
      channels: ['app'],
    };
    setUpdates((prev) => [adminAlert, ...prev]);

    sound.playSuccess();
    showToast({
      type: 'info',
      title: 'Access Request Sent to Admin!',
      description: `Your request for ${newReq.role.toUpperCase()} access has been submitted. Once the Admin agrees and grants access, you can log in with your credentials.`,
    });

    return {
      success: true,
      message: `Your request has been submitted to the Admin for approval. You will be able to log in with ${newReq.email} once the Admin grants access.`,
    };
  };

  const grantAccessRequest = (requestId: string): { success: boolean; error?: string } => {
    const req = accessRequests.find((r) => r.id === requestId);
    if (!req) {
      return { success: false, error: 'Access request not found.' };
    }

    // 1. Mark request as approved
    const nextReqs = accessRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'approved' as const,
            reviewedAt: new Date().toISOString().split('T')[0],
            reviewedBy: currentUser?.name || 'Admin',
          }
        : r
    );
    setAccessRequests(nextReqs);
    try {
      localStorage.setItem(`${STORAGE_KEY}_access_requests`, JSON.stringify(nextReqs));
    } catch {}

    // 2. Authorize user account in authorizedUsers
    const existingUserIndex = authorizedUsers.findIndex(
      (u) => u.email.toLowerCase() === req.email.toLowerCase()
    );

    let nextAuthUsers: AuthorizedUser[];
    if (existingUserIndex >= 0) {
      nextAuthUsers = [...authorizedUsers];
      nextAuthUsers[existingUserIndex] = {
        ...nextAuthUsers[existingUserIndex],
        name: req.name,
        password: req.password,
        role: req.role,
        isAuthorized: true,
        authorizedAt: new Date().toISOString().split('T')[0],
        authorizedBy: currentUser?.email || 'admin@ryd.studio',
      };
    } else {
      const newAuthUser: AuthorizedUser = {
        id: `user-${req.role}-${Date.now()}`,
        name: req.name,
        email: req.email.toLowerCase(),
        role: req.role,
        password: req.password,
        title: req.role === 'tutor' ? 'Faculty Tutor' : 'Parent & Learner',
        studentId: req.role === 'parent' ? 'stud-3' : undefined,
        avatarUrl:
          req.role === 'tutor'
            ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isAuthorized: true,
        authorizedAt: new Date().toISOString().split('T')[0],
        authorizedBy: currentUser?.email || 'admin@ryd.studio',
      };
      nextAuthUsers = [newAuthUser, ...authorizedUsers];
    }
    setAuthorizedUsers(nextAuthUsers);
    try {
      localStorage.setItem(`${STORAGE_KEY}_authorized_users`, JSON.stringify(nextAuthUsers));
    } catch {}

    // 3. If tutor, ensure tutor account exists in tutors list
    if (req.role === 'tutor') {
      setTutors((prev) => {
        const exists = prev.some((t) => t.email.toLowerCase() === req.email.toLowerCase());
        if (exists) return prev;
        const newTutor: TutorAccount = {
          id: `tutor-${Date.now()}`,
          name: req.name,
          email: req.email,
          subjects: [req.notes || 'Multi-Tutoring Faculty'],
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          hourlyRate: 850,
          phone: req.phone || '+1 (555) 300-8800',
          rating: 5.0,
          status: 'offline',
          totalHoursMonth: 0,
          totalEarningsMonth: 0,
          location: {
            lat: 40.7128,
            lng: -74.0060,
            locationName: 'RYD Downtown Hub',
            area: 'Downtown Studio',
            status: 'off_duty',
            lastPingTime: 'Just Now',
            isWithinGeofence: false,
          },
        };
        const updated = [newTutor, ...prev];
        try {
          localStorage.setItem(`${STORAGE_KEY}_tutors`, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } else if (req.role === 'parent') {
      setParents((prev) => {
        const exists = prev.some((p) => p.email.toLowerCase() === req.email.toLowerCase());
        if (exists) return prev;
        const newParent: ParentAccount = {
          id: `parent-${Date.now()}`,
          parentName: req.name,
          email: req.email,
          phone: req.phone || '+1 (555) 400-9900',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          children: [
            {
              studentId: 'stud-new-' + Date.now(),
              studentName: req.notes ? req.notes.replace(/^Parent of /i, '') : 'Student',
              grade: 'Active Learner',
              enrolledBatches: ['batch-dance-01'],
            },
          ],
        };
        const updated = [newParent, ...prev];
        try {
          localStorage.setItem(`${STORAGE_KEY}_parents`, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    // 4. Activity log and toast
    addActivityEvent({
      type: 'access_granted',
      actorId: currentUser?.id || 'admin',
      actorName: currentUser?.name || 'Admin',
      actorRole: 'admin',
      title: `Access Agreed & Granted: ${req.name} (${req.role.toUpperCase()})`,
      description: `Admin agreed and granted platform access to ${req.name} (${req.email}). Member can now log in with their credentials.`,
    });

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Access Agreed & Granted!',
      description: `${req.name} (${req.email}) has been authorized. They can now log in with their credentials.`,
    });

    return { success: true };
  };

  const declineAccessRequest = (requestId: string): { success: boolean; error?: string } => {
    const req = accessRequests.find((r) => r.id === requestId);
    if (!req) {
      return { success: false, error: 'Access request not found.' };
    }

    const nextReqs = accessRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'declined' as const,
            reviewedAt: new Date().toISOString().split('T')[0],
            reviewedBy: currentUser?.name || 'Admin',
          }
        : r
    );
    setAccessRequests(nextReqs);
    try {
      localStorage.setItem(`${STORAGE_KEY}_access_requests`, JSON.stringify(nextReqs));
    } catch {}

    sound.playClick();
    showToast({
      type: 'alert',
      title: 'Access Request Declined',
      description: `Request for ${req.name} (${req.email}) has been declined. Member cannot log in.`,
    });

    return { success: true };
  };

  const deleteAccessRequest = (requestId: string): { success: boolean } => {
    const nextReqs = accessRequests.filter((r) => r.id !== requestId);
    setAccessRequests(nextReqs);
    try {
      localStorage.setItem(`${STORAGE_KEY}_access_requests`, JSON.stringify(nextReqs));
    } catch {}
    sound.playClick();
    showToast({
      type: 'info',
      title: 'Request Removed',
      description: 'Access request record deleted.',
    });
    return { success: true };
  };

  const logout = () => {
    sound.playClick();
    if (currentUser) {
      addActivityEvent({
        type: 'logout',
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        title: `${currentUser.role === 'tutor' ? 'Tutor' : currentUser.role === 'parent' ? 'Parent' : 'Admin'} Offline / Logged Out`,
        description: `${currentUser.name} logged out from the portal.`,
      });
      if (currentUser.role === 'tutor') {
        setTutorOnlineStatus('offline');
      }
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentAuthRole('admin');
    setActiveRoleState('admin');
    setActiveTabState('home');
    try {
      localStorage.setItem(`${STORAGE_KEY}_is_auth`, 'false');
      localStorage.removeItem(`${STORAGE_KEY}_auth_user`);
      localStorage.removeItem(`${STORAGE_KEY}_auth_role`);
      localStorage.removeItem(`${STORAGE_KEY}_active_role`);
    } catch {}
    showToast({
      type: 'info',
      title: 'Logged Out Successfully',
      description: 'You have exited the session. Sign in with your persona credentials to continue.',
    });
  };

  const updateDesignatedHall = (updated: Partial<DesignatedHallLocation>) => {
    sound.playSuccess();
    setDesignatedHall((prev) => {
      const next = {
        ...prev,
        ...updated,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        designatedBy: currentUser?.name || 'Administrator',
      };
      return next;
    });

    addActivityEvent({
      type: 'announcement',
      actorId: currentUser?.id || 'admin-root',
      actorName: currentUser?.name || 'Admin Coordinator',
      actorRole: 'admin',
      title: '🏛️ Campus / Hall Location Designated',
      description: `Target venue set to "${updated.name || designatedHall.name}". GPS geofence radius calibrated to ${updated.geofenceRadiusMeters || designatedHall.geofenceRadiusMeters}m on Google Maps.`,
    });

    showToast({
      type: 'success',
      title: '🏛️ Designated Hall Location Updated',
      description: `Venue set to "${updated.name || designatedHall.name}". Telemetry radar and Google Maps recalibrated.`,
    });
  };

  const simulateTutorMovement = () => {
    sound.playClick();
    setTutors((prev) =>
      prev.map((t) => {
        if (t.id === 'tutor-alex' && t.location) {
          const newDistance = Math.max(0.05, Math.round((t.location.distanceKm! - 0.2) * 10) / 10);
          const newEta = Math.max(1, Math.round(t.location.etaMinutes! - 1));
          const isNowOnSite = newDistance <= 0.15;
          return {
            ...t,
            location: {
              ...t.location,
              distanceKm: newDistance,
              etaMinutes: isNowOnSite ? 0 : newEta,
              locationName: isNowOnSite ? `${designatedHall.name} - Academic Wing` : 'Transit - Approaching Campus Ave',
              status: isNowOnSite ? 'on_site' : 'in_transit',
              isWithinGeofence: isNowOnSite,
              lastPingTime: 'Just now',
              speedKmH: isNowOnSite ? 0 : 22,
              batteryLevel: Math.max(10, (t.location.batteryLevel || 80) - 1),
            },
          };
        }
        if (t.location) {
          return {
            ...t,
            location: {
              ...t.location,
              lastPingTime: 'Just now',
            },
          };
        }
        return t;
      })
    );

    setParents((prev) =>
      prev.map((p) => {
        if (p.id === 'parent-elena' && p.location) {
          const newDistance = Math.max(0.05, Math.round((p.location.distanceKm! - 0.15) * 100) / 100);
          const newEta = Math.max(1, Math.round((p.location.etaMinutes || 4) - 1));
          const isNowOnSite = newDistance <= 0.1;
          return {
            ...p,
            location: {
              ...p.location,
              distanceKm: newDistance,
              etaMinutes: isNowOnSite ? 0 : newEta,
              locationName: isNowOnSite ? `${designatedHall.name} - Visitor Parking` : 'Academic Way - Turning towards Main Gate',
              status: isNowOnSite ? 'on_site' : 'in_transit',
              isWithinGeofence: isNowOnSite,
              lastPingTime: 'Just now',
              speedKmH: isNowOnSite ? 0 : 18,
              batteryLevel: Math.max(10, (p.location.batteryLevel || 92) - 1),
            },
          };
        }
        if (p.id === 'parent-david' && p.location) {
          const newDistance = Math.max(0.2, Math.round((p.location.distanceKm! - 0.25) * 100) / 100);
          const newEta = Math.max(2, Math.round((p.location.etaMinutes || 8) - 1));
          return {
            ...p,
            location: {
              ...p.location,
              distanceKm: newDistance,
              etaMinutes: newEta,
              locationName: 'Approaching Academic Boulevard North',
              lastPingTime: 'Just now',
              speedKmH: 26,
              batteryLevel: Math.max(10, (p.location.batteryLevel || 65) - 1),
            },
          };
        }
        if (p.location) {
          return {
            ...p,
            location: {
              ...p.location,
              lastPingTime: 'Just now',
            },
          };
        }
        return p;
      })
    );

    addActivityEvent({
      type: 'announcement',
      actorId: 'system',
      actorName: 'GPS Radar & Hall Dispatch',
      actorRole: 'admin',
      title: '🛰️ Faculty & Parent Live GPS Telemetry Updated',
      description: `Live pings synchronized relative to ${designatedHall.name}. Faculty & parent coordinates and arrival ETAs refreshed.`,
    });

    showToast({
      type: 'info',
      title: '🛰️ GPS Telemetry Ping Broadcasted',
      description: `Live coordinates for tutors & parents updated relative to ${designatedHall.name}.`,
    });
  };

  const pingTutor = (tutorId: string) => {
    sound.playClick();
    const tutor = tutors.find((t) => t.id === tutorId);
    if (!tutor) return;

    showToast({
      type: 'success',
      title: `📍 GPS Ping Sent to ${tutor.name}`,
      description: `Telemetry ping acknowledged. Signal strength: 98% (±3m accuracy).`,
    });
  };

  const pingParent = (parentId: string) => {
    sound.playClick();
    const parent = parents.find((p) => p.id === parentId);
    if (!parent) return;

    showToast({
      type: 'success',
      title: `📍 GPS Ping Sent to ${parent.parentName}`,
      description: `Parent telemetry ping acknowledged. Current ETA: ${parent.location?.etaMinutes ?? 0}m. Signal: 96%.`,
    });
  };

  const setActiveRole = (role: UserRole) => {
    // Admin is the Head: ONLY Admin can switch active view to tutor or parent!
    if (currentAuthRole !== 'admin') {
      sound.playAlert();
      showToast({
        type: 'alert',
        title: 'Access Restricted',
        description: `Only Admin (Head of Platform) can access other role UIs. As a ${currentAuthRole}, you can only view your own pages.`,
      });
      return;
    }
    sound.playClick();
    setActiveRoleState(role);
    setActiveTabState('home');
    try {
      localStorage.setItem(`${STORAGE_KEY}_active_role`, role);
    } catch {}
    showToast({
      type: 'info',
      title: `Admin Viewing: ${role === 'admin' ? '👑 Admin Command' : role === 'tutor' ? '🧑‍🏫 Tutor Faculty Workbench' : '👨‍👩‍👧 Parent & Student Portal'}`,
      description: `Displaying interface preview for ${role.toUpperCase()}.`,
    });
  };

  const setActiveTab = (tab: string) => {
    // Only Admin can navigate between different pages!
    if (currentAuthRole !== 'admin') {
      sound.playAlert();
      showToast({
        type: 'alert',
        title: 'Access Restricted',
        description: `Only Admin (Head of Platform) can access all pages. As a ${currentAuthRole}, you can only view your own page.`,
      });
      return;
    }
    sound.playClick();
    setActiveTabState(tab);
  };

  const addActivityEvent = useCallback((event: Omit<ActivityEvent, 'id' | 'timestamp' | 'readByAdmin' | 'readByParent'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];
    const newEvent: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      date: event.date || dateStr,
      createdAt: now.toISOString(),
      readByAdmin: activeRole === 'admin',
      readByParent: activeRole === 'parent',
    };
    setActivityEvents((prev) => {
      const updated = [newEvent, ...prev.slice(0, 199)];
      try {
        localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [activeRole]);

  const loginTutor = () => {
    sound.playCheckIn();
    setTutorOnlineStatus('online');
    setTutors((prev) => {
      const updated = prev.map((t) =>
        t.id === 'tutor-shazz'
          ? { ...t, status: 'online' as const, lastLoginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : t
      );
      try {
        localStorage.setItem(`${STORAGE_KEY}_tutors`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    addActivityEvent({
      type: 'login',
      actorId: 'tutor-shazz',
      actorName: teacher.name,
      actorRole: 'tutor',
      targetBatchId: 'batch-math-01',
      targetBatchName: 'Advanced Calculus & Vectors',
      title: 'Tutor Online & Shift Started',
      description: `${teacher.name} has logged into the academic hub. Alerts dispatched to Admin & Parents.`,
    });
    showToast({
      type: 'success',
      title: 'Tutor Online (Alerts Dispatched)',
      description: `${teacher.name} is now ONLINE. Instant notifications dispatched to App Owner and all linked Parents.`,
    });
  };

  const logoutTutor = () => {
    sound.playClick();
    setTutorOnlineStatus('offline');
    setTutors((prev) => {
      const updated = prev.map((t) =>
        t.id === 'tutor-shazz'
          ? { ...t, status: 'offline' as const, lastLogoutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : t
      );
      try {
        localStorage.setItem(`${STORAGE_KEY}_tutors`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    addActivityEvent({
      type: 'logout',
      actorId: 'tutor-shazz',
      actorName: teacher.name,
      actorRole: 'tutor',
      title: 'Tutor Offline / Shift Ended',
      description: `${teacher.name} logged out from the academic portal.`,
    });
    showToast({
      type: 'info',
      title: 'Tutor Logged Out (Alerts Dispatched)',
      description: `${teacher.name} is now OFFLINE. Activity logged and notified to Admin & Parents.`,
    });
  };

  const unreadAdminActivityCount = activityEvents.filter((e) => !e.readByAdmin).length;
  const unreadParentActivityCount = activityEvents.filter((e) => !e.readByParent).length;

  const markActivityReadByAdmin = () => {
    setActivityEvents((prev) => {
      const updated = prev.map((e) => ({ ...e, readByAdmin: true }));
      try {
        localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const markActivityReadByParent = () => {
    setActivityEvents((prev) => {
      const updated = prev.map((e) => ({ ...e, readByParent: true }));
      try {
        localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Actions
  const checkIn = (sessionId: string) => {
    // 1:1 Rule Enforcement: For every check-in there must be one and only one check-out.
    // Cannot check in if any session is already checked in.
    const alreadyActive = sessions.find((s) => s.status === 'checked_in');
    if (alreadyActive) {
      sound.playAlert();
      showToast({
        type: 'alert',
        title: 'Active Check-In in Progress',
        description: `1:1 Rule: You are currently checked into "${alreadyActive.batchName}". Complete its one-and-only check-out before starting another class.`,
      });
      return;
    }

    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    if (session.status === 'completed') {
      sound.playAlert();
      showToast({
        type: 'alert',
        title: 'Session Already Completed',
        description: `This session has already been 1:1 checked out (${session.checkInTime} → ${session.checkOutTime}). Each class has one and only one check-out. To run another class, add a new session.`,
      });
      return;
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsRunningLate(false);

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'checked_in',
              checkInTime: timeString,
              checkOutTime: undefined, // Clear any previous checkout timestamp
              calendarCode: generateCalendarCode(s.monthIndex, s.classIndex, 'present'),
            }
          : s
      )
    );

    setTutorOnlineStatus('in_session');
    addActivityEvent({
      type: 'check_in',
      actorId: 'tutor-shazz',
      actorName: teacher.name,
      actorRole: 'tutor',
      targetBatchId: session.batchId,
      targetBatchName: session.batchName,
      title: `Class In-Session: ${session.batchName}`,
      description: `Tutor ${teacher.name} checked in at ${timeString} in ${session.studioRoom}. Student attendance & session timer active.`,
    });

    sound.playCheckIn();
    showToast({
      type: 'success',
      title: 'Checked In Successfully (Alert Dispatched)',
      description: `Active in ${session.batchName} at ${session.studioRoom} (${timeString}). Live notification sent to Admin & Parents.`,
    });
    setCheckInModalOpen(false);
  };

  const openCheckOutForSession = (session: Session) => {
    sound.playClick();
    setSelectedSessionForCheckOut(session);
    setCheckOutModalOpen(true);
  };

  const checkOut = (sessionId: string, attendance: AttendanceRecord[], _notes?: string) => {
    let session = sessions.find((s) => s.id === sessionId);
    if (!session && sessions.length > 0) {
      session = sessions.find((s) => s.status === 'checked_in');
      if (session) sessionId = session.id;
    }
    if (!session) {
      setCheckOutModalOpen(false);
      showToast({
        type: 'alert',
        title: 'No Session Found',
        description: 'Unable to locate session to check out.',
      });
      return;
    }

    // 1:1 Rule Enforcement: Strictly ONLY an active checked-in session can be checked out!
    if (session.status !== 'checked_in') {
      sound.playAlert();
      if (session.status === 'completed') {
        showToast({
          type: 'alert',
          title: 'Already Checked Out (1:1 Rule)',
          description: `This session was already checked out at ${session.checkOutTime}. For one check-in there is one and only one check-out.`,
        });
      } else {
        showToast({
          type: 'alert',
          title: 'Check-In Required First',
          description: `For every check-in there has to be one check-out. Please check into "${session.batchName}" first.`,
        });
        setCheckInModalOpen(true);
      }
      setCheckOutModalOpen(false);
      return;
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hours = (session.durationMinutes || 90) / 60;
    const sessionEarnings = hours * (teacher.hourlyRate || 500);

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'completed',
              checkInTime: s.checkInTime || timeString,
              checkOutTime: timeString,
              studentAttendance: attendance,
              teacherHoursLogged: hours,
              teacherEarnings: sessionEarnings,
              isLateArrival: isRunningLate || s.isLateArrival || false,
            }
          : s
      )
    );

    // Update batch enrolled students' lastAttendance
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== session.batchId) return b;
        return {
          ...b,
          students: b.students.map((stud) => {
            const att = attendance.find((a) => a.studentId === stud.id);
            return att ? { ...stud, lastAttendance: att.status } : stud;
          }),
        };
      })
    );

    // Clear running late state if active
    if (isRunningLate) {
      setIsRunningLate(false);
      setRunningLateMinutes(null);
      setRunningLateReason('');
    }

    setSelectedSessionForCheckOut(null);
    setCheckOutModalOpen(false);
    sound.playSuccess();

    setTutorOnlineStatus('online');
    addActivityEvent({
      type: 'check_out',
      actorId: 'tutor-shazz',
      actorName: teacher.name,
      actorRole: 'tutor',
      targetBatchId: session.batchId,
      targetBatchName: session.batchName,
      title: `Class Completed: ${session.batchName}`,
      description: `Tutor ${teacher.name} checked out at ${timeString}. Attendance logged for ${attendance.length} students. ₹${Math.round(sessionEarnings)} earnings credited.`,
    });

    const presentCount = attendance.filter((a) => a.status === 'present').length;
    showToast({
      type: 'success',
      title: 'Session Checked Out (Alert Dispatched)',
      description: `Logged +${hours} hrs (+₹${sessionEarnings.toLocaleString()}) for ${teacher.name}. Attendance (${presentCount}/${attendance.length}) shared with Parents & Admin.`,
    });
  };

  const reportRunningLate = (minutes: number, reason: string) => {
    setIsRunningLate(true);
    setRunningLateMinutes(minutes);
    setRunningLateReason(reason);

    sound.playAlert();

    const targetSession = checkedInSession || sessions.find((s) => s.status === 'scheduled');
    const batchName = targetSession ? targetSession.batchName : 'Today’s Batches';

    const newUpdate: UpdateMessage = {
      id: 'update-' + Date.now(),
      type: 'broadcast',
      recipientName: `All Parents & Staff (${batchName})`,
      batchName: batchName,
      subject: `Teacher Running ${minutes} Minutes Late - ETA Notice`,
      message: `Coach ${teacher.name} is running ${minutes} minutes late due to: "${reason || 'Transit delay'}". Studio floor is supervised. Class will conclude at the designated schedule.`,
      sentAt: 'Just Now',
      status: 'delivered',
      channels: ['app', 'sms'],
    };

    setUpdates((prev) => [newUpdate, ...prev]);

    setTutorOnlineStatus('running_late');
    addActivityEvent({
      type: 'running_late',
      actorId: 'tutor-shazz',
      actorName: teacher.name,
      actorRole: 'tutor',
      targetBatchName: batchName,
      title: `Tutor Delayed: ${minutes} Minutes`,
      description: `Tutor ${teacher.name} reported running late (${minutes}m) for ${batchName}. Reason: "${reason || 'Transit delay'}".`,
    });

    showToast({
      type: 'alert',
      title: `Late Notice Broadcasted (+${minutes}m)`,
      description: `Notice dispatched to Parents of ${batchName} and App Owner.`,
    });
    setRunningLateModalOpen(false);
  };

  const clearRunningLate = () => {
    setIsRunningLate(false);
    setRunningLateMinutes(null);
    setRunningLateReason('');
    showToast({
      type: 'info',
      title: 'Status Restored',
      description: 'Running late status cleared. Resumed standard studio schedule.',
    });
  };

  const openRescheduleForSession = (session: Session) => {
    setSelectedSessionForReschedule(session);
    setRescheduleModalOpen(true);
  };

  const requestReschedule = (sessionId: string, proposedDate: string, proposedTime: string, reason: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const calendarCode = generateCalendarCode(session.monthIndex, session.classIndex, 'rescheduled');

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'rescheduled',
              rescheduleState: 'pending_parent_approval',
              proposedDate,
              proposedTime,
              rescheduleReason: reason,
              parentNotified: true,
              calendarCode,
            }
          : s
      )
    );

    const newUpdate: UpdateMessage = {
      id: 'update-' + Date.now(),
      type: 'broadcast',
      recipientName: `All Parents (${session.batchName})`,
      batchName: session.batchName,
      subject: `Reschedule Request & Calendar Sync: ${session.batchName}`,
      message: `Class originally set for ${session.date} (${session.timeSlot}) is proposed to reschedule to ${proposedDate} at ${proposedTime}. Reason: ${reason}. Structured Code: ${calendarCode}. Action Required: Please accept in your parent portal.`,
      sentAt: 'Just Now',
      status: 'delivered',
      channels: ['app', 'whatsapp', 'sms'],
    };
    setUpdates((prev) => [newUpdate, ...prev]);

    sound.playCheckIn();
    addActivityEvent({
      type: 'reschedule',
      actorId: 'tutor-shazz',
      actorName: teacher.name,
      actorRole: 'tutor',
      targetBatchId: session.batchId,
      targetBatchName: session.batchName,
      title: `Reschedule Requested: ${session.batchName}`,
      description: `Tutor requested reschedule to ${proposedDate} (${proposedTime}). Reason: "${reason}". Code: ${calendarCode}.`,
    });
    showToast({
      type: 'info',
      title: `Reschedule Request Dispatched (Code: ${calendarCode})`,
      description: `Automated notification sent to Parents & Admin for ${session.batchName}. Pending parent acceptance.`,
    });
    setRescheduleModalOpen(false);
  };

  const acceptReschedule = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session || !session.proposedDate || !session.proposedTime) return;

    const calendarCode = generateCalendarCode(session.monthIndex, session.classIndex, 'rescheduled');
    const newDate = session.proposedDate;
    const newTime = session.proposedTime;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              date: newDate,
              timeSlot: newTime,
              status: 'scheduled',
              rescheduleState: 'confirmed',
              parentAcceptedAt: new Date().toISOString(),
              calendarCode,
            }
          : s
      )
    );

    // Synchronize batch timetable
    setBatches((prev) =>
      prev.map((b) =>
        b.id === session.batchId
          ? { ...b, scheduleTime: newTime }
          : b
      )
    );

    const newUpdate: UpdateMessage = {
      id: 'update-' + Date.now(),
      type: 'broadcast',
      recipientName: `All Parents (${session.batchName})`,
      batchName: session.batchName,
      subject: `Reschedule Confirmed & Synchronized: ${session.batchName}`,
      message: `Parent accepted the reschedule for ${session.batchName}. New confirmed slot: ${newDate} at ${newTime}. Batch schedule and Google Calendar updated (Code: ${calendarCode}).`,
      sentAt: 'Just Now',
      status: 'delivered',
      channels: ['app', 'whatsapp', 'sms'],
    };
    setUpdates((prev) => [newUpdate, ...prev]);

    addActivityEvent({
      type: 'reschedule',
      actorId: 'parent-marcus',
      actorName: 'Marcus Vance (Parent)',
      actorRole: 'parent',
      targetBatchId: session.batchId,
      targetBatchName: session.batchName,
      title: `Reschedule Confirmed: ${session.batchName}`,
      description: `Parent accepted slot change for ${session.batchName} to ${newDate} at ${newTime}. Schedule and Calendar synced.`,
    });

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Reschedule Confirmed & Synchronized',
      description: `New slot for ${session.batchName} confirmed for ${newDate} (${newTime}). Calendar and batch schedule updated.`,
    });
  };

  const declineReschedule = (sessionId: string, reason?: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'scheduled',
              rescheduleState: 'declined',
            }
          : s
      )
    );

    const newUpdate: UpdateMessage = {
      id: 'update-' + Date.now(),
      type: 'broadcast',
      recipientName: `All Parents (${session.batchName})`,
      batchName: session.batchName,
      subject: `Reschedule Declined: ${session.batchName}`,
      message: `Reschedule request for ${session.batchName} was declined. Session remains at original timetable: ${session.date} (${session.timeSlot}). Reason: ${reason || 'Parent conflict'}.`,
      sentAt: 'Just Now',
      status: 'delivered',
      channels: ['app', 'sms'],
    };
    setUpdates((prev) => [newUpdate, ...prev]);

    sound.playAlert();
    showToast({
      type: 'info',
      title: 'Reschedule Request Declined',
      description: `Session reverted to original timetable: ${session.date} (${session.timeSlot}).`,
    });
  };

  const cancelClass = (sessionId: string, reason: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const calendarCode = generateCalendarCode(session.monthIndex, session.classIndex, 'absent');

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'cancelled',
              rescheduleReason: reason,
              parentNotified: true,
              calendarCode,
            }
          : s
      )
    );

    const newUpdate: UpdateMessage = {
      id: 'update-' + Date.now(),
      type: 'broadcast',
      recipientName: `All Parents (${session.batchName})`,
      batchName: session.batchName,
      subject: `Class Cancellation Alert: ${session.batchName}`,
      message: `The class on ${session.date} has been cancelled (${reason}). Code: ${calendarCode}. Makeup credit issued to student accounts.`,
      sentAt: 'Just Now',
      status: 'delivered',
      channels: ['app', 'sms'],
    };
    setUpdates((prev) => [newUpdate, ...prev]);

    sound.playAlert();
    showToast({
      type: 'alert',
      title: `Class Cancelled (Code: ${calendarCode})`,
      description: `Parents notified. Calendar code ${calendarCode} recorded for makeup credit.`,
    });
  };

  const createNewSession = (sessionData: AddSessionParams) => {
    const batch = batches.find((b) => b.id === sessionData.batchId);
    const customName = sessionData.sessionName?.trim() || sessionData.customBatchName?.trim();
    const batchName = customName || (batch ? `${batch.name} (${sessionData.type})` : 'Special Class');
    const disciplineCategory = sessionData.disciplineCategory || batch?.disciplineCategory || 'tuition';
    const locationName = batch ? batch.locationName : (sessionData.locationName || 'RYD Downtown Central');
    const classNum = sessions.length + 1;
    const calendarCode = generateCalendarCode(2, classNum, 'scheduled');

    const newSess: Session = {
      id: 'sess-' + Date.now(),
      batchId: batch ? batch.id : ('custom-' + Date.now()),
      batchName,
      sessionName: customName || batchName,
      disciplineCategory,
      date: sessionData.date || '2026-09-10',
      timeSlot: sessionData.timeSlot,
      studioRoom: sessionData.studioRoom,
      locationName,
      monthIndex: 2,
      classIndex: classNum,
      status: 'scheduled',
      durationMinutes: sessionData.durationMinutes || 90,
      calendarCode,
    };

    setSessions((prev) => [newSess, ...prev]);

    if (sessionData.sendParentNotification) {
      const newUpdate: UpdateMessage = {
        id: 'update-' + Date.now(),
        type: 'broadcast',
        recipientName: `All Parents (${batchName})`,
        batchName,
        subject: `New Class Scheduled: ${batchName}`,
        message: `A new session has been added for ${newSess.date} at ${newSess.timeSlot} in ${newSess.studioRoom}. Structured Calendar Code: ${calendarCode}.`,
        sentAt: 'Just Now',
        status: 'delivered',
        channels: ['app', 'whatsapp', 'sms'],
      };
      setUpdates((prev) => [newUpdate, ...prev]);
    }

    sound.playSuccess();
    showToast({
      type: 'success',
      title: `Class Scheduled (Code: ${calendarCode})`,
      description: `${batchName} scheduled for ${newSess.date} (${newSess.timeSlot}).`,
    });
    setNewSessionModalOpen(false);
  };

  const deleteSession = (sessionId: string) => {
    const sessionToDelete = sessions.find((s) => s.id === sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    sound.playClick();
    showToast({
      type: 'info',
      title: 'Session Removed',
      description: sessionToDelete
        ? `"${sessionToDelete.batchName}" (${sessionToDelete.timeSlot}) has been deleted.`
        : 'Session has been deleted from your schedule.',
    });
  };

  const clearAllSessions = () => {
    setSessions([]);
    sound.playClick();
    showToast({
      type: 'info',
      title: 'All Sessions Cleared',
      description: 'All scheduled sessions for today have been removed.',
    });
  };

  const addNewBatch = (batchData: AddBatchParams) => {
    const batchId = 'batch-' + Date.now();
    const defaultStudents: Student[] = batchData.students && batchData.students.length > 0 ? batchData.students : [];

    const newBatch: Batch = {
      id: batchId,
      name: batchData.name,
      code: batchData.code || ('RYD-' + (batchData.disciplineCategory ? batchData.disciplineCategory.slice(0, 3).toUpperCase() : 'CLS') + '-0' + (batches.length + 1)),
      disciplineCategory: batchData.disciplineCategory || 'tuition',
      style: batchData.style,
      level: batchData.level,
      scheduleTime: batchData.scheduleTime,
      days: batchData.days,
      studioRoom: batchData.studioRoom,
      locationName: batchData.locationName,
      address: batchData.address || '742 Broadway Ave, Floor 3, Downtown',
      mapCoordinates: { lat: 40.7128, lng: -74.0060 },
      navigationUrl: `https://maps.google.com/?q=${encodeURIComponent(batchData.locationName + ' ' + batchData.studioRoom)}`,
      students: defaultStudents,
    };

    setBatches((prev) => [newBatch, ...prev]);

    if (batchData.autoScheduleToday !== false) {
      const classNum = sessions.length + 1;
      const calendarCode = generateCalendarCode(2, classNum, 'scheduled');
      const newSess: Session = {
        id: 'sess-' + Date.now(),
        batchId: newBatch.id,
        batchName: newBatch.name,
        sessionName: newBatch.name,
        disciplineCategory: newBatch.disciplineCategory,
        date: '2026-09-10',
        timeSlot: newBatch.scheduleTime,
        studioRoom: newBatch.studioRoom,
        locationName: newBatch.locationName,
        monthIndex: 2,
        classIndex: classNum,
        status: 'scheduled',
        durationMinutes: 90,
        calendarCode,
      };
      setSessions((prev) => [newSess, ...prev]);
    }

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'New Class Group Created!',
      description: `${newBatch.name} (${newBatch.scheduleTime}) is now active in your class schedule.`,
    });
    setNewSessionModalOpen(false);
  };

  const deleteBatch = (batchId: string) => {
    const batchToDelete = batches.find((b) => b.id === batchId);
    setBatches((prev) => prev.filter((b) => b.id !== batchId));
    // Also remove sessions assigned to this batch
    setSessions((prev) => prev.filter((s) => s.batchId !== batchId));

    sound.playClick();
    showToast({
      type: 'info',
      title: 'Cohort & Schedule Deleted',
      description: batchToDelete
        ? `"${batchToDelete.name}" cohort and its scheduled sessions have been removed.`
        : 'Cohort and schedule deleted.',
    });
  };

  const enrollStudent = (batchId: string, studentData: Omit<Student, 'id' | 'lastAttendance'>) => {
    const studentId = 'stud-' + Date.now();
    const newStudent: Student = {
      id: studentId,
      name: studentData.name,
      avatarUrl: studentData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      parentName: studentData.parentName || 'Self / Guardian',
      parentPhone: studentData.parentPhone || '+1 (555) 000-0000',
      parentEmail: studentData.parentEmail || `${studentData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      age: studentData.age || 16,
      notes: studentData.notes || 'Newly registered cohort member',
    };

    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === batchId) {
          return {
            ...batch,
            students: [...batch.students, newStudent],
          };
        }
        return batch;
      })
    );

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Student Enrolled!',
      description: `${newStudent.name} registered into cohort. Roster count updated.`,
    });
  };

  const removeStudent = (batchId: string, studentId: string) => {
    let studentName = 'Student';
    setBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === batchId) {
          const found = batch.students.find((s) => s.id === studentId);
          if (found) studentName = found.name;
          return {
            ...batch,
            students: batch.students.filter((s) => s.id !== studentId),
          };
        }
        return batch;
      })
    );

    sound.playClick();
    showToast({
      type: 'info',
      title: 'Student Removed',
      description: `${studentName} was removed from the roster.`,
    });
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const isWalkIn = leadData.source === 'Walk-In' || leadData.leadType === 'walk_in';
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Date.now(),
      leadType: isWalkIn ? 'walk_in' : 'enquiry',
      createdAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLeads((prev) => [newLead, ...prev]);

    const updatedTotal = leads.length + 1;
    const currentTypeCount = leads.filter((l) =>
      isWalkIn
        ? (l.source === 'Walk-In' || l.leadType === 'walk_in')
        : (l.source !== 'Walk-In' || l.leadType === 'enquiry')
    ).length + 1;

    sound.playSuccess();
    showToast({
      type: 'success',
      title: isWalkIn ? `Walk-In Logged (Total Walk-Ins: ${currentTypeCount})` : `Enquiry Logged (Total Enquiries: ${currentTypeCount})`,
      description: `${newLead.studentName} logged under ${newLead.source}. Total CRM count is now ${updatedTotal}.`,
    });
    setLeadModalOpen(false);
  };

  const deleteLead = (leadId: string) => {
    const leadToDelete = leads.find((l) => l.id === leadId);
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    sound.playClick();
    showToast({
      type: 'info',
      title: 'Lead Removed',
      description: leadToDelete ? `Lead for "${leadToDelete.studentName}" has been deleted.` : 'Lead deleted.',
    });
  };

  const clearAllLeads = () => {
    setLeads([]);
    sound.playClick();
    showToast({
      type: 'info',
      title: 'CRM Reset to 0',
      description: 'All student enquiries and walk-ins have been cleared to 0.',
    });
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    sound.playClick();
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    showToast({
      type: 'info',
      title: 'Lead Status Updated',
      description: `Lead moved to ${status.replace('_', ' ').toUpperCase()}.`,
    });
  };

  const createWorkbookOrder = (
    orderData: Omit<WorkbookOrder, 'id' | 'orderDate' | 'trackingNumber' | 'status'>
  ) => {
    const tracking = 'RYD-TRK-' + Math.floor(10000 + Math.random() * 90000);
    const orderDate = new Date().toISOString().slice(0, 10);
    const est = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

    const newOrder: WorkbookOrder = {
      ...orderData,
      id: 'wb-' + Date.now(),
      trackingNumber: tracking,
      orderDate,
      estimatedDelivery: est,
      status: 'ordered',
    };

    setWorkbookOrders((prev) => [newOrder, ...prev]);
    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Workbook Order Placed',
      description: `${newOrder.itemTitle} ordered for ${newOrder.studentName}. Tracking #${tracking}.`,
    });
    setOrderWorkbookModalOpen(false);
  };

  const toggleFreeSlot = (id: string) => {
    sound.playClick();
    setFreeSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isAvailable: !s.isAvailable } : s))
    );
  };

  const addFreeSlot = (slotData: Omit<FreeSlot, 'id'>) => {
    const newSlot: FreeSlot = {
      ...slotData,
      id: 'fs-' + Date.now(),
    };
    setFreeSlots((prev) => [...prev, newSlot]);
    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Free Slot Added',
      description: `Available slot added for ${newSlot.dayOfWeek} (${newSlot.timeRange}).`,
    });
  };

  const sendUpdateMessage = (msgData: Omit<UpdateMessage, 'id' | 'sentAt' | 'status'>) => {
    const newMsg: UpdateMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      sentAt: 'Just Now',
      status: 'delivered',
    };

    setUpdates((prev) => [newMsg, ...prev]);
    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Update Broadcasted',
      description: `Sent "${newMsg.subject}" to ${newMsg.recipientName} via ${newMsg.channels.join(', ').toUpperCase()}.`,
    });
    setComposeUpdateModalOpen(false);
  };

  const deleteUpdate = (updateId: string) => {
    const msgToDelete = updates.find((u) => u.id === updateId);
    setUpdates((prev) => prev.filter((u) => u.id !== updateId));
    sound.playClick();
    showToast({
      type: 'info',
      title: 'Update Deleted',
      description: msgToDelete
        ? `"${msgToDelete.subject}" has been removed from central messaging.`
        : 'Update message deleted.',
    });
  };

  const clearAllUpdates = () => {
    setUpdates([]);
    sound.playClick();
    showToast({
      type: 'info',
      title: 'All Updates Cleared',
      description: 'All central messaging updates have been removed (0 updates).',
    });
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    sound.playSuccess();
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, teacherReply: replyText } : r))
    );
    showToast({
      type: 'success',
      title: 'Reply Published',
      description: 'Your response was posted to the parent review.',
    });
  };

  const shareReferralInvite = () => {
    sound.playSuccess();
    setReferralStats((prev) => ({
      ...prev,
      invitesSent: prev.invitesSent + 1,
    }));
    try {
      navigator.clipboard.writeText(
        `https://ryd.studio/join?ref=${referralStats.referralCode}&inviter=${encodeURIComponent(teacher.name)}`
      );
    } catch {
      // Ignored
    }
    showToast({
      type: 'success',
      title: 'Referral Link Copied',
      description: `Faculty link with code ${referralStats.referralCode} copied to clipboard.`,
    });
  };

  const rejectCandidate = (candidateId: string, reason?: string) => {
    const currentCandidate = referralStats.candidates?.find((c) => c.id === candidateId);
    if (!currentCandidate) return;

    const wasAlreadySelected =
      currentCandidate.stage === 'selected_successfully' ||
      currentCandidate.stage === 'successfully_joined';

    const todayDate = new Date().toISOString().split('T')[0];

    setReferralStats((prev) => {
      const updatedCandidates = (prev.candidates || []).map((c) =>
        c.id === candidateId
          ? {
              ...c,
              stage: 'rejected' as ReferralProgressStage,
              rejectionReason: reason || 'Application requirements not met for current cohort',
              rejectionDate: todayDate,
              payoutStatus: 'cancelled' as const,
              payoutAmount: 0,
            }
          : c
      );

      const hireDiff = wasAlreadySelected ? -1 : 0;
      const bonusDiff = wasAlreadySelected ? -2500 : 0;

      // Keep only paid payouts; cancel/remove pending payout for this candidate
      const nextPayouts = (prev.dayPayouts || []).filter((p) => p.candidateId !== candidateId || p.status === 'paid');

      const updated = {
        ...prev,
        candidates: updatedCandidates,
        dayPayouts: nextPayouts,
        onboardedTeachers: Math.max(0, prev.onboardedTeachers + hireDiff),
        bonusEarned: Math.max(0, prev.bonusEarned + bonusDiff),
      };

      try {
        localStorage.setItem(`${STORAGE_KEY}_referrals`, JSON.stringify(updated));
      } catch {}

      return updated;
    });

    sound.playClick();
    showToast({
      type: 'info',
      title: 'Candidate Application Rejected',
      description: `${currentCandidate.candidateName} has been marked as Rejected.`,
    });
  };

  const updateCandidateStage = (candidateId: string, nextStage: ReferralProgressStage) => {
    if (nextStage === 'rejected') {
      rejectCandidate(candidateId);
      return;
    }

    const currentCandidate = referralStats.candidates?.find((c) => c.id === candidateId);
    if (!currentCandidate) return;

    const wasAlreadySelected =
      currentCandidate.stage === 'selected_successfully' ||
      currentCandidate.stage === 'successfully_joined';
    const isNowSelected =
      nextStage === 'selected_successfully' || nextStage === 'successfully_joined';

    const todayDate = new Date().toISOString().split('T')[0];

    setReferralStats((prev) => {
      const updatedCandidates = (prev.candidates || []).map((c) =>
        c.id === candidateId
          ? {
              ...c,
              stage: nextStage,
              rejectionReason: undefined,
              rejectionDate: undefined,
              payoutAmount: 2500,
              payoutStatus: isNowSelected ? ('paid' as const) : c.payoutStatus === 'cancelled' ? 'pending' : c.payoutStatus || 'pending',
              payoutDate: isNowSelected ? todayDate : c.payoutDate,
            }
          : c
      );

      const bonusDiff = !wasAlreadySelected && isNowSelected ? 2500 : (wasAlreadySelected && !isNowSelected ? -2500 : 0);
      const hireDiff = !wasAlreadySelected && isNowSelected ? 1 : (wasAlreadySelected && !isNowSelected ? -1 : 0);

      // Add or update dayPayouts
      let nextPayouts = [...(prev.dayPayouts || [])];
      if (!wasAlreadySelected && isNowSelected) {
        const referringTeacher = currentCandidate.referringTeacherName || 'Shazz (Lead Faculty)';
        const referringTeacherId = currentCandidate.referringTeacherId || 'tutor-shazz';

        const existingPayoutIdx = nextPayouts.findIndex((p) => p.candidateId === candidateId);
        if (existingPayoutIdx !== -1) {
          nextPayouts[existingPayoutIdx] = {
            ...nextPayouts[existingPayoutIdx],
            status: 'paid',
            date: todayDate,
            milestoneDescription: `Referral Day Payout: ${currentCandidate.candidateName} Selected Successfully`,
          };
        } else {
          nextPayouts.unshift({
            id: 'payout-' + Date.now(),
            teacherId: referringTeacherId,
            teacherName: referringTeacher,
            candidateId: currentCandidate.id,
            candidateName: currentCandidate.candidateName,
            amountINR: 2500,
            date: todayDate,
            status: 'paid',
            milestoneDescription: `Referral Day Payout: ${currentCandidate.candidateName} Selected Successfully`,
          });
        }
      }

      const updated = {
        ...prev,
        candidates: updatedCandidates,
        dayPayouts: nextPayouts,
        onboardedTeachers: Math.max(0, prev.onboardedTeachers + hireDiff),
        bonusEarned: Math.max(0, prev.bonusEarned + bonusDiff),
      };

      try {
        localStorage.setItem(`${STORAGE_KEY}_referrals`, JSON.stringify(updated));
      } catch {}

      return updated;
    });

    if (!wasAlreadySelected && isNowSelected) {
      sound.playSuccess();
      showToast({
        type: 'success',
        title: `Teacher Selected Successfully!`,
        description: `${currentCandidate.candidateName} has been selected! ₹2,500 Day Payout awarded to referring teacher (${currentCandidate.referringTeacherName || 'Faculty'}).`,
      });
    } else {
      sound.playClick();
      const stageLabels: Record<string, string> = {
        referred: 'Referred',
        interviewed: 'Interviewed',
        selected_successfully: 'Selected Successfully',
        rejected: 'Rejected',
        starting_referral: 'Referred',
        interview: 'Interviewed',
        selected: 'Interviewed',
        successfully_joined: 'Selected Successfully',
      };
      showToast({
        type: 'info',
        title: `Pipeline Stage: ${stageLabels[nextStage] || nextStage}`,
        description: `${currentCandidate.candidateName} updated to ${stageLabels[nextStage] || nextStage}.`,
      });
    }
  };

  const disburseDayPayout = (payoutId: string) => {
    setReferralStats((prev) => {
      const targetPayout = (prev.dayPayouts || []).find(
        (p) => p.id === payoutId || p.candidateId === payoutId
      );
      const actualPayoutId = targetPayout?.id || payoutId;
      const todayStr = new Date().toISOString().split('T')[0];

      const updatedPayouts = (prev.dayPayouts || []).map((p) =>
        p.id === actualPayoutId ? { ...p, status: 'paid' as const, date: todayStr } : p
      );

      const updatedCandidates = (prev.candidates || []).map((c) =>
        c.id === payoutId || (targetPayout && c.id === targetPayout.candidateId)
          ? { ...c, payoutStatus: 'paid' as const, payoutDate: todayStr }
          : c
      );

      const updated = { ...prev, candidates: updatedCandidates, dayPayouts: updatedPayouts };
      try {
        localStorage.setItem(`${STORAGE_KEY}_referrals`, JSON.stringify(updated));
      } catch {}
      if (targetPayout) {
        sound.playSuccess();
        showToast({
          type: 'success',
          title: 'Day Payout Disbursed',
          description: `₹${targetPayout.amountINR.toLocaleString()} INR disbursed to ${targetPayout.teacherName}.`,
        });
      } else {
        sound.playSuccess();
        showToast({
          type: 'success',
          title: 'Day Payout Disbursed',
          description: 'Referral day payout marked as disbursed.',
        });
      }
      return updated;
    });
  };

  const addCandidateReferral = (candidate: {
    candidateName: string;
    email: string;
    phone: string;
    specialty: string;
    referringTeacherId?: string;
    referringTeacherName?: string;
    notes?: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const newCand: ReferredCandidate = {
      id: 'cand-' + Date.now(),
      candidateName: candidate.candidateName.trim(),
      email: candidate.email.trim(),
      phone: candidate.phone.trim(),
      specialty: candidate.specialty.trim() || 'Academic STEM Tutor',
      stage: 'referred',
      dateReferred: today,
      referringTeacherId: candidate.referringTeacherId || (currentUser?.role === 'tutor' ? currentUser.id : 'tutor-shazz'),
      referringTeacherName: candidate.referringTeacherName || (currentUser?.role === 'tutor' ? currentUser.name : 'Shazz (Lead Faculty)'),
      payoutAmount: 2500,
      payoutStatus: 'pending',
      notes: candidate.notes || 'Referred teacher candidate for academic faculty.',
    };

    setReferralStats((prev) => {
      const updated = {
        ...prev,
        invitesSent: prev.invitesSent + 1,
        candidates: [newCand, ...(prev.candidates || [])],
      };
      try {
        localStorage.setItem(`${STORAGE_KEY}_referrals`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    sound.playSuccess();
    showToast({
      type: 'success',
      title: 'Teacher Referral Registered!',
      description: `${newCand.candidateName} added to the Referral pipeline (Stage: Referred).`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        viewMode,
        toggleViewMode,
        themeMode,
        toggleThemeMode,
        soundEnabled,
        toggleSound,
        showSplash,
        dismissSplash,
        replaySplash,
        teacher: reconciledTeacher,
        setTeacherName,
        isCheckedIn,
        checkedInSession,
        checkInTime,
        isRunningLate,
        runningLateMinutes,
        runningLateReason,
        batches,
        sessions,
        leads,
        updates,
        workbookOrders,
        freeSlots,
        reviews,
        referralStats,
        toasts,
        dismissToast,
        showToast,
        checkInModalOpen,
        setCheckInModalOpen,
        checkOutModalOpen,
        setCheckOutModalOpen,
        selectedSessionForCheckOut,
        setSelectedSessionForCheckOut,
        openCheckOutForSession,
        runningLateModalOpen,
        setRunningLateModalOpen,
        rescheduleModalOpen,
        setRescheduleModalOpen,
        selectedSessionForReschedule,
        openRescheduleForSession,
        parentPreviewModalOpen,
        setParentPreviewModalOpen,
        selectedSessionForParentPreview,
        openParentPreviewForSession,
        leadModalOpen,
        setLeadModalOpen,
        leadModalDefaultType,
        openLeadModalWithType,
        orderWorkbookModalOpen,
        setOrderWorkbookModalOpen,
        composeUpdateModalOpen,
        setComposeUpdateModalOpen,
        newSessionModalOpen,
        setNewSessionModalOpen,
        checkIn,
        checkOut,
        reportRunningLate,
        clearRunningLate,
        requestReschedule,
        acceptReschedule,
        declineReschedule,
        cancelClass,
        createNewSession,
        deleteSession,
        clearAllSessions,
        addNewBatch,
        deleteBatch,
        enrollStudent,
        removeStudent,
        addLead,
        deleteLead,
        clearAllLeads,
        updateLeadStatus,
        createWorkbookOrder,
        toggleFreeSlot,
        addFreeSlot,
        sendUpdateMessage,
        deleteUpdate,
        clearAllUpdates,
        replyToReview,
        shareReferralInvite,
        updateCandidateStage,
        rejectCandidate,
        addCandidateReferral,
        disburseDayPayout,
        syncStatus,
        lastSyncedAt,
        triggerCloudSync,
        isDemoMode,
        toggleDemoMode,
        resetToCleanState,
        loadDemoData,
        todaysClassesCount,
        studentsCount,
        pendingRequestsCount,
        completedSessionsCount,
        lateArrivalsCount,
        referralsCount,
        rewardsINR,
        currentAuthRole,
        activeRole,
        setActiveRole,
        loginAsRole,
        logoutAuth,
        roleGatewayModalOpen,
        setRoleGatewayModalOpen,
        tutorOnlineStatus,
        loginTutor,
        logoutTutor,
        tutors,
        parents,
        selectedParentStudentId,
        setSelectedParentStudentId,
        activityEvents,
        addActivityEvent,
        unreadAdminActivityCount,
        unreadParentActivityCount,
        markActivityReadByAdmin,
        markActivityReadByParent,
        currentUser,
        isAuthenticated,
        authorizedUsers,
        loginWithCredentials,
        loginWithGoogle,
        logout,
        updateMyCredentials,
        updateAdminProfileName,
        requestPasswordReset,
        resetPasswordWithCode,
        authorizeNewUser,
        updateUserCredentials,
        toggleUserAuthorization,
        deleteUser,
        accountSecurityModalOpen,
        setAccountSecurityModalOpen,
        accessRequests,
        pendingAccessRequestsCount,
        requestAccess,
        grantAccessRequest,
        declineAccessRequest,
        deleteAccessRequest,
        designatedHall,
        updateDesignatedHall,
        simulateTutorMovement,
        pingTutor,
        pingParent,
        setParents,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export interface AdminInboxMessage {
  id: string;
  type: 'contact_us' | 'homework_submission';
  studentName: string;
  studentEmail: string;
  studentClass?: string;
  subject?: string;
  topic?: string;
  homeworkTitle?: string;
  messageContent: string;
  attachmentName?: string;
  submittedAt: string;
  timestamp: number;
  status: 'pending' | 'reviewed' | 'graded';
  adminReply?: {
    marks?: string; // e.g. "95 / 100 (Grade A+)"
    modelAnswers?: string; // Correct model answers and steps
    feedbackNotes: string; // Explanations & comments from Admin Victoria Okajoe
    repliedAt: string;
    repliedBy: string; // "Victoria Okajoe (Sole Administrator)"
  };
}

const STORAGE_KEY = 'echo_plan_admin_messages_and_homework';

const INITIAL_MESSAGES: AdminInboxMessage[] = [
  {
    id: 'msg-seed-1',
    type: 'homework_submission',
    studentName: 'Amina Bello',
    studentEmail: 'amina.bello@student.echo.edu.ng',
    studentClass: 'SS3',
    subject: 'Mathematics',
    topic: 'Quadratic Equations & Logarithms',
    homeworkTitle: 'SS3 Exercise 4B: Completing the Square and Log Rules',
    messageContent: `Answers Submitted for Exercise 4B:
1. Question 1: Solve 2x^2 + 5x - 3 = 0.
   Method: Factoring (2x - 1)(x + 3) = 0.
   Solutions: x = 0.5 or x = -3.

2. Question 2: Evaluate log10(25) + log10(4).
   Using addition product law: log10(25 * 4) = log10(100) = log10(10^2) = 2.

3. Question 3: Find roots of x^2 - 6x + 7 = 0 by completing the square.
   (x - 3)^2 - 9 + 7 = 0  => (x - 3)^2 = 2 => x = 3 ± √2.`,
    submittedAt: 'Today, 10:15 AM',
    timestamp: Date.now() - 3600000 * 2,
    status: 'graded',
    adminReply: {
      marks: '98 / 100 (Grade A+ Distinction)',
      modelAnswers: `Model Solutions & Official WAEC Marking Key:
Q1: 2x² + 5x - 3 = 0 -> (2x - 1)(x + 3) = 0 -> x = 1/2 or x = -3 [Full marks: 3/3].
Q2: log₁₀(25) + log₁₀(4) = log₁₀(100) = 2 [Full marks: 3/3].
Q3: x² - 6x + 7 = 0 -> (x - 3)² = 2 -> x = 3 ± √2 ≈ 4.414 or 1.586 [Full marks: 4/4].`,
      feedbackNotes: 'Brilliant mathematical precision, Amina! Your logarithmic step reasoning is flawless. Keep up this standard for the WAEC mock examinations.',
      repliedAt: 'Today, 11:30 AM',
      repliedBy: 'Victoria Okajoe (Sole Administrator)'
    }
  },
  {
    id: 'msg-seed-2',
    type: 'homework_submission',
    studentName: 'Chidubem Okafor',
    studentEmail: 'chidubem.okafor@student.echo.edu.ng',
    studentClass: 'SS3',
    subject: 'Physics',
    topic: 'Mechanics: Projectile Motion & Energy Conservation',
    homeworkTitle: 'Physics Assignment 3: Maximum Height & Range Equations',
    messageContent: `Assignment Submission:
Formula for Maximum Height: H = (u^2 * sin^2(θ)) / (2g).
Given: u = 40 m/s, θ = 30°, g = 9.8 m/s^2.
Calculation: H = (1600 * 0.25) / (19.6) = 400 / 19.6 = 20.41 metres.

Horizontal Range: R = (u^2 * sin(2θ)) / g.
Calculation: R = (1600 * sin(60°)) / 9.8 = (1600 * 0.866) / 9.8 = 1385.6 / 9.8 = 141.38 metres.`,
    submittedAt: 'Today, 1:45 PM',
    timestamp: Date.now() - 1800000,
    status: 'pending'
  },
  {
    id: 'msg-seed-3',
    type: 'contact_us',
    studentName: 'Emeka Eze',
    studentEmail: 'emeka.eze@student.echo.edu.ng',
    studentClass: 'SS2',
    subject: 'General Inquiry',
    topic: 'CBT Exam Practice Schedule',
    messageContent: 'Good day Administrator Victoria, could you please confirm when the SS2 mock past questions for Chemistry and Civic Education will be uploaded into the CBT center? Thank you.',
    submittedAt: 'Yesterday, 4:20 PM',
    timestamp: Date.now() - 86400000,
    status: 'reviewed',
    adminReply: {
      feedbackNotes: 'Hello Emeka! The SS2 Chemistry and Civic past question sets have been successfully updated in the CBT Practice Exam center. You can access all 50 questions with 30-minute exam room timer right now.',
      repliedAt: 'Yesterday, 6:00 PM',
      repliedBy: 'Victoria Okajoe (Sole Administrator)'
    }
  }
];

export const getAllAdminMessages = (): AdminInboxMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_MESSAGES;
};

export const saveAdminMessages = (messages: AdminInboxMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    window.dispatchEvent(new Event('storage'));
  } catch {
    // ignore
  }
};

export const sendContactUsMessage = (params: {
  name: string;
  email: string;
  role?: string;
  topic: string;
  message: string;
}): AdminInboxMessage => {
  const current = getAllAdminMessages();
  const newMsg: AdminInboxMessage = {
    id: `contact-${Date.now()}`,
    type: 'contact_us',
    studentName: params.name.trim(),
    studentEmail: params.email.trim(),
    topic: params.topic,
    subject: params.topic,
    messageContent: params.message.trim(),
    submittedAt: `Today, ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
    timestamp: Date.now(),
    status: 'pending'
  };

  const updated = [newMsg, ...current];
  saveAdminMessages(updated);
  return newMsg;
};

export const submitStudentHomework = (params: {
  studentName: string;
  studentEmail: string;
  studentClass: string;
  subject: string;
  homeworkTitle: string;
  messageContent: string;
  attachmentName?: string;
}): AdminInboxMessage => {
  const current = getAllAdminMessages();
  const newHomework: AdminInboxMessage = {
    id: `hw-${Date.now()}`,
    type: 'homework_submission',
    studentName: params.studentName.trim(),
    studentEmail: params.studentEmail.trim(),
    studentClass: params.studentClass.trim(),
    subject: params.subject,
    topic: params.homeworkTitle,
    homeworkTitle: params.homeworkTitle.trim(),
    messageContent: params.messageContent.trim(),
    attachmentName: params.attachmentName,
    submittedAt: `Today, ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
    timestamp: Date.now(),
    status: 'pending'
  };

  const updated = [newHomework, ...current];
  saveAdminMessages(updated);
  return newHomework;
};

export const replyAndGradeHomework = (
  messageId: string, 
  reply: {
    marks: string;
    modelAnswers: string;
    feedbackNotes: string;
    repliedBy?: string;
  }
): boolean => {
  const current = getAllAdminMessages();
  const idx = current.findIndex(m => m.id === messageId);
  if (idx === -1) return false;

  current[idx] = {
    ...current[idx],
    status: 'graded',
    adminReply: {
      marks: reply.marks.trim(),
      modelAnswers: reply.modelAnswers.trim(),
      feedbackNotes: reply.feedbackNotes.trim(),
      repliedAt: `Today, ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
      repliedBy: reply.repliedBy || 'Victoria Okajoe (Sole Administrator)'
    }
  };

  saveAdminMessages(current);
  return true;
};

export const replyContactUsMessage = (
  messageId: string,
  replyContent: string,
  repliedBy?: string
): boolean => {
  const current = getAllAdminMessages();
  const idx = current.findIndex(m => m.id === messageId);
  if (idx === -1) return false;

  current[idx] = {
    ...current[idx],
    status: 'reviewed',
    adminReply: {
      feedbackNotes: replyContent.trim(),
      repliedAt: `Today, ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
      repliedBy: repliedBy || 'Victoria Okajoe (Sole Administrator)'
    }
  };

  saveAdminMessages(current);
  return true;
};

export const deleteAdminMessage = (messageId: string): boolean => {
  const current = getAllAdminMessages();
  const updated = current.filter(m => m.id !== messageId);
  saveAdminMessages(updated);
  return true;
};

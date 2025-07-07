
export type ProposalStatus = 'Draft' | 'In Review' | 'In Revision' | 'Approved' | 'Submitted' | 'Won' | 'Lost';
export type AccessRole = 'Viewer' | 'Editor' | 'Reviewer' | 'Manager' | 'Admin' | 'Approver';
export type ProposalPriority = 'High' | 'Medium' | 'Low';

export interface TeamMember {
  name: string;
  avatarUrl: string;
  email: string;
  role: AccessRole;
}

export interface StorableUser {
  id: string;
  name: string;
  email: string;
  role: AccessRole;
  password_bcrypt_hash: string; // Plain text for simulation purposes
  avatarUrl: string;
  mfaEnabled: boolean;
}

export interface Proposal {
  id: string;
  title: string;
  client: string;
  status: ProposalStatus;
  priority: ProposalPriority;
  progress: number;
  lastUpdated: string;
  team: TeamMember[];
  content?: string;
  objective?: string;
  industry?: string;
  value: number;
  region: string;
  owner: string;
  ownerEmail?: string;
  solutionType?: string;
  submittedBy?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  usageCount: number;
  author: string;
  content?: string;
  successRate?: number;
}

export interface Invitation {
  id: string;
  email: string;
  role: AccessRole;
  proposalId: string;
  status: 'pending' | 'accepted';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  timestamp: string;
  details?: string;
}

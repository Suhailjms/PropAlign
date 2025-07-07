
export type ProposalStatus = 'Draft' | 'In Review' | 'In Revision' | 'Approved' | 'Submitted' | 'Won' | 'Lost';
export type AccessRole = 'Viewer' | 'Editor' | 'Reviewer' | 'Manager' | 'Admin' | 'Approver';

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
}

export interface Proposal {
  id: string;
  title: string;
  client: string;
  status: ProposalStatus;
  progress: number;
  lastUpdated: string;
  team: TeamMember[];
  content?: string;
  objective?: string;
  industry?: string;
  value: number;
  region: string;
  owner: string;
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

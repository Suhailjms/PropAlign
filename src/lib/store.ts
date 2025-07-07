
// This is a simple in-memory store to simulate a database for the demo.
// Data will reset on server restart.

import type { Proposal, Template, AccessRole, TeamMember, Invitation, StorableUser, AuditLog, ProposalPriority } from './types';
import { proposals as initialProposals, templates as initialTemplates, users as initialUsers } from './data';

class InMemoryStore {
    private proposals: Proposal[];
    private templates: Template[];
    private invitations: Invitation[];
    private users: StorableUser[];
    private auditLogs: AuditLog[];

    constructor() {
        this.proposals = JSON.parse(JSON.stringify(initialProposals));
        this.templates = JSON.parse(JSON.stringify(initialTemplates));
        this.users = JSON.parse(JSON.stringify(initialUsers));
        this.invitations = [];
        this.auditLogs = [];
        this.logAction('system', 'System Initialized');
    }

    // Audit Log Methods
    logAction(userEmail: string, action: string, details?: string) {
        const log: AuditLog = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            userEmail,
            action,
            details,
            timestamp: new Date().toISOString(),
        };
        this.auditLogs.unshift(log);
    }

    getAuditLogs(): AuditLog[] {
        return this.auditLogs;
    }


    // User Methods
    getUserByEmail(email: string): StorableUser | undefined {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    addUser(data: Omit<StorableUser, 'id' | 'avatarUrl' | 'mfaEnabled'>): StorableUser {
        if (data.role === 'Admin') {
            const adminCount = this.users.filter(u => u.role === 'Admin').length;
            if (adminCount >= 2) {
                throw new Error('Cannot create more than 2 Admin users.');
            }
        }

        const existingUser = this.getUserByEmail(data.email);
        if (existingUser) {
            throw new Error('A user with this email already exists.');
        }
        
        const newUser: StorableUser = {
            id: `user-${Date.now()}`,
            ...data,
            avatarUrl: `https://placehold.co/40x40.png`,
            mfaEnabled: false,
        };
        this.users.push(newUser);
        this.logAction('admin', 'User Created', `User: ${data.email}, Role: ${data.role}`);
        return newUser;
    }
    
    enableMfa(email: string): StorableUser | undefined {
        const user = this.getUserByEmail(email);
        if (user) {
            user.mfaEnabled = true;
            this.logAction(email, 'MFA Enabled');
            return user;
        }
        return undefined;
    }


    // Proposal Methods
    getProposals(): Proposal[] {
        return this.proposals;
    }

    getTemplates(): Template[] {
        return this.templates;
    }

    getProposalById(id: string): Proposal | undefined {
        return this.proposals.find(p => p.id === id);
    }

    addProposal(data: {
        title: string;
        client: string;
        value: number;
        region: string;
        industry: string;
        objective: string;
        solutionType: string;
        content: string;
        ownerEmail: string;
        priority: ProposalPriority;
    }): Proposal {
        const ownerUser = this.getUserByEmail(data.ownerEmail);
        const newProposal: Proposal = {
            id: `PROP-${String(this.proposals.length + 1).padStart(3, '0')}`,
            title: data.title,
            client: data.client,
            value: data.value,
            region: data.region,
            industry: data.industry,
            objective: data.objective,
            solutionType: data.solutionType,
            content: data.content,
            status: 'Draft',
            priority: data.priority,
            progress: 10,
            lastUpdated: 'Just now',
            owner: ownerUser?.name || 'Unknown User',
            ownerEmail: data.ownerEmail,
            team: [],
        };
        this.proposals.unshift(newProposal); // Add to the top of the list
        this.logAction(data.ownerEmail, 'Proposal Created', `Proposal ID: ${newProposal.id}, Title: ${newProposal.title}`);
        return newProposal;
    }
    
    updateProposal(id: string, updates: Partial<Omit<Proposal, 'id'>>): Proposal | undefined {
        const proposalIndex = this.proposals.findIndex(p => p.id === id);
        if (proposalIndex === -1) {
            return undefined;
        }
        
        const updatedProposal = {
            ...this.proposals[proposalIndex],
            ...updates,
            lastUpdated: 'Just now', // Update timestamp
        };

        this.proposals[proposalIndex] = updatedProposal;
        return updatedProposal;
    }

    // Invitation and Access Methods
    createInvitation(proposalId: string, email: string, role: AccessRole, inviterEmail: string): Invitation {
        const proposal = this.getProposalById(proposalId);
        if (!proposal) {
            throw new Error(`Proposal with id ${proposalId} not found.`);
        }

        const isAlreadyOnTeam = proposal.team.some(member => member.email.toLowerCase() === email.toLowerCase());
        if (isAlreadyOnTeam) {
            throw new Error(`User ${email} already has access to this proposal.`);
        }

        const hasPendingInvite = this.invitations.some(inv => inv.proposalId === proposalId && inv.email.toLowerCase() === email.toLowerCase() && inv.status === 'pending');
        if (hasPendingInvite) {
            throw new Error(`An invitation for ${email} is already pending for this proposal.`);
        }

        const newInvitation: Invitation = {
            id: `INV-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            proposalId,
            email,
            role,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        this.invitations.push(newInvitation);
        this.logAction(inviterEmail, 'Proposal Shared', `Invited ${email} as ${role} to proposal ${proposalId}`);
        return newInvitation;
    }

    acceptInvitation(invitationId: string): Proposal | undefined {
        const invitationIndex = this.invitations.findIndex(inv => inv.id === invitationId);
        if (invitationIndex === -1) {
            throw new Error('Invitation not found.');
        }
        
        const invitation = this.invitations[invitationIndex];
        if (invitation.status !== 'pending') {
            throw new Error('Invitation has already been actioned.');
        }

        const proposal = this.grantAccess(invitation.proposalId, invitation.email, invitation.role);
        
        if (proposal) {
            this.invitations[invitationIndex].status = 'accepted';
            this.logAction(invitation.email, 'Accepted Invite', `Joined proposal ${invitation.proposalId} as ${invitation.role}`);
        }

        return proposal;
    }

    grantAccess(proposalId: string, email: string, role: AccessRole): Proposal | undefined {
        const proposalIndex = this.proposals.findIndex(p => p.id === proposalId);
        if (proposalIndex === -1) {
            throw new Error(`Proposal with id ${proposalId} not found.`);
        }

        const proposal = this.proposals[proposalIndex];
        const existingUserIndex = proposal.team.findIndex(member => member.email.toLowerCase() === email.toLowerCase());

        if (existingUserIndex !== -1) {
            // Update role for existing user
            proposal.team[existingUserIndex].role = role;
        } else {
            // Add new user
            const newUser: TeamMember = {
                name: email.split('@')[0].replace(/^\w/, c => c.toUpperCase()), // Capitalize first letter of email prefix
                email: email,
                role: role,
                avatarUrl: `https://placehold.co/32x32.png` // Placeholder avatar
            };
            proposal.team.push(newUser);
        }
        
        proposal.lastUpdated = 'Just now';
        this.proposals[proposalIndex] = proposal;
        return proposal;
    }

    revokeAccess(proposalId: string, email: string, revokerEmail: string): Proposal | undefined {
        const proposalIndex = this.proposals.findIndex(p => p.id === proposalId);
        if (proposalIndex === -1) {
            throw new Error(`Proposal with id ${proposalId} not found.`);
        }

        const proposal = this.proposals[proposalIndex];
        proposal.team = proposal.team.filter(member => member.email.toLowerCase() !== email.toLowerCase());
        
        proposal.lastUpdated = 'Just now';
        this.proposals[proposalIndex] = proposal;
        this.logAction(revokerEmail, 'Access Revoked', `Removed ${email} from proposal ${proposalId}`);
        return proposal;
    }

    getInvitationsForProposal(proposalId: string): Invitation[] {
        return this.invitations.filter(inv => inv.proposalId === proposalId);
    }
}

const globalForStore = global as unknown as { store?: InMemoryStore };

export const store = globalForStore.store ?? new InMemoryStore();

if (process.env.NODE_ENV !== 'production') globalForStore.store = store;

export default store;

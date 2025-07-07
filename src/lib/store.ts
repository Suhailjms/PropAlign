// This is a simple in-memory store to simulate a database for the demo.
// Data will reset on server restart.

import type { Proposal, Template, AccessRole, TeamMember, Invitation, StorableUser } from './types';
import { proposals as initialProposals, templates as initialTemplates, users as initialUsers } from './data';

class InMemoryStore {
    private proposals: Proposal[];
    private templates: Template[];
    private invitations: Invitation[];
    private users: StorableUser[];

    constructor() {
        this.proposals = JSON.parse(JSON.stringify(initialProposals));
        this.templates = JSON.parse(JSON.stringify(initialTemplates));
        this.users = JSON.parse(JSON.stringify(initialUsers));
        this.invitations = [];
    }

    // User Methods
    getUserByEmail(email: string): StorableUser | undefined {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    addUser(data: Omit<StorableUser, 'id' | 'avatarUrl'>): StorableUser {
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
            avatarUrl: `https://placehold.co/40x40.png`
        };
        this.users.push(newUser);
        return newUser;
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
    }): Proposal {
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
            progress: 10,
            lastUpdated: 'Just now',
            owner: 'Alex Smith', // Placeholder owner
            team: [],
        };
        this.proposals.unshift(newProposal); // Add to the top of the list
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
    createInvitation(proposalId: string, email: string, role: AccessRole): Invitation {
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

    revokeAccess(proposalId: string, email: string): Proposal | undefined {
        const proposalIndex = this.proposals.findIndex(p => p.id === proposalId);
        if (proposalIndex === -1) {
            throw new Error(`Proposal with id ${proposalId} not found.`);
        }

        const proposal = this.proposals[proposalIndex];
        proposal.team = proposal.team.filter(member => member.email.toLowerCase() !== email.toLowerCase());
        
        proposal.lastUpdated = 'Just now';
        this.proposals[proposalIndex] = proposal;
        return proposal;
    }

    getInvitationsForProposal(proposalId: string): Invitation[] {
        return this.invitations.filter(inv => inv.proposalId === proposalId);
    }
}


// This ensures that in a development environment, we use a single, persistent
// instance of the store across hot reloads. In a real application, this would
// be a database connection.
declare global {
  var __store: InMemoryStore | undefined
}

let store: InMemoryStore;

if (process.env.NODE_ENV === 'production') {
  store = new InMemoryStore();
} else {
  if (!global.__store) {
    global.__store = new InMemoryStore();
  }
  store = global.__store;
}

export default store;

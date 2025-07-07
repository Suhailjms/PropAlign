
'use server'

import { z } from 'zod';
import store from './store';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Proposal, ProposalStatus, AccessRole, StorableUser, ProposalPriority } from './types';

const CreateProposalSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  clientName: z.string().min(2, { message: "Client name must be at least 2 characters." }),
  value: z.coerce.number().min(0, { message: "Value must be a positive number." }),
  priority: z.enum(['High', 'Medium', 'Low'], { required_error: "Priority is required." }),
  clientNeeds: z.string().min(10, { message: "Client needs must be at least 10 characters." }),
  industry: z.string().min(2, { message: "Industry must be at least 2 characters." }),
  region: z.string().min(2, { message: "Region must be at least 2 characters." }),
  solutionType: z.string().min(2, { message: "Solution type must be at least 2 characters." }),
  draftContent: z.string().nullable().optional(),
  ownerEmail: z.string().email(),
});

export type CreateProposalState = {
  errors?: {
    title?: string[];
    clientName?: string[];
    value?: string[];
    priority?: string[];
    clientNeeds?: string[];
    industry?: string[];
    region?: string[];
    solutionType?: string[];
  };
  message?: string | null;
};

export async function createProposal(prevState: CreateProposalState, formData: FormData) {
  const validatedFields = CreateProposalSchema.safeParse({
    title: formData.get('title'),
    clientName: formData.get('clientName'),
    value: formData.get('value'),
    priority: formData.get('priority'),
    clientNeeds: formData.get('clientNeeds'),
    industry: formData.get('industry'),
    region: formData.get('region'),
    solutionType: formData.get('solutionType'),
    draftContent: formData.get('draftContent'),
    ownerEmail: formData.get('ownerEmail'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: null,
    };
  }
  
  const { title, clientName, value, clientNeeds, industry, region, solutionType, draftContent, ownerEmail, priority } = validatedFields.data;

  try {
    store.addProposal({
      title,
      client: clientName,
      value,
      priority,
      region,
      industry,
      objective: clientNeeds,
      solutionType,
      content: draftContent || '',
      ownerEmail,
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Proposal.',
    };
  }

  revalidatePath('/');
  revalidatePath('/proposals');
  redirect('/proposals');
}

export async function updateProposalStatus(proposalId: string, status: ProposalStatus, userEmail: string) {
  const proposal = store.getProposalById(proposalId);
  if (!proposal) {
    throw new Error('Proposal not found.');
  }

  if ((status === 'Approved' || status === 'In Revision') && proposal.submittedBy === userEmail) {
    store.logAction(userEmail, 'Approval Blocked', `Attempted to approve/reject own proposal: ${proposalId}`);
    throw new Error('You cannot approve or reject a proposal you submitted yourself.');
  }

  const updates: Partial<Omit<Proposal, 'id'>> = { status };
  if (status === 'In Review') {
    updates.submittedBy = userEmail;
  }
  
  try {
    store.updateProposal(proposalId, updates);
    store.logAction(userEmail, 'Proposal Status Updated', `Proposal: ${proposalId}, New Status: ${status}`);
    revalidatePath(`/proposals/${proposalId}`);
    revalidatePath('/proposals');
    revalidatePath('/');
  } catch (error) {
    console.error('Database Error: Failed to Update Proposal Status.', error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update proposal status.";
    throw new Error(errorMessage);
  }
}

const ShareProposalSchema = z.object({
  proposalId: z.string(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(['Viewer', 'Editor', 'Reviewer', 'Manager', 'Admin', 'Approver']),
  inviterEmail: z.string().email(),
});

export type ShareProposalState = {
  errors?: {
    email?: string[];
    role?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function shareProposal(prevState: ShareProposalState, formData: FormData) {
  const validatedFields = ShareProposalSchema.safeParse({
    proposalId: formData.get('proposalId'),
    email: formData.get('email'),
    role: formData.get('role'),
    inviterEmail: formData.get('inviterEmail'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data provided.",
      success: false,
    };
  }
  
  const { proposalId, email, role, inviterEmail } = validatedFields.data;

  try {
    store.createInvitation(proposalId, email, role as AccessRole, inviterEmail);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `Failed to send invite: ${errorMessage}`,
      success: false,
    };
  }

  revalidatePath(`/proposals/${proposalId}`);
  return {
    message: `(Simulation) Invite sent to ${email}.`,
    success: true,
  }
}

const RevokeProposalAccessSchema = z.object({
  proposalId: z.string(),
  email: z.string().email(),
  revokerEmail: z.string().email(),
});

export async function revokeProposalAccess(proposalId: string, email: string, revokerEmail: string) {
    const validatedFields = RevokeProposalAccessSchema.safeParse({ proposalId, email, revokerEmail });

    if (!validatedFields.success) {
        throw new Error("Invalid data for revoking access.");
    }
    
    try {
        store.revokeAccess(proposalId, email, revokerEmail);
    } catch (error) {
        console.error('Database Error: Failed to Revoke Proposal Access.', error);
        throw new Error("Failed to revoke proposal access.");
    }

    revalidatePath(`/proposals/${proposalId}`);
}

export async function acceptInvite(invitationId: string) {
    try {
        const proposal = store.acceptInvitation(invitationId);
        if (proposal) {
            revalidatePath(`/proposals/${proposal.id}`);
            return { success: true, message: 'Invitation accepted successfully.' };
        }
    } catch (error) {
        console.error('Database Error: Failed to Accept Invitation.', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(errorMessage);
    }
}

const CreateUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(['Admin', 'Approver', 'Manager', 'Reviewer', 'Editor', 'Viewer']),
});

export type CreateUserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function createUser(prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {
    const validatedFields = CreateUserSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the errors and try again.",
            success: false,
        };
    }

    const { name, email, password, role } = validatedFields.data;

    try {
        store.addUser({
            name,
            email,
            role,
            password_bcrypt_hash: password 
        });

        revalidatePath('/admin/users');
        return {
            message: `User ${name} created successfully as a(n) ${role}.`,
            success: true,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return {
            message: errorMessage,
            success: false,
            errors: {
                ...((errorMessage.toLowerCase().includes('email')) && { email: [errorMessage] }),
                ...((errorMessage.toLowerCase().includes('admin')) && { role: [errorMessage] }),
            }
        };
    }
}

export async function enableMfa(email: string) {
  try {
    store.enableMfa(email);
    revalidatePath('/login');
    return { success: true, message: 'MFA has been enabled.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to enable MFA: ${errorMessage}`};
  }
}

export async function getAuditLogs() {
    return store.getAuditLogs();
}

export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; message: string; user?: Omit<StorableUser, 'password_bcrypt_hash'>, mfaRequired?: boolean }> {
  const storableUser = store.getUserByEmail(email);

  if (storableUser && storableUser.password_bcrypt_hash === password) {
    // On success, don't return the password hash
    const { password_bcrypt_hash, ...userToReturn } = storableUser;
    
    if (storableUser.mfaEnabled) {
      // For MFA flow, we don't return the user object yet, just the signal.
      return { success: true, message: "Password correct. Please enter MFA code.", mfaRequired: true };
    }
    
    store.logAction(email, 'Login Success', 'Without MFA');
    return { success: true, message: "Login successful.", user: userToReturn };
  } else {
    store.logAction(email, 'Login Failed', 'Invalid credentials');
    return { success: false, message: "Invalid email or password." };
  }
}

export async function completeMfaLogin(email: string): Promise<{ success: boolean; message: string; user?: Omit<StorableUser, 'password_bcrypt_hash'> }> {
    const storableUser = store.getUserByEmail(email);
    if (!storableUser) {
        store.logAction(email, 'MFA Login Failed', 'User not found post-MFA challenge.');
        return { success: false, message: "User not found." };
    }
    
    const { password_bcrypt_hash, ...userToReturn } = storableUser;
    store.logAction(email, 'Login Success', 'With MFA');
    return { success: true, message: "Login successful.", user: userToReturn };
}


export async function logLogout(email: string) {
    store.logAction(email, 'Logout');
}

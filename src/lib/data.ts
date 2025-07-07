
import type { Proposal, Template, StorableUser } from './types';

export const users: StorableUser[] = [
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@proposer.ai',
    role: 'Admin',
    password_bcrypt_hash: 'password123',
    avatarUrl: 'https://placehold.co/40x40.png'
  },
  {
    id: 'user-manager',
    name: 'Manager User',
    email: 'manager@proposer.ai',
    role: 'Manager',
    password_bcrypt_hash: 'password123',
    avatarUrl: 'https://placehold.co/40x40.png'
  },
  {
    id: 'user-approver',
    name: 'Approver User',
    email: 'approver@proposer.ai',
    role: 'Approver',
    password_bcrypt_hash: 'password123',
    avatarUrl: 'https://placehold.co/40x40.png'
  },
  {
    id: 'user-editor',
    name: 'Editor User',
    email: 'editor@proposer.ai',
    role: 'Editor',
    password_bcrypt_hash: 'password123',
    avatarUrl: 'https://placehold.co/40x40.png'
  },
   {
    id: 'user-reviewer',
    name: 'Reviewer User',
    email: 'reviewer@proposer.ai',
    role: 'Reviewer',
    password_bcrypt_hash: 'password123',
    avatarUrl: 'https://placehold.co/40x40.png'
  },
  {
    id: 'user-viewer',
    name: 'Viewer User',
    email: 'viewer@proposer.ai',
    role: 'Viewer',
    password_bcrypt_hash: 'password123',
    avatarUrl: 'https://placehold.co/40x40.png'
  }
];

export const proposals: Proposal[] = [
  {
    id: 'PROP-001',
    title: 'Project Phoenix - Cloud Migration',
    client: 'Innovate Corp',
    status: 'Submitted',
    progress: 90,
    lastUpdated: '2 hours ago',
    team: [
      { name: 'Alice', avatarUrl: 'https://placehold.co/32x32.png', email: 'alice@example.com', role: 'Editor' },
      { name: 'Bob', avatarUrl: 'https://placehold.co/32x32.png', email: 'bob@example.com', role: 'Reviewer' },
    ],
    content: 'This proposal outlines a phased approach to migrating Innovate Corp\'s on-premise infrastructure to a secure and scalable cloud environment. The solution focuses on minimizing downtime and ensuring data integrity throughout the process.',
    objective: 'Migrate on-premise infrastructure to the cloud to improve scalability, reduce operational costs, and enhance security.',
    industry: 'Technology',
    value: 150000,
    region: 'North America',
    owner: 'Alex Smith',
    submittedBy: 'manager@proposer.ai'
  },
  {
    id: 'PROP-002',
    title: 'Enterprise AI-Powered Chatbot',
    client: 'GlobalBank',
    status: 'Won',
    progress: 100,
    lastUpdated: '1 day ago',
    team: [
      { name: 'Charlie', avatarUrl: 'https://placehold.co/32x32.png', email: 'charlie@example.com', role: 'Manager' },
      { name: 'Diana', avatarUrl: 'https://placehold.co/32x32.png', email: 'diana@example.com', role: 'Viewer' },
    ],
    content: 'This document proposes the development and integration of an enterprise-grade, AI-powered chatbot to handle customer support inquiries for GlobalBank. The chatbot will be trained on GlobalBank\'s knowledge base and integrated with existing CRM systems.',
    objective: 'Improve customer service efficiency and reduce response times by implementing an AI chatbot.',
    industry: 'Finance',
    value: 275000,
    region: 'EMEA',
    owner: 'Brenda Johnson'
  },
  {
    id: 'PROP-003',
    title: 'Supply Chain Optimization Platform',
    client: 'QuickShip Logistics',
    status: 'Approved',
    progress: 100,
    lastUpdated: '3 days ago',
    team: [
      { name: 'Eve', avatarUrl: 'https://placehold.co/32x32.png', email: 'eve@example.com', role: 'Admin' },
    ],
    content: 'We propose a comprehensive supply chain optimization platform for QuickShip Logistics. This platform will leverage real-time data analytics and machine learning to forecast demand, optimize routes, and manage inventory, leading to significant cost savings and efficiency gains.',
    objective: 'Develop a platform to optimize supply chain operations, reducing costs and improving delivery times.',
    industry: 'Logistics',
    value: 450000,
    region: 'APAC',
    owner: 'Charles Davis'
  },
  {
    id: 'PROP-004',
    title: 'Cybersecurity Threat Analysis',
    client: 'HealthCare Secure',
    status: 'Lost',
    progress: 100,
    lastUpdated: '1 week ago',
    team: [
      { name: 'Frank', avatarUrl: 'https://placehold.co/32x32.png', email: 'frank@example.com', role: 'Editor' },
      { name: 'Grace', avatarUrl: 'https://placehold.co/32x32.png', email: 'grace@example.com', role: 'Reviewer' },
      { name: 'Heidi', avatarUrl: 'https://placehold.co/32x32.png', email: 'heidi@example.com', role: 'Viewer' },
    ],
    content: 'A comprehensive cybersecurity threat analysis for HealthCare Secure, including vulnerability scanning, penetration testing, and a full report on findings and mitigation strategies.',
    objective: 'Identify and mitigate cybersecurity vulnerabilities to protect sensitive patient data.',
    industry: 'Healthcare',
    value: 80000,
    region: 'North America',
    owner: 'Alex Smith'
  },
   {
    id: 'PROP-005',
    title: 'Retail Analytics Dashboard',
    client: 'FashionForward',
    status: 'In Review',
    progress: 60,
    lastUpdated: '2 days ago',
    team: [
      { name: 'Ivy', avatarUrl: 'https://placehold.co/32x32.png', email: 'ivy@example.com', role: 'Editor' },
    ],
    content: 'Proposal for a retail analytics dashboard to track sales, inventory, and customer behavior in real-time.',
    objective: 'Provide data-driven insights to optimize retail operations.',
    industry: 'Retail',
    value: 120000,
    region: 'EMEA',
    owner: 'Brenda Johnson'
  },
  {
    id: 'PROP-006',
    title: 'Marketing Automation Setup',
    client: 'StartupX',
    status: 'Draft',
    progress: 20,
    lastUpdated: '5 hours ago',
    team: [
      { name: 'Jack', avatarUrl: 'https://placehold.co/32x32.png', email: 'jack@example.com', role: 'Owner' },
    ],
    content: 'Setting up a full marketing automation suite for StartupX to nurture leads and drive conversions.',
    objective: 'Implement marketing automation to scale customer acquisition.',
    industry: 'SaaS',
    value: 50000,
    region: 'North America',
    owner: 'Alex Smith'
  },
];

export const templates: Template[] = [
    {
        id: 'TPL-01',
        title: 'Standard SaaS Proposal',
        description: 'A general-purpose template for software-as-a-service offerings.',
        category: 'Software',
        usageCount: 125,
        author: 'Sales Enablement',
        successRate: 68,
        content: `**1. Executive Summary**
This proposal outlines our Software-as-a-Service (SaaS) solution designed to address [Client's Pain Point]. Our platform, [Your Product Name], offers [Key Benefit 1], [Key Benefit 2], and [Key Benefit 3].

**2. Proposed Solution**
- Feature A: Description of Feature A.
- Feature B: Description of Feature B.
- Feature C: Description of Feature C.

**3. Pricing**
- Basic Plan: $X/month
- Pro Plan: $Y/month
- Enterprise Plan: Custom Pricing

**4. Next Steps**
We recommend a follow-up call to discuss your specific needs and provide a personalized demo.`
    },
    {
        id: 'TPL-02',
        title: 'Professional Services Agreement',
        description: 'Template for consulting, implementation, and other professional services.',
        category: 'Services',
        usageCount: 88,
        author: 'Legal Team',
        successRate: 82,
        content: `**1. Scope of Services**
This Agreement covers the following professional services: [List of Services, e.g., Project Management, Technical Consulting, Training].

**2. Deliverables**
- [Deliverable 1]
- [Deliverable 2]

**3. Timeline**
The project is estimated to be completed within [Number] weeks, starting from [Start Date].

**4. Fees & Payment**
The total cost for these services is [Total Cost], payable as follows: [Payment Schedule].`
    },
    {
        id: 'TPL-03',
        title: 'Cloud Infrastructure Proposal (AWS)',
        description: 'A detailed template for proposing AWS-based cloud solutions.',
        category: 'Infrastructure',
        usageCount: 72,
        author: 'Cloud CoE',
        successRate: 75,
        content: `**1. Introduction**
This document details a proposal for cloud infrastructure hosting on Amazon Web Services (AWS) for [Client Name].

**2. Architecture Overview**
- Virtual Private Cloud (VPC) design
- EC2 Instance specifications
- S3 for object storage
- RDS for managed databases

**3. Security & Compliance**
- IAM Roles and Policies
- Security Group configurations
- Encryption at rest and in transit

**4. Cost Estimate**
A detailed breakdown of estimated monthly AWS costs is attached.`
    },
    {
        id: 'TPL-04',
        title: 'Enterprise Security Assessment',
        description: 'For cybersecurity assessment and penetration testing services.',
        category: 'Security',
        usageCount: 45,
        author: 'Cybersecurity Team',
        successRate: 61,
        content: `**1. Engagement Objectives**
- Identify vulnerabilities in the [Client Application/Network].
- Assess the business risk associated with identified vulnerabilities.
- Provide actionable recommendations for remediation.

**2. Scope**
The following assets are in scope for this assessment:
- [List of IPs, URLs, applications]

**3. Methodology**
Our assessment will follow industry-standard methodologies, including:
- Information Gathering
- Threat Modeling
- Vulnerability Analysis
- Penetration Testing
- Reporting

**4. Deliverables**
A final report containing an executive summary, detailed technical findings, and remediation guidance.`
    }
];

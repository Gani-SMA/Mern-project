/**
 * ResolveIT - Server Initial Data & Seed State
 */

export const INITIAL_TICKETS = [
  {
    id: "RES-2026-8812",
    title: "Double Charged $249.00 on Annual Subscription Renewal",
    category: "Billing & Payments",
    priority: "Critical",
    status: "Escalated",
    slaHours: 6,
    createdAt: "2026-10-06T14:30:00.000Z",
    deadline: "2026-10-07T20:30:00.000Z",
    customer: {
      name: "Marcus Aurelius Chen",
      email: "marcus.chen@techinnovations.io",
      phone: "+1 (555) 438-9201",
      orderRef: "INV-2026-99482"
    },
    incidentDate: "2026-10-05",
    desiredResolution: "Full Refund",
    description: "My credit card was charged twice ($249.00 x 2) on Oct 5th for our annual cloud platform subscription renewal under Invoice INV-2026-99482. I reached out to standard chat support 24 hours ago with zero response. This has locked part of my departmental card limit and requires immediate chargeback or same-day reversal.",
    securityHash: "0x8F92A7BC349E",
    assignedOfficer: "Priya Patel (Consumer Ombudsman)",
    sentiment: "Frustrated / High Urgency",
    csat: null,
    timeline: [
      { step: "Grievance Lodged", time: "Oct 06, 02:30 PM", desc: "Ticket automatically ingested via Self-Service Portal & assigned Critical SLA." },
      { step: "Triage & SLA Bound", time: "Oct 06, 03:00 PM", desc: "Prioritized due to duplicate financial deduction alert." },
      { step: "Resolver Assigned", time: "Oct 06, 03:45 PM", desc: "Case assigned to Senior Billing Specialist Marcus Vance." },
      { step: "Escalated to Ombudsman", time: "Oct 07, 09:15 AM", desc: "Escalated due to SLA threshold breach (over 18h). Assigned to Director Priya Patel." }
    ],
    messages: [
      {
        id: "msg-1",
        sender: "customer",
        author: "Marcus Chen",
        timestamp: "Oct 06, 02:30 PM",
        text: "Please find attached bank statement screenshot showing duplicate charges of $249.00 posted within 4 seconds of each other.",
        isInternal: false
      },
      {
        id: "msg-2",
        sender: "agent",
        author: "Marcus Vance (Billing Lead)",
        timestamp: "Oct 06, 04:10 PM",
        text: "Hello Marcus, thank you for providing the statement. We have identified an API gateway retry anomaly on Oct 5th. We have flagged the secondary transaction #TXN-99812 for immediate voiding.",
        isInternal: false
      },
      {
        id: "msg-3",
        sender: "agent",
        author: "Priya Patel (Ombudsman)",
        timestamp: "Oct 07, 09:30 AM",
        text: "INTERNAL AUDIT NOTE: Payment processor confirmation code received (STRIPE-REF-9921). Direct refund batch initiated. Estimated settlement within 2 hours.",
        isInternal: true
      }
    ]
  },
  {
    id: "RES-2026-4402",
    title: "Damaged Precision Display Panel on Delivery + Crushed Box",
    category: "Product Quality & Defect",
    priority: "High",
    status: "Resolved",
    slaHours: 24,
    createdAt: "2026-10-04T09:15:00.000Z",
    deadline: "2026-10-05T09:15:00.000Z",
    customer: {
      name: "Dr. Evelyn Reed",
      email: "evelyn.reed@bioresearch.org",
      phone: "+1 (555) 782-3341",
      orderRef: "SHP-88391-US"
    },
    incidentDate: "2026-10-03",
    desiredResolution: "Product Replacement",
    description: "Ordered 4K UltraColor Diagnostic Display for clinical lab work. Package arrived via standard courier with punctured outer packaging and cracked glass LCD substrate. Device powers on with vertical chromatic distortion.",
    securityHash: "0x4C19B82D77EA",
    assignedOfficer: "Elena Rostova (Logistics Escalations)",
    sentiment: "Disappointed / Calm",
    csat: {
      stars: 5,
      feedback: "Exceptional replacement turnaround! Elena dispatched an express unit within 6 hours. Very impressed.",
      submittedAt: "2026-10-05T16:00:00.000Z"
    },
    timeline: [
      { step: "Grievance Lodged", time: "Oct 04, 09:15 AM", desc: "Customer filed defect report with photographic proof of damaged package." },
      { step: "Damage Inspection", time: "Oct 04, 11:20 AM", desc: "Warehouse QA verified transit shock label breach with courier carrier." },
      { step: "Replacement Dispatched", time: "Oct 04, 02:45 PM", desc: "Priority replacement order #ORD-REP-4402 dispatched via Air Express." },
      { step: "Customer Confirmed & Closed", time: "Oct 05, 04:00 PM", desc: "New unit received in pristine condition. CSAT rating 5/5 submitted." }
    ],
    messages: [
      {
        id: "msg-101",
        sender: "agent",
        author: "Elena Rostova (Logistics)",
        timestamp: "Oct 04, 11:30 AM",
        text: "Dr. Reed, we sincerely apologize for the transit mishandling. A brand new, QA-certified display has been packed in reinforced flight-grade foam and dispatched via FedEx Next-Day Air #FX-9948123.",
        isInternal: false
      }
    ]
  },
  {
    id: "RES-2026-1094",
    title: "SSO Enterprise Login Bug & 2FA Auth Loop",
    category: "Technical Support & Software",
    priority: "High",
    status: "Under Investigation",
    slaHours: 12,
    createdAt: "2026-10-07T08:00:00.000Z",
    deadline: "2026-10-07T20:00:00.000Z",
    customer: {
      name: "Samantha Brooks",
      email: "s.brooks@fintechnexus.com",
      phone: "+1 (555) 399-2819",
      orderRef: "CORP-OKTA-892"
    },
    incidentDate: "2026-10-07",
    desiredResolution: "Technical Fix / Bug Patch",
    description: "Since the v4.8 platform update rolled out at 06:00 UTC, our 45 staff members using Okta SAML SSO are trapped in an endless redirect authentication loop with error code AUTH_TOKEN_MISMATCH_401.",
    securityHash: "0x1A88FD442299",
    assignedOfficer: "Devon Price (Tech Tier 3)",
    sentiment: "High Urgency / Business Impact",
    csat: null,
    timeline: [
      { step: "Grievance Lodged", time: "Oct 07, 08:00 AM", desc: "System incident raised with Okta SAML logs." },
      { step: "Engineering Review", time: "Oct 07, 08:45 AM", desc: "Tier 3 DevOps assigned; identified SSL certificate thumbprint discrepancy." }
    ],
    messages: [
      {
        id: "msg-201",
        sender: "agent",
        author: "Devon Price (Tech Tier 3)",
        timestamp: "Oct 07, 09:10 AM",
        text: "Samantha, our identity team is rolling a hotfix patch v4.8.1 to correct the SAML Assertion signing cert. Deploying to production in ~25 minutes.",
        isInternal: false
      }
    ]
  },
  {
    id: "RES-2026-6731",
    title: "Shipment Marked 'Delivered' but Never Arrived at Porch",
    category: "Shipping & Delivery",
    priority: "Medium",
    status: "Open",
    slaHours: 24,
    createdAt: "2026-10-07T11:20:00.000Z",
    deadline: "2026-10-08T11:20:00.000Z",
    customer: {
      name: "Nathaniel Drake",
      email: "nate.drake@adventure.co",
      phone: "+1 (555) 902-8811",
      orderRef: "PKG-771829"
    },
    incidentDate: "2026-10-06",
    desiredResolution: "Product Replacement",
    description: "Courier tracking indicates package was left on 'Front Porch' yesterday at 3 PM, but security camera footage confirms no delivery vehicle visited our property during that timeframe. Neighboring houses checked with no luck.",
    securityHash: "0x77E1BC884012",
    assignedOfficer: "Elena Rostova (Logistics Escalations)",
    sentiment: "Inquiring / Concerned",
    csat: null,
    timeline: [
      { step: "Grievance Lodged", time: "Oct 07, 11:20 AM", desc: "Lost transit ticket generated." }
    ],
    messages: []
  },
  {
    id: "RES-2026-5520",
    title: "Unsatisfactory Customer Support Interaction & Rude Representative",
    category: "Customer Service Conduct",
    priority: "Low",
    status: "Resolved",
    slaHours: 48,
    createdAt: "2026-10-03T10:00:00.000Z",
    deadline: "2026-10-05T10:00:00.000Z",
    customer: {
      name: "Clara Oswald",
      email: "clara.o@timetravel.edu",
      phone: "+1 (555) 123-4567",
      orderRef: "SRV-CHAT-4819"
    },
    incidentDate: "2026-10-02",
    desiredResolution: "Formal Apology & Process Review",
    description: "During a phone inquiry regarding warranty terms, representative dismissed my inquiry abruptly and terminated the call without providing a ticket reference or transfer.",
    securityHash: "0x9812BBCC4412",
    assignedOfficer: "Priya Patel (Consumer Ombudsman)",
    sentiment: "Offended",
    csat: {
      stars: 4,
      feedback: "Appreciate the personal call from management and the $25 courtesy credit.",
      submittedAt: "2026-10-04T14:30:00.000Z"
    },
    timeline: [
      { step: "Grievance Lodged", time: "Oct 03, 10:00 AM", desc: "Complaint logged regarding agent interaction." },
      { step: "Audio QA Audit", time: "Oct 03, 03:00 PM", desc: "Call recording audited by Support Quality Lead." },
      { step: "Resolution & Apology", time: "Oct 04, 11:00 AM", desc: "Formal apology letter sent with coaching review notice." }
    ],
    messages: []
  }
];

export const KB_ARTICLES = [
  {
    id: "kb-1",
    category: "Billing",
    title: "How do duplicate charge investigations and refund timelines work?",
    snippet: "Understand our automated payment gateway reconciliation, dispute proof requirements, and 2-5 day refund settlement windows.",
    readTime: "3 min read",
    likes: 342,
    body: `
      <h3>Understanding Charge Reversals</h3>
      <p>When an unexpected duplicate transaction occurs, it is typically an authorization hold triggered by a network timeout. Here is how ResolveIT handles your billing disputes:</p>
      <ul>
        <li><strong>Instant Voiding:</strong> If reported within 24 hours of transaction, our billing resolvers trigger direct API voids that disappear from your pending bank transactions without fees.</li>
        <li><strong>Settlement Refunds:</strong> If the transaction is already posted, card processor settlements take 2 to 5 business days depending on your issuing financial institution.</li>
        <li><strong>Expedited Credit:</strong> In cases of departmental freeze, our Ombudsman can issue instant platform credits to keep your mission-critical operations uninterrupted.</li>
      </ul>
      <p>To expedite your claim, always attach the PDF statement or receipt screenshot displaying the timestamp and authorization code.</p>
    `
  },
  {
    id: "kb-2",
    category: "Delivery",
    title: "Transit Damage & Misdelivered Package Redressal Protocol",
    snippet: "Step-by-step instructions on filing insurance claims, photos needed, and same-day priority reshipment eligibility.",
    readTime: "4 min read",
    likes: 218,
    body: `
      <h3>Transit Damage & Lost Freight Protocol</h3>
      <p>All merchandise dispatched by our platform carries full Tier-1 freight transit coverage. If your parcel arrives damaged or is marked delivered prematurely:</p>
      <ol>
        <li><strong>Retain All Packaging:</strong> Do not discard shipping boxes or internal shock labels until our logistics inspector approves the claim.</li>
        <li><strong>Take 3 Clear Photos:</strong> (1) Outer box condition, (2) Shipping barcode label, (3) Close-up of product physical damage.</li>
        <li><strong>Submit Claim:</strong> File via the ResolveIT Portal under 'Product Quality & Defect'. High-priority replacement orders are dispatched within 6 business hours.</li>
      </ol>
    `
  },
  {
    id: "kb-3",
    category: "Technical",
    title: "SSO Authentication, SAML 2.0 Errors & Token Refresh Failures",
    snippet: "Troubleshooting guide for IT admins experiencing Okta, Azure AD, or Google Workspace enterprise login loops.",
    readTime: "5 min read",
    likes: 512,
    body: `
      <h3>Enterprise SSO Troubleshooting</h3>
      <p>If your organization encounters error code <code>AUTH_TOKEN_MISMATCH_401</code> or endless login redirect loops:</p>
      <ul>
        <li><strong>Verify SAML Certificate:</strong> Ensure your identity provider (IdP) public X.509 certificate has not expired in the Security Settings tab.</li>
        <li><strong>Clear ACS URL Cache:</strong> Flush local browser DNS and cookies for the <code>*.resolveit.io</code> domain.</li>
        <li><strong>Emergency Admin Bypass:</strong> Organization Super-Admins can log in via <code>/admin/recovery-login</code> with an authenticated hardware security key (FIDO2/WebAuthn).</li>
      </ul>
    `
  },
  {
    id: "kb-4",
    category: "Warranty",
    title: "30-Day No-Questions-Asked Satisfaction & Hardware Warranty",
    snippet: "Terms of warranty repair, zero-restocking fees, cross-shipping policies, and customer protection bylaws.",
    readTime: "2 min read",
    likes: 189,
    body: `
      <h3>Warranty & Consumer Protection Policy</h3>
      <p>Every product and enterprise subscription under ResolveIT is backed by a legally binding SLA guarantee:</p>
      <ul>
        <li><strong>30-Day Right to Remedy:</strong> Full refund or immediate substitute within 30 days of receipt if performance specifications fail to meet catalog promises.</li>
        <li><strong>Zero Cost Return Shipping:</strong> We provide prepaid DHL/FedEx return waybills.</li>
        <li><strong>Ombudsman Right of Appeal:</strong> If an agent resolution is unsatisfactory, users have an automatic right to escalate directly to the Consumer Ombudsman for independent arbitration.</li>
      </ul>
    `
  }
];

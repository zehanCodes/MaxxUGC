# TECH UGC CREATOR OPERATING SYSTEM
## Master Product Scope & Requirements Document
**Version:** 1.0
**Status:** Product planning / Pre-development
**Product type:** SaaS-enabled, human-powered video editing and creator operations platform
**Primary audience:** Tech UGC creators producing short-form content for software companies, AI startups, mobile apps, and technology brands.

---

# 1. PRODUCT OVERVIEW

## 1.1 Product Vision

Build an all-in-one platform that allows tech UGC creators to outsource video editing to a managed team of human editors, organize brand campaigns, track their revenue and social media performance, generate portfolios, and eventually automate content distribution.

The platform combines three functions:

1. **Editing Operations:** A managed video editing service powered by a Philippines-based editing team.
2. **Creator Business Management:** Campaign organization, revenue tracking, analytics, and portfolio generation.
3. **Content Distribution Automation:** Account preparation, scheduling, cross-posting, and publishing management.

The platform should feel like a comprehensive operating system for creators rather than a collection of disconnected tools.

## 1.2 Critical Product Distinction

**This is NOT an AI video editing platform.**

Video editing is performed by real human editors.

The platform automates the operational processes surrounding editing, including:

- Ticket submission and organization.
- Shared editing queues.
- Editor scheduling and shift management.
- Ticket claiming and ownership.
- Asset management.
- Revision workflows.
- Editor compensation calculations.
- Deadline tracking.
- Notifications.
- Administrative oversight.
- Eventually, social media publishing and analytics.

Do not design an AI-generated video editing engine as part of this product.

## 1.3 Core Value Proposition

For creators:

"Upload your footage, submit an editing request, and receive professionally edited content without managing individual editors."

For editors:

"Work scheduled shifts, claim available editing tickets, complete videos, and track your earnings from one dashboard."

For administrators:

"Manage a distributed editing operation with real-time visibility into tickets, staffing, quality, deadlines, and labor costs."

---

# 2. PRODUCT DEVELOPMENT ROADMAP

The platform will be developed across three major levels.

## LEVEL 1 — EDITING OPERATIONS MVP

**Highest priority. Build first.**

Includes:

- Creator Dashboard.
- Editor Dashboard.
- Admin Dashboard.
- Campaign management.
- Private campaign B-roll libraries.
- Editing ticket submission.
- Shared editor ticket queue.
- Shift scheduling and attendance.
- Human video editing workflow.
- Creator approvals and revisions.
- Editor compensation tracking.
- Administrative oversight.
- Basic operational notifications.

**Level 1 success condition:**

A creator can create a campaign, upload footage and B-roll, submit editing tickets, receive completed videos, request revisions, and approve deliverables.

Editors can work scheduled shifts, claim tickets from a shared queue, submit finished videos, and view their earnings.

Administrators can manage the entire process.

## LEVEL 2 — CREATOR BUSINESS MANAGEMENT

Build after validating Level 1.

Includes:

- Creator revenue dashboard.
- Campaign financial tracking.
- Deliverable quotas.
- Payment tracking.
- Social account management.
- Social media analytics.
- Campaign performance analytics.
- Post-level performance reporting.
- Portfolio generator.
- Public creator portfolios.
- Performance-based case studies.

## LEVEL 3 — CONTENT DISTRIBUTION AUTOMATION

Build after Level 2.

Includes:

- Social account connection management.
- Account warm-up and onboarding workflows.
- Posting calendar.
- Bulk scheduling.
- Cross-platform publishing.
- Automated publishing queues.
- Platform-specific captions.
- Posting failure handling.
- Recurring posting schedules.
- Content distribution analytics.
- Workflow automation rules.

Account warm-up should use platform-compliant onboarding, posting cadence, and account health processes. Do not assume automated artificial engagement is permitted.

---

# 3. LEVEL 1 SYSTEM ARCHITECTURE

The MVP consists of three interconnected role-based dashboards.

## 3.1 Creator Dashboard

Used by customers purchasing editing services.

Primary responsibilities:

- Create campaigns.
- Manage campaign assets.
- Submit editing requests.
- Track editing progress.
- Review completed videos.
- Request revisions.
- Approve deliverables.
- Download completed content.

## 3.2 Editor Dashboard

Used by the Philippines-based editing team.

Primary responsibilities:

- View scheduled shifts.
- Clock in and out.
- Browse the shared editing queue.
- Claim available tickets.
- Access editing instructions and assets.
- Submit completed videos.
- Handle revisions.
- Track earnings.
- Request schedule changes.

## 3.3 Admin Dashboard

Used by platform operators and managers.

Primary responsibilities:

- Oversee all editing tickets.
- Manage creators.
- Manage editors.
- Manage schedules.
- Monitor editing deadlines.
- Reassign tickets.
- Review quality.
- Resolve disputes.
- Track editor earnings.
- Approve payroll adjustments.
- Manage platform operations.

## 3.4 Shared Backend

All three dashboards must operate on the same backend.

Core backend systems:

- Authentication.
- Role-based permissions.
- Campaign database.
- Ticket management.
- File storage.
- Asset access control.
- Shift scheduling.
- Queue management.
- Editor earnings.
- Notifications.
- Audit logs.

All ticket and earnings updates must be reflected consistently across relevant dashboards.

---

# 4. USER ROLES & PERMISSIONS

## 4.1 Creator

Creators can:

- Manage their own account.
- Create and edit their own campaigns.
- Upload campaign assets.
- Submit tickets.
- View their own tickets.
- Communicate revision requests.
- Approve completed videos.
- Download their deliverables.

Creators cannot:

- Access another creator's campaigns.
- Access other creators' footage.
- View editor payroll information.
- Manage editor shifts.
- Claim editing tickets.
- Change administrative settings.

## 4.2 Editor

Editors can:

- Access their own dashboard.
- View eligible shared-queue tickets.
- Claim tickets during approved shifts.
- View their claimed tickets.
- Access the assets required for those tickets.
- Upload completed videos.
- View revision requests.
- Track their own earnings.
- Manage shift requests.

Editors cannot:

- Access unrelated creator campaigns.
- View other editors' earnings.
- Change compensation rates.
- Approve their own payroll adjustments.
- Override ticket ownership.
- Access administrative controls.

## 4.3 Admin

Admins can:

- View and manage all tickets.
- Manage creator and editor accounts.
- Approve shifts.
- Reassign tickets.
- Adjust ticket priorities.
- Handle escalations.
- View operational analytics.
- Review editor earnings.
- Approve compensation adjustments.
- View audit logs.

Sensitive actions must be logged.

---

# 5. CREATOR DASHBOARD — DETAILED SPECIFICATION

## 5.1 Navigation

Recommended sidebar:

1. Overview
2. Campaigns
3. Editing Tickets
4. Reviews
5. Deliverables
6. Notifications
7. Settings

Campaign-specific B-roll libraries should live inside individual campaigns rather than in a global asset library.

## 5.2 Creator Overview

The dashboard should display:

**Summary cards:**

- Active campaigns.
- Open editing tickets.
- Tickets currently being edited.
- Videos awaiting approval.
- Completed videos.

**Additional components:**

- Recent ticket activity.
- Upcoming deadlines.
- Latest completed edits.
- Tickets requiring revisions.
- Quick ticket submission.
- Quick campaign creation.

The dashboard should prioritize actionable information.

## 5.3 Campaign Management

Creators can create multiple campaigns.

Each campaign represents an individual brand engagement or content production project.

### Campaign data fields

- Campaign ID.
- Campaign name.
- Brand name.
- Brand logo.
- Campaign description.
- Start date.
- End date, optional.
- Deliverable quota.
- Editing guidelines.
- Default editing instructions.
- Campaign status.
- Created timestamp.
- Updated timestamp.

### Campaign workspace tabs

**Overview**

Displays campaign information, deliverables, progress, and recent activity.

**Tickets**

Displays every editing ticket associated with the campaign.

**B-roll Library**

Stores reusable footage belonging exclusively to the campaign.

**Guidelines**

Contains instructions for editors, including caption styles, editing examples, fonts, colors, music preferences, and brand requirements.

**Deliverables**

Contains approved, completed videos associated with the campaign.

## 5.4 Private Campaign B-roll Library

This is a core MVP feature.

### Definition

Each campaign has its own private B-roll library.

The term "universal" means that assets can be reused across multiple editing tickets **within the same campaign**.

It does not mean assets are automatically shared between different campaigns or creators.

### Example

Creator A has two campaigns:

Campaign A: Haven
Campaign B: Poke

Haven has its own B-roll library.

Poke has its own separate B-roll library.

Ticket #101 and Ticket #102 under Haven can both reference Haven's B-roll.

A Poke editor cannot access Haven's assets unless separately authorized through an applicable ticket.

### Supported asset types

- MP4 videos.
- MOV videos.
- Screen recordings.
- PNG images.
- JPG images.
- Other supported media formats as technically appropriate.

### Required capabilities

- Upload one or multiple files.
- View thumbnails.
- Preview video footage.
- Rename assets.
- Create folders.
- Assign tags.
- Search assets.
- Download files.
- Archive assets.
- Delete assets subject to retention rules.
- Select assets when creating tickets.
- Reuse assets across tickets in the same campaign.

### Access control

The creator owns and manages the campaign library.

Editors receive access to the campaign assets required for their claimed tickets.

Access must be revoked when no longer authorized.

The system should avoid duplicating asset files every time a ticket references them.

### Data relationships

Campaign → B-roll Library → Assets.

Campaign → Multiple Tickets.

Tickets → References to B-roll Assets.

## 5.5 Editing Ticket Submission

Creators must be able to submit editing requests through a structured form.

### Required fields

- Campaign selection.
- Ticket title.
- Raw footage upload.
- Editing instructions.

### Optional fields

- Reference videos.
- Selected campaign B-roll assets.
- Preferred caption style.
- Additional text overlays.
- CTA instructions.
- Desired final video length.
- Priority.
- Notes.
- Requested deadline, subject to service rules.

### Submission behavior

After submission:

1. Generate a unique ticket ID.
2. Store the raw footage.
3. Link the ticket to its campaign.
4. Save all instructions and references.
5. Set the ticket to the appropriate open status.
6. Make it available in the shared editor queue.
7. Notify eligible editors or update the queue.
8. Display the ticket in the creator dashboard.

## 5.6 Ticket Tracking

Creators should see:

- Ticket ID.
- Campaign.
- Title.
- Current status.
- Submission date.
- Expected completion deadline.
- Assigned editor status, where appropriate.
- Last updated timestamp.
- Submitted video versions.
- Revision history.

Ticket detail pages should include a chronological activity history.

## 5.7 Video Review & Approval

When an editor submits a finished video, the creator receives a notification.

The creator can:

- Preview the video.
- Download the submitted version.
- Approve the video.
- Request revisions.

### Revision submission

Revision requests should support:

- Written feedback.
- Optional timestamps.
- Reference images or files.
- Specific requested changes.

The original editor should receive the revision by default.

Admins may reassign revision work when necessary.

## 5.8 Deliverables

Approved videos should appear in the campaign's Deliverables tab and in the creator's overall Deliverables page.

Each deliverable includes:

- Video title.
- Campaign.
- Associated ticket.
- Final video file.
- Approval date.
- Download action.
- Version history.

---

# 6. EDITOR DASHBOARD — DETAILED SPECIFICATION

## 6.1 Navigation

Recommended sidebar:

1. Overview
2. Shared Queue
3. My Tickets
4. Submitted
5. Schedule
6. Earnings
7. Profile

## 6.2 Editor Overview

Displays:

- Current shift status.
- Shift start and end time.
- Time remaining in shift.
- Current shift earnings.
- Completed videos this shift.
- Active tickets.
- Pending revisions.
- Eligible standby time.
- Available ticket count.

## 6.3 Shared Ticket Queue

This is the central editing workflow.

**Editors claim tickets themselves from a shared queue.**

Tickets are not automatically assigned as the default behavior.

### Queue visibility

Editors can browse eligible tickets.

Ticket information includes:

- Ticket ID.
- Campaign or brand.
- Ticket title.
- Editing requirements summary.
- Estimated complexity, if available.
- Deadline.
- Priority.
- Available assets.
- Claim action.

### Claim eligibility

An editor can claim a ticket only when:

- Their account is active.
- They are currently clocked into an approved shift.
- They are eligible for that ticket.
- The ticket is unclaimed.
- Their active ticket limit has not been reached.

### First-claim-wins logic

Claiming must be atomic.

If two editors attempt to claim the same ticket simultaneously, only one claim can succeed.

The other editor receives a message that the ticket is no longer available.

### After claiming

The ticket:

- Disappears from the available shared queue.
- Appears in the editor's My Tickets page.
- Records the editor's ID.
- Records the claim timestamp.
- Grants the editor access to relevant assets.
- Changes status to Claimed.

## 6.4 My Tickets

Displays tickets currently assigned to the editor.

Each ticket includes:

- Ticket information.
- Raw footage.
- Editing instructions.
- Campaign B-roll.
- Reference videos.
- Deadline.
- Status.
- Submission controls.

Editors can mark work as in progress and upload finished videos.

## 6.5 Submitted Videos

The Submitted page includes:

- Submitted videos awaiting review.
- Videos approved by creators.
- Videos requiring revisions.
- Submission timestamps.
- Revision counts.
- Final outcomes.

## 6.6 Editor Scheduling

Editors work approved shifts.

### Scheduling features

- Weekly schedule.
- Shift calendar.
- Availability submission.
- Clock-in.
- Clock-out.
- Upcoming shifts.
- Extra shift requests.
- Shift change requests.
- Day-off requests.

### Shift states

- Scheduled.
- Active.
- Completed.
- Missed.
- Canceled.

### Important operational rules

Editors may claim tickets only during active approved shifts.

Editors who finish their scheduled shifts should not automatically lose ownership of unfinished tickets.

Admins must be able to manage tickets extending beyond shifts.

Use consistent timezone handling, including support for Philippine Time.

## 6.7 Editor Earnings

The compensation model is:

**$2.50 flat pay per qualifying completed video.**

**$3.00 per hour of eligible standby time.**

Standby pay applies only when:

1. The editor is clocked into an approved shift.
2. The editor has no active assigned editing tickets.
3. There are no eligible editing tickets available for that editor to claim.

An administrator may explicitly authorize standby as an exception.

### Important rule

An editor cannot earn standby pay simply by refusing to claim available tickets.

### Formula

Total shift earnings:

(Video count × $2.50) + (Eligible standby hours × $3.00)

### Example

An editor completes 6 qualifying videos and spends 2 eligible hours on standby.

Video earnings: 6 × $2.50 = $15.00.

Standby earnings: 2 × $3.00 = $6.00.

Total: $21.00.

### Earnings dashboard

Display:

- Current shift earnings.
- Video earnings.
- Standby earnings.
- Videos completed.
- Eligible standby time.
- Daily earnings.
- Weekly earnings.
- Monthly earnings.
- Pending payments.
- Paid earnings.
- Earnings history.

### Earnings statuses

- Estimated.
- Pending approval.
- Approved.
- Paid.
- Adjusted.

### Accounting requirements

- Track every earnings event.
- Store compensation rates historically.
- Prevent duplicate video payments.
- Record standby intervals.
- Support admin adjustments.
- Preserve audit logs.
- Avoid retroactively recalculating old shifts when rates change.

The exact event that finalizes per-video pay must be configured before implementation. A reasonable proposed default is creator approval, with admin overrides for exceptional cases.

## 6.8 Editor Performance

Track:

- Tickets claimed.
- Videos submitted.
- Videos approved.
- Revision requests.
- Average turnaround time.
- Missed deadlines.
- Shift attendance.

Do not equate high ticket-claim counts with high performance.

Performance should prioritize completed, accepted work and reliability.

---

# 7. ADMIN DASHBOARD — DETAILED SPECIFICATION

## 7.1 Navigation

1. Operations Overview
2. All Tickets
3. Creators
4. Editors
5. Shifts
6. Quality Control
7. Payroll
8. Audit Logs
9. Settings

## 7.2 Operations Overview

Display:

- Total open tickets.
- Available tickets.
- Claimed tickets.
- Tickets in progress.
- Pending reviews.
- Revision tickets.
- Overdue tickets.
- Editors currently on shift.
- Editors currently on standby.
- Estimated labor cost.
- Recent operational alerts.

## 7.3 Ticket Oversight

Admins can:

- Search all tickets.
- Filter by creator.
- Filter by campaign.
- Filter by editor.
- Filter by status.
- Filter by deadline.
- View full ticket history.
- Adjust ticket priority.
- Reassign tickets.
- Resolve stuck tickets.
- Cancel tickets.
- Handle disputes.

All administrative changes should be recorded.

## 7.4 Editor Management

Admins can:

- Invite editors.
- Activate and deactivate accounts.
- View editor profiles.
- Set eligibility.
- Set active ticket limits.
- Review workload.
- Review performance.
- View earnings.
- Manage permissions.

## 7.5 Shift Management

Admins can:

- Create shifts.
- Approve shifts.
- Edit schedules.
- Review attendance.
- Approve extra shifts.
- Approve shift changes.
- Approve time off.
- Authorize standby exceptions.
- Monitor staffing coverage.

## 7.6 Quality Control

Admins should have access to:

- Submitted videos.
- Revision histories.
- Creator complaints.
- Missed deadlines.
- Editor performance.
- Escalated tickets.

The system should allow admins to intervene without requiring every normal video to pass through mandatory admin approval.

## 7.7 Payroll

The payroll dashboard should display:

- Editor.
- Pay period.
- Approved shifts.
- Completed videos.
- Video earnings.
- Eligible standby hours.
- Standby earnings.
- Adjustments.
- Total owed.
- Payment status.

Admins can approve or adjust payments with an audit trail.

The system should not automatically assume a specific legal worker classification or payroll compliance model. Applicable Philippine labor, tax, and payment requirements must be reviewed separately.

---

# 8. SHARED TICKET STATE MACHINE

Recommended ticket states:

1. Draft.
2. Open.
3. Claimed.
4. In Progress.
5. Submitted for Review.
6. Revision Requested.
7. Approved.
8. Completed.
9. Canceled.

### Normal workflow

Creator submits ticket.

Ticket enters Open status.

Editor claims ticket during approved shift.

Ticket becomes Claimed.

Editor begins work.

Ticket becomes In Progress.

Editor submits finished video.

Ticket becomes Submitted for Review.

Creator approves or requests revisions.

If revision requested, ticket returns to the assigned editor.

If approved, ticket becomes Approved and then Completed.

### Exception workflows

Admins can:

- Reopen a ticket.
- Reassign a ticket.
- Cancel a ticket.
- Resolve an abandoned ticket.
- Override a stuck status.
- Resolve a disputed approval.

The backend must validate allowed state transitions.

---

# 9. AUTOMATED SYSTEM BEHAVIORS

The MVP should automate operations wherever possible without automating the creative editing itself.

## Ticket automation

- Generate ticket IDs.
- Add new tickets to shared queue.
- Remove claimed tickets from shared queue.
- Notify editors of revisions.
- Notify creators of completed submissions.
- Update status history.
- Flag approaching deadlines.
- Flag overdue tickets.

## Shift automation

- Track clock-in and clock-out.
- Validate claim eligibility.
- Track active assignments.
- Calculate eligible standby intervals.
- Stop standby accumulation when eligible tickets become available.
- Track missed shifts.
- Notify admins of staffing gaps.

## Earnings automation

- Calculate video earnings.
- Calculate standby earnings.
- Update shift totals.
- Maintain payment records.
- Prevent duplicate payment events.
- Generate payroll summaries.

## Asset automation

- Associate ticket assets with campaigns.
- Generate video previews or thumbnails.
- Preserve file references.
- Enforce access permissions.
- Revoke editor access when authorization ends.

---

# 10. TECHNICAL ARCHITECTURE

The following stack is a recommendation, not a previously finalized technology decision.

## Frontend

Recommended:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- Component library such as shadcn/ui.

The application should be responsive, with desktop-first layouts for editors and administrators.

## Backend

Recommended:

- PostgreSQL.
- Supabase or a comparable managed backend.
- Secure authentication.
- Role-based access control.
- Background job processing.
- Transactional ticket claiming.

## File Storage

Recommended:

- Cloudflare R2, AWS S3, or equivalent object storage.
- Signed upload URLs.
- Signed download URLs.
- Private storage buckets.
- File metadata.
- Video previews.

## Real-time Features

Use real-time subscriptions or an equivalent event system for:

- Ticket queue updates.
- Ticket claims.
- Submission notifications.
- Revision requests.
- Shift status.
- Earnings updates.

## Background Jobs

Use background processing for:

- Video preview generation.
- Notifications.
- Deadline monitoring.
- Standby time calculations.
- Earnings reconciliation.
- File processing.

## Security

Required:

- Server-side authorization.
- Creator data isolation.
- Campaign asset permissions.
- Editor ticket-based access.
- Protected file downloads.
- Secure payment information.
- Audit logging.
- Rate limiting.
- Input validation.

---

# 11. CORE DATABASE ENTITIES

## User

- id
- name
- email
- role
- account_status
- created_at

## CreatorProfile

- id
- user_id
- profile_information

## EditorProfile

- id
- user_id
- active_status
- ticket_limit
- compensation_rate_id

## Campaign

- id
- creator_id
- name
- brand_name
- description
- status
- guidelines
- created_at

## CampaignAsset

- id
- campaign_id
- uploaded_by
- file_url_or_storage_key
- asset_type
- filename
- folder
- tags
- created_at

## Ticket

- id
- creator_id
- campaign_id
- assigned_editor_id
- title
- instructions
- priority
- status
- deadline
- created_at
- claimed_at
- completed_at

## TicketAsset

- id
- ticket_id
- campaign_asset_id_or_upload_reference
- asset_role

## TicketSubmission

- id
- ticket_id
- editor_id
- file_reference
- version_number
- submitted_at

## RevisionRequest

- id
- ticket_id
- submission_id
- requested_by
- instructions
- created_at
- resolved_at

## EditorShift

- id
- editor_id
- scheduled_start
- scheduled_end
- actual_start
- actual_end
- status

## StandbyInterval

- id
- editor_id
- shift_id
- started_at
- ended_at
- eligibility_reason
- approved_duration

## EarningsEntry

- id
- editor_id
- shift_id
- ticket_id
- earning_type
- amount
- rate_snapshot
- status
- created_at

## PayrollPeriod

- id
- start_date
- end_date
- status
- approved_at

## Notification

- id
- user_id
- type
- message
- read_at
- created_at

## AuditLog

- id
- actor_id
- entity_type
- entity_id
- action
- previous_value
- new_value
- timestamp

This schema is conceptual. Final relationships, constraints, indexes, and storage types should be designed before implementation.

---

# 12. CRITICAL BACKEND RULES

## Ticket claiming

Claims must use an atomic database operation or transaction.

Two editors must never successfully claim the same open ticket.

## Standby compensation

Standby eligibility must be calculated on the server.

It must not depend solely on a browser timer.

The system must check:

- Approved active shift.
- Clock-in status.
- Active assignments.
- Eligible available tickets.
- Admin-authorized exceptions.

Historical standby intervals must remain auditable.

## File permissions

Editors must not be able to access campaign files merely by guessing or modifying a URL.

Access must be validated against current ticket authorization.

## Earnings integrity

Earnings must be recorded as auditable ledger entries.

Do not rely on a single editable total balance.

## Revision handling

Revisions must preserve previous video versions and feedback.

The original editor receives the revision by default, with administrative reassignment available.

---

# 13. LEVEL 2 — FUTURE FEATURES

These features should be considered during data modeling but excluded from the initial MVP build.

## Creator Revenue Tracker

Track:

- Revenue by campaign.
- Revenue by brand.
- Per-video compensation.
- Monthly retainers.
- Performance bonuses.
- Pending payments.
- Paid payments.
- Monthly earnings.
- Lifetime earnings.
- Revenue forecasts.

This is **creator revenue**, distinct from the internal editor payroll system.

## Social Account Analytics

Track:

- Connected accounts.
- Account-level views.
- Likes.
- Comments.
- Shares.
- Engagement rate.
- Posting frequency.
- Recent 16 posts.
- Highest-performing posts.
- Performance by campaign.
- Performance by platform.

Where APIs do not provide required data, support clearly labeled manual inputs.

## Portfolio Generator

Allow creators to generate public-facing portfolios using existing platform data.

Features:

- Creator bio.
- Profile image.
- Social links.
- Brand partnerships.
- Selected video examples.
- Performance metrics.
- Testimonials.
- Contact information.
- Public portfolio URL.
- Customizable layouts.

The generator should allow creators to choose which private information becomes public.

---

# 14. LEVEL 3 — FUTURE FEATURES

## Account Warm-Up

Provide compliant account preparation and management tools.

Potential features:

- Account setup checklist.
- Profile completeness.
- Posting cadence planning.
- Account health monitoring.
- Publishing readiness.
- Warm-up progress tracking.

Avoid automated artificial engagement or simulated human activity that violates platform policies.

## Auto Cross-Posting

Allow approved videos to be published across supported social platforms.

Initial targets:

- Instagram Reels.
- TikTok.
- YouTube Shorts.

Actual publishing functionality depends on official API availability, account eligibility, permissions, and platform requirements.

## Scheduling

Features:

- Posting calendar.
- Daily and weekly views.
- Bulk scheduling.
- Recurring posting slots.
- Platform-specific captions.
- Timezone support.
- Publishing queue.
- Failure notifications.
- Retry handling.
- Duplicate-post prevention.

## Workflow Automation

Potential rules:

- Approved video → Add to scheduling queue.
- Scheduled time reached → Attempt publishing.
- Publishing failure → Notify creator.
- Campaign quota behind schedule → Send alert.
- High-performing post → Flag for review.

---

# 15. MVP DEVELOPMENT PRIORITIES

## Phase 1 — Foundation

Build:

- Authentication.
- User roles.
- Creator dashboard shell.
- Editor dashboard shell.
- Admin dashboard shell.
- Database.
- File storage.
- Permissions.

## Phase 2 — Campaigns & Tickets

Build:

- Campaign creation.
- Campaign B-roll libraries.
- Ticket submission.
- Ticket detail pages.
- Shared editing queue.
- Ticket claiming.
- Editor assignments.

## Phase 3 — Editing Workflow

Build:

- Editor submissions.
- Video previews.
- Creator reviews.
- Revision requests.
- Video approvals.
- Deliverables.
- Notifications.

## Phase 4 — Workforce Operations

Build:

- Shift scheduling.
- Clock-in and clock-out.
- Ticket eligibility.
- Standby calculations.
- Video compensation.
- Earnings dashboard.
- Admin payroll oversight.

## Phase 5 — Operational Reliability

Build and test:

- Concurrent claims.
- Access control.
- File permissions.
- Deadline handling.
- Shift edge cases.
- Earnings accuracy.
- Audit logs.
- Error recovery.

---

# 16. MVP ACCEPTANCE CRITERIA

The first MVP is ready for a pilot when:

1. Creators can register and access their dashboard.
2. Creators can create and manage campaigns.
3. Each campaign has a private reusable B-roll library.
4. Creators can submit tickets with raw footage and instructions.
5. Eligible on-shift editors can claim tickets from a shared queue.
6. Two editors cannot claim the same ticket.
7. Editors can access authorized campaign assets.
8. Editors can upload completed video edits.
9. Creators can approve edits or request revisions.
10. Completed videos are accessible in Deliverables.
11. Admins can oversee and reassign tickets.
12. Admins can manage shifts.
13. Editor video earnings are calculated accurately.
14. Eligible standby earnings are calculated accurately.
15. Editors can view their per-shift earnings.
16. Admins can review earnings and adjustments.
17. All three dashboards show consistent ticket information.
18. Creator and campaign data remain private.
19. Critical actions are logged.
20. The workflow can be tested end-to-end with real creators and editors.

---

# 17. PRODUCT DESIGN DIRECTION

The UI should be:

- Modern.
- Minimal.
- Clean.
- Professional.
- Dashboard-oriented.
- Fast to navigate.
- Consistent across all three roles.

Use the provided TurboUGC screenshots as workflow and information architecture references, particularly for the editor console.

Do not assume the screenshots define every backend behavior.

Do not copy branding or visual assets without permission.

### Creator interface

Prioritize simplicity, campaign organization, and ticket visibility.

### Editor interface

Prioritize speed, clear work queues, deadlines, shift status, and earnings.

### Admin interface

Prioritize operational visibility, exception handling, staffing, quality, and labor costs.

---

# 18. OPEN PRODUCT DECISIONS

The following details have not yet been finalized and should not be silently treated as confirmed requirements:

- Product name. **[RESOLVED 2026-10-26: "MAXXUGC"]**
- Creator subscription pricing.
- Number of included editing tickets per subscription.
- Ticket turnaround SLA.
- Maximum active tickets per editor.
- Editor qualification and eligibility rules.
- Whether tickets can be returned voluntarily.
- Exact rules for unfinished tickets at shift end.
- Revision limits and additional revision compensation.
- Whether editor video pay becomes final at submission or creator approval.
- Standby eligibility during creator review or revisions.
- Payroll frequency and payout provider.
- File retention periods.
- Maximum upload sizes.
- Creator notification channels.
- Whether admin quality approval is required for certain tickets.
- Brand asset storage limits.
- Whether creators can cancel claimed tickets.
- How urgent tickets are priced or prioritized.

These decisions should be surfaced during implementation planning rather than invented.

---

# 19. INSTRUCTIONS FOR CLAUDE

You are acting as a senior product manager, UX architect, and full-stack software architect.

Use this document as the source of truth for the product.

Your job is to help design and implement the Level 1 MVP.

**Important constraints:**

1. Do not build AI video editing.
2. Editing is performed by human editors based in the Philippines.
3. Editors claim tickets from a shared queue during approved shifts.
4. Each campaign has its own private reusable B-roll library.
5. Editors receive $2.50 per qualifying completed video.
6. Editors receive $3/hour of eligible standby time only when on shift, without active assignments, and without eligible available tickets, except authorized exceptions.
7. The MVP requires three role-based dashboards: Creator, Editor, and Admin.
8. Levels 2 and 3 should be considered for future extensibility but not implemented as part of Level 1.
9. Do not invent unresolved business rules without identifying them as proposals.
10. Prioritize security, reliability, and correct ticket and earnings logic.

**Start by producing:**

1. A complete Level 1 MVP feature breakdown.
2. Screen-by-screen information architecture for all three dashboards.
3. Detailed user flows.
4. Database schema with relationships.
5. Backend architecture.
6. API endpoint specifications.
7. Role-based permissions matrix.
8. Ticket state machine.
9. Shift and earnings state machines.
10. Implementation milestones with dependencies.

After that, help implement the product incrementally, starting with the database, authentication, and the three dashboard foundations.

Do not jump into building the entire application at once. Establish the architecture, identify unresolved decisions, and implement one coherent workflow at a time.

---

# 20. CONFIRMED DECISIONS LOG

Decisions resolved through clarifying Q&A, kept here so they aren't re-litigated or silently re-assumed in later sessions.

- **2026-10-26** — Product name: **MAXXUGC**. Project lives at `/Users/zehanli/maxxugc`, a separate codebase from the user's other UGC project ("CreatorOS" / "UGC Growth Studio Tracker") — not a rename or fork.
- **2026-10-26** — Stack: Next.js (App Router, TypeScript) + Tailwind + shadcn/ui on the frontend; Supabase for Postgres, Auth, Storage, and Realtime (chosen as a single platform over a split-services alternative, specifically because it simplifies atomic ticket-claiming and realtime queue updates).
- **2026-10-26** — File storage: Supabase Storage (not R2/S3), to keep signed URLs and access control tied to the same Postgres RLS policies as the rest of the data.

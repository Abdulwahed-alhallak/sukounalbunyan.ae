# Sukoun Albunyan — Lead (CRM) Module Deep Dive

## 1. CRM Model Hierarchy (25 Models)

The CRM system is one of the most complex modules, covering the entire sales funnel from Lead to Deal.

### Core Entities:
- **Lead**: Initial prospect entry. Tracks sources, products, and contact info.
- **Deal**: Converted high-value opportunity. Integrated with Taskly for project delivery.
- **Pipeline**: Visual sales funnel stages.
- **DealStage / LeadStage**: Individual steps within a pipeline.

### Interaction Models:
- **ActivityLog**: Automated tracking of status changes and user actions.
- **Discussion**: Internal chat threads per lead/deal.
- **File**: Document attachments per record.
- **Call / Email**: Tracking external communications.
- **Task**: To-do items assigned to specific deals/leads.

---

## 2. Strategic Integrations

### Taskly Integration:
- `Deal.php` has a `projects()` relation linking it to `Noble\Taskly\Models\Project`.
- This enables a seamless handover from Sales (CRM) to Execution (Projects).

### Multi-Tenancy:
- All core CRM models (`Lead`, `Deal`, `Pipeline`, `Source`, etc.) use `TenantBound` trait.
- Scoping is enforced via `created_by` (Company ID) and `creator_id` (User ID).

---

## 3. Advanced Features in DealController

### Pipeline Logic:
- **Auto-Defaulting**: If no pipeline is selected, the system finds the user's default or the first available for that company.
- **Order Management**: Logic for drag-and-drop sequencing within stages.

### Multi-Assignment:
- Supports multiple **Users** per deal.
- Supports multiple **Clients** per deal.
- Supports multiple **Products** and **Sources** per deal.

---

## 4. Frontend: Deal Index UI (Inertia + React)

### Strategic Revenue KPI Board:
- **Potential Revenue**: Calculated from the sum of all deal prices.
- **Operational Task Density**: Aggregate count of active tasks across the sector.
- **Strategic Market Breadth**: Count of unique pipelines engaged.
- **Client Interaction Flux**: Total deal volume.

### UI Primitives:
- **KanbanBoard**: Full drag-and-drop experience.
- **DataTable**: Sorted/Filtered list view.
- **Vercel Geist Materiality**: Heavy use of `glass-effect`, `premium-card`, and `animate-in` transitions.

---

## 5. Automation Events

| Event | Trigger | Action |
|---|---|---|
| `DealMoved` | Moving deal to new stage | Logs activity, can trigger email via `WorkflowEngine`. |
| `CreateDeal` | New deal creation | Initializes default stages, can notify assigned users. |
| `DealAddEmail` | Sending email from CRM | Tracks outgoing comms, logs interaction flux. |
| `DealActivityLog` | Any status change | Permanent audit trail of the deal's history. |

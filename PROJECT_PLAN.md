# Team Management & SRL Web Application - Project Plan

## A. System Overview

### Purpose
This web application serves as the central platform for managing and monitoring 29 Master's students in the GL program at Ibn Khaldoun University, Tiaret, as they collaboratively develop a Self-Regulated Learning (SRL) mobile application. The system facilitates:

- **Structured Teamwork**: Organize students into collaborative teams with clear roles and responsibilities
- **Project-Based Learning**: Track tasks, progress, and deliverables in real-time
- **SRL Principles Integration**: Support self-monitoring, reflection, and adaptive learning strategies
- **Feedback & Communication**: Enable continuous improvement through structured feedback channels

### Target Users & Permissions

#### 1. Student Role
**Core Capabilities:**
- View their assigned team and team members
- Access personal and team tasks on the task board
- Update status of tasks assigned to them
- Submit personal reflection notes
- Report issues and provide feedback
- View team performance metrics and progress
- Request to create/join teams (pending admin approval)

**Restrictions:**
- Cannot view other teams' internal data
- Cannot modify other students' tasks or reflections
- Cannot approve/reject requests
- Cannot access system-wide analytics

#### 2. Supervisor (Teacher) Role
**Core Capabilities:**
- View all teams and their composition
- Monitor all tasks across teams
- Review task submissions and provide feedback
- Update task status and leave review remarks
- View all feedback/issues submitted by students
- Mark feedback/issues as resolved
- Access comprehensive analytics dashboard
- View student performance metrics and SRL scores
- Export data for research purposes

**Restrictions:**
- Cannot directly create/delete teams (requires admin)
- Cannot modify student profiles

#### 3. Admin Role
**Full System Access:**
- Complete user management (create, update, archive students)
- Full team management (create, modify, delete teams)
- Assign team leaders and manage team composition
- Approve/reject team creation and join requests
- System configuration and settings
- Access to all supervisor capabilities
- Manage user roles and permissions
- Access security and audit logs

---

## B. Feature Set (Mapped to SRL & PBL)

### 1. Dashboard (SRL: Self-Monitoring & Goal Setting)
**Purpose**: Provide personalized, role-specific overview of current state and priorities.

**Student Dashboard:**
- **Personal Metrics Panel**: Display SRL score, technical skills, collaboration, adaptability, consistency, problem-solving ratings
- **Radar Chart**: Visual representation of skill distribution
- **Team Overview Card**: Team name, logo, members, current status
- **My Tasks Summary**: Count of pending, in-progress, and completed tasks
- **Recent Reflections Timeline**: Last 5 reflection entries
- **Action Plans**: Upcoming deadlines and priorities
- **Progress Tracking**: Metric history chart showing growth over time

**Supervisor/Admin Dashboard:**
- **System Overview**: Total students, teams, active requests
- **Analytics Tab**: 
  - Average SRL scores across cohort
  - Team performance comparison charts
  - Student progress trends
  - Export functionality for research data
- **Requests Management**: Pending team creation/join requests with approve/reject actions
- **Students Tab**: Complete student directory with search, filter, and bulk actions
- **Teams Tab**: Team management interface with member assignment

### 2. Team Management (PBL: Collaborative Learning)
**Purpose**: Organize students into effective collaborative units.

**Features:**
- **Team Directory**: Grid/list view of all active teams
- **Team Detail Page**: 
  - Team information (name, logo, description, research focus, project description)
  - Member list with roles (Leader, Developer, Designer, etc.)
  - Team performance metrics (average SRL score, collaboration rating)
  - Team-specific task board
  - Document repository
- **Team Formation Process**:
  - Students submit team creation requests with proposed members (max 5)
  - Admin reviews and approves/rejects requests
  - Option to upload team logo
  - Auto-status updates (students move from 'active' to 'team_assigned')
- **Team Leader Assignment**: Admin can designate one member as team leader
- **Team Composition Rules**: 
  - Maximum 5 members per team
  - Each student can belong to only one active team
  - Teams cannot be deleted if they have active tasks

### 3. Task Board / TODO Management (SRL: Planning & Task Strategies)
**Purpose**: Visual task management aligned with SRL planning and monitoring phases.

**Task Board Structure** (Kanban-style):
- **Columns**: 
  - Backlog (planned but not started)
  - To Do (ready to start)
  - In Progress (currently being worked on)
  - In Review (submitted, awaiting supervisor feedback)
  - Done (completed and approved)

**Task Data Model**:
```
- Task ID (unique identifier)
- Title (clear, concise description)
- Description (detailed requirements)
- Assignee (WHO - student responsible)
- Team ID (which team owns this task)
- Estimated Duration (in hours or days)
- Actual Duration (tracked time)
- Status (Backlog/To Do/In Progress/In Review/Done)
- Priority (Low/Medium/High/Critical)
- Due Date
- Created Date
- Completed Date
- Remarks (student's notes during work)
- Review Status (Pending/Approved/Needs Revision)
- Review Remarks (supervisor's feedback)
- Reviewer ID (supervisor who reviewed)
- Tags (e.g., "UI", "Backend", "Database", "Research")
```

**Interactions**:
- Students drag-and-drop tasks between columns
- System auto-logs status change timestamps
- Notifications sent when task moves to "In Review"
- Supervisors receive pending review queue
- Task cards show color-coded priority and overdue warnings

### 4. Action Plans & Goal Management (SRL: Goal Setting & Strategic Planning)
**Purpose**: Help students break down project into manageable, time-bound actions.

**Features**:
- **Create Action Plan**: 
  - Task Title (what needs to be done)
  - Description (detailed explanation)
  - Owner (who is responsible - can be self or team member)
  - Deadline (target completion date)
  - Status (pending/in_progress/completed/cancelled)
- **View Action Plans**: 
  - Personal action plans dashboard
  - Team-wide action plans (visible to team members)
  - Calendar view of deadlines
- **Progress Tracking**:
  - Mark action plans as completed
  - Track completion rate
  - Identify overdue items
- **Integration**: Action plans can be promoted to formal tasks on the task board

### 5. Reflection Notes (SRL: Self-Reflection & Evaluation)
**Purpose**: Private space for metacognitive reflection aligned with SRL cycles.

**Features**:
- **Reflection Entry Form**:
  - Date (auto-captured)
  - Milestone (e.g., "Week 3 - Database Design", "Sprint 1 Complete")
  - Reflection Text (free-form, 500-2000 characters)
  - Prompts to guide reflection:
    - What did I accomplish this week?
    - What challenges did I face?
    - What strategies worked well?
    - What will I do differently next time?
    - How did I contribute to my team?
- **Reflection Timeline**: Chronological view of all personal reflections
- **Privacy**: Reflections are private by default (only visible to student and supervisors)
- **Optional Sharing**: Students can choose to share specific reflections with team members
- **Analytics Integration**: Reflection frequency tracked as part of SRL metrics

### 6. Feedback & Issues Log (PBL: Continuous Improvement)
**Purpose**: Structured channel for reporting problems, asking questions, and suggesting improvements.

**Submission Form Fields**:
- **Team** (dropdown - which team is affected)
- **Submitted By** (auto-filled with current user)
- **Date** (auto-captured timestamp)
- **Type**: 
  - Bug (technical issue)
  - Suggestion (improvement idea)
  - Question (need clarification)
  - Resource Request (need additional materials/tools)
- **Priority**: Low / Medium / High / Critical
- **Title** (brief summary)
- **Description** (detailed explanation, up to 1000 characters)
- **Affected Component** (optional: Frontend/Backend/Database/Mobile/Documentation)
- **Attachments** (optional: screenshots, error logs)

**Issue Tracking**:
- **Status**: Open / In Progress / Resolved / Closed / Won't Fix
- **Assigned To** (supervisor who will handle it)
- **Resolved By** (who marked it resolved)
- **Resolution Date**
- **Resolution Notes** (supervisor's response or solution)

**Views**:
- **Student View**: Own submitted issues + team issues
- **Supervisor View**: All issues across all teams, filterable by status, type, priority
- **Issue Dashboard**: Visual summary (pie chart of types, bar chart of priorities, resolution rate)

### 7. Student Metrics & Analytics (SRL: Performance Monitoring)
**Purpose**: Track and visualize SRL competency development over time.

**Metrics Tracked** (0-100 scale):
- **Technical Skills**: Programming, tools, frameworks proficiency
- **Collaboration**: Teamwork, communication, peer support
- **Adaptability**: Response to changes, learning agility
- **Consistency**: Regular progress, meeting deadlines
- **Problem Solving**: Analytical thinking, debugging, creativity
- **SRL Score**: Calculated composite (weighted average of above)

**Metric Visualization**:
- **Radar Chart**: 6-axis skill distribution
- **Line Chart**: Historical trends (metric history over weeks)
- **Comparison**: Student vs. team average vs. cohort average

**Metric Updates**:
- Supervisors can manually edit metrics after evaluations
- System auto-suggests updates based on task completion rates and reflection frequency
- Metric history automatically recorded on every update (audit trail)

**Student Dashboard Integration**:
- Current metrics displayed prominently
- Growth indicators (↑ improved, ↓ declined, → stable)
- Personalized recommendations based on lowest metrics

### 8. Document Hub (PBL: Resource Management)
**Purpose**: Centralized repository for team documents and deliverables.

**Features**:
- **Upload Documents**:
  - Supported types: PDF, DOCX, XLSX, PPTX, PNG, JPG, ZIP
  - Maximum file size: 10MB per file
  - Metadata: filename, upload date, uploaded by, team, category
- **Categories**:
  - Design Mockups
  - Architecture Diagrams
  - Meeting Notes
  - Reports/Documentation
  - Sprint Deliverables
  - Research Papers
- **Access Control**:
  - Team members can upload and view their team's documents
  - Supervisors can view all documents
  - Admins have full CRUD access
- **Document List View**:
  - Searchable and filterable
  - Download links
  - Preview for supported formats (images, PDFs)
- **Version Control** (optional future enhancement):
  - Track document versions
  - Compare revisions

### 9. User Profile Management
**Purpose**: Maintain user information and personal settings.

**Student Profile Fields**:
- Name (full name)
- University Email (@univ-tiaret.dz)
- Personal Email (optional)
- Status (active/team_assigned/inactive/graduated)
- Role (current role in team, if assigned)
- Team (current team membership)
- Observation Notes (visible only to supervisors/admins)
- Created Date
- Last Updated Date

**Profile Actions**:
- **Students**: View and update personal email, view metrics, view team
- **Supervisors**: View all profiles, add observation notes, update metrics
- **Admins**: Full CRUD, change status, reassign teams

---

## C. Page Layouts & UI Wireframes (Descriptive)

### Mobile-First Design Principles
- **Responsive Grid**: Adapts from single-column (mobile) to multi-column (tablet/desktop)
- **Touch-Friendly**: Minimum 44x44px touch targets
- **Collapsible Navigation**: Hamburger menu on mobile, sidebar on desktop
- **Bottom Navigation**: Key actions accessible via bottom nav bar on mobile
- **Card-Based Layouts**: Content organized in cards for easy scanning
- **Progressive Disclosure**: Show essential info first, expand for details

---

### 1. Login Page
**Layout**:
```
+----------------------------------+
|          [University Logo]       |
|                                  |
|     Team Management Portal       |
|      SRL Mobile App Project      |
|                                  |
|  +----------------------------+  |
|  | Email                      |  |
|  +----------------------------+  |
|  | Password                   |  |
|  +----------------------------+  |
|  |       [Login Button]       |  |
|  +----------------------------+  |
|                                  |
|  Forgot Password? | Contact Admin|
+----------------------------------+
```

**Features**:
- Supabase Auth integration
- Email/password authentication
- Session persistence
- Role-based redirect after login (Student → Dashboard, Supervisor/Admin → Analytics)
- "Remember Me" option
- Password reset flow

---

### 2. Student Dashboard
**Layout** (Mobile):
```
+----------------------------------+
| [☰ Menu]  Dashboard  [🔔 Profile]|
+----------------------------------+
|  Welcome, [Student Name]!        |
|  Team: [Team Name] | Leader: [X] |
+----------------------------------+
|  [SRL Score: 78/100]    ↑ +5     |
|  +----------------------------+  |
|  |    [Radar Chart]           |  |
|  +----------------------------+  |
+----------------------------------+
|  My Tasks                    [→] |
|  • 3 To Do | 2 In Progress      |
|  • 1 In Review | 8 Completed     |
+----------------------------------+
|  Recent Reflections          [→] |
|  • "Week 5 - API Integration"    |
|  • "Sprint 2 Retrospective"      |
+----------------------------------+
|  Action Plans                [+] |
|  • Finish login UI (Due: 2 days) |
|  • Review DB schema (Overdue!)   |
+----------------------------------+
|  Team Overview               [→] |
|  [Team Logo] [5 members]         |
|  Avg SRL: 75 | Status: Active    |
+----------------------------------+
```

**Sections**:
1. **Header**: Navigation, notifications, profile
2. **Welcome Card**: Personalized greeting, team info
3. **Metrics Panel**: SRL score, radar chart, growth indicators
4. **Tasks Summary**: Quick counts with link to full task board
5. **Reflections Preview**: Last 2-3 entries
6. **Action Plans**: Urgent items, deadline warnings
7. **Team Card**: Quick team info with navigation to team page

---

### 3. Supervisor/Admin Dashboard
**Layout** (Desktop):
```
+------------------------------------------------------------------+
| [Logo] Analytics | Requests | Students | Teams      [Admin Name ▾]|
+------------------------------------------------------------------+
|                                                                  |
|  Overview Statistics                                             |
|  +-------------+  +-------------+  +-------------+               |
|  | 29 Students |  | 6 Teams     |  | 4 Requests  |               |
|  +-------------+  +-------------+  +-------------+               |
|                                                                  |
|  Team Performance Comparison                                     |
|  +------------------------------------------------------------+  |
|  |                    [Bar Chart]                             |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  SRL Score Distribution                    Recent Activity      |
|  +---------------------------+  +--------------------------+     |
|  |   [Histogram/Box Plot]    |  | • Student X submitted... |     |
|  |                           |  | • Team Y completed...    |     |
|  |                           |  | • Request Z approved...  |     |
|  +---------------------------+  +--------------------------+     |
|                                                                  |
|  Student Metrics Table                               [Export ▾] |
|  +------------------------------------------------------------+  |
|  | Name      | Team    | SRL Score | Collaboration | Actions  |  |
|  |-----------|---------|-----------|---------------|----------|  |
|  | Alice     | Team A  | 85        | 90            | [View]   |  |
|  | Bob       | Team B  | 72        | 68            | [View]   |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

**Features**:
- **Tabbed Navigation**: Analytics, Requests, Students, Teams
- **Analytics Tab**: 
  - Key metrics cards
  - Interactive charts (team comparison, SRL distribution, metric trends)
  - Export to CSV/Excel
- **Requests Tab**: Approve/reject pending team requests
- **Students Tab**: Full student directory with search, filter, edit
- **Teams Tab**: Team management, member assignment, leader selection

---

### 4. Team Directory & Detail Page

**Team Directory** (Grid View):
```
+----------------------------------+
| Teams (6 active)        [+ New]  |
+----------------------------------+
| [Search teams...]     [Filter ▾] |
+----------------------------------+
|  +-------------+ +-------------+  |
|  | [Logo]      | | [Logo]      |  |
|  | Team Alpha  | | Team Beta   |  |
|  | 5 members   | | 4 members   |  |
|  | SRL: 82     | | SRL: 75     |  |
|  +-------------+ +-------------+  |
|  +-------------+ +-------------+  |
|  | Team Gamma  | | Team Delta  |  |
|  | ...         | | ...         |  |
|  +-------------+ +-------------+  |
+----------------------------------+
```

**Team Detail Page**:
```
+----------------------------------+
| [← Back]  Team Alpha     [Edit]  |
+----------------------------------+
| [Team Logo]                      |
| Leader: Alice Johnson            |
| Status: Active | Created: Jan 15 |
|                                  |
| Research Focus:                  |
| Educational technology for SRL   |
|                                  |
| Project Description:             |
| Developing a mobile app to help  |
| students track learning habits...|
+----------------------------------+
| Team Members (5)                 |
| +------------------------------+ |
| | Alice Johnson    | Leader    | |
| | Bob Smith        | Developer | |
| | Carol Williams   | Designer  | |
| | David Brown      | Developer | |
| | Eve Martinez     | QA Tester | |
| +------------------------------+ |
+----------------------------------+
| Performance Metrics              |
| • Avg SRL Score: 82              |
| • Avg Collaboration: 85          |
| • Avg Adaptability: 78           |
| [View Full Metrics Chart]        |
+----------------------------------+
| [Tasks] [Documents] [Analytics]  |
+----------------------------------+
```

---

### 5. Project Task Board

**Layout** (Kanban View):
```
+------------------------------------------------------------------------+
| Task Board - Team Alpha                  [Filter] [+ New Task] [View ▾]|
+------------------------------------------------------------------------+
| Backlog(3) | To Do(5) | In Progress(4) | In Review(2) | Done(15)      |
|------------|----------|----------------|--------------|---------------|
| +--------+ | +------+ | +------------+ | +----------+ | +-----------+|
| |Design  | | |Login | | |Database    | | |API Auth  | | |Homepage  ||
| |mockups | | |page  | | |migration   | | |          | | |          ||
| |        | | |      | | |            | | |          | | |          ||
| |Alice   | | |Bob   | | |Carol       | | |Bob       | | |Alice     ||
| |3h      | | |5h    | | |8h          | | |6h        | | |4h        ||
| |[High]  | | |[Med] | | |[Critical]  | | |[High]    | | |[Done✓]   ||
| +--------+ | +------+ | +------------+ | +----------+ | +-----------+|
| +--------+ | +------+ | +------------+ | +----------+ | +-----------+|
| |...     | | |...   | | |...         | | |...       | | |...       ||
| +--------+ | +------+ | +------------+ | +----------+ | +-----------+|
+------------------------------------------------------------------------+
```

**Task Card Details** (on click):
```
+----------------------------------+
| Database Migration Schema        |
| [Edit] [Delete] [Move]           |
+----------------------------------+
| Status: In Progress              |
| Assigned: Carol Williams         |
| Priority: Critical               |
| Estimated: 8 hours               |
| Due: March 15, 2024              |
|                                  |
| Description:                     |
| Create and test all database     |
| migration scripts for the user   |
| and team tables...               |
|                                  |
| Remarks:                         |
| Working on foreign key           |
| constraints currently            |
|                                  |
| Review Status: Pending           |
| Reviewer: [Not yet submitted]    |
|                                  |
| [Update Status] [Add Remark]     |
+----------------------------------+
```

**Interactions**:
- Drag-and-drop cards between columns
- Click card to view/edit details
- Filter by assignee, priority, due date
- Toggle view: Kanban / List / Calendar

---

### 6. Feedback Submission & Log Page

**Submission Form**:
```
+----------------------------------+
| Submit Feedback/Issue            |
+----------------------------------+
| Type: [Bug ▾]                    |
| Priority: [Medium ▾]             |
| Team: [Team Alpha ▾]             |
|                                  |
| Title:                           |
| [_________________________]      |
|                                  |
| Description:                     |
| [_________________________]      |
| [_________________________]      |
| [_________________________]      |
|                                  |
| [📎 Attach File]                 |
|                                  |
| [Cancel] [Submit]                |
+----------------------------------+
```

**Issues Log** (List View):
```
+----------------------------------+
| Issues & Feedback       [+ New]  |
+----------------------------------+
| [All] [Open] [Resolved]          |
| [Search...]          [Filter ▾]  |
+----------------------------------+
| 🔴 CRITICAL | Bug               |
| Login page crashes on iOS        |
| Team Beta | Mar 10 | Bob         |
| Status: In Progress              |
+----------------------------------+
| 🟡 MEDIUM | Suggestion           |
| Add dark mode option             |
| Team Alpha | Mar 8 | Alice       |
| Status: Open                     |
+----------------------------------+
| 🟢 LOW | Question                 |
| How to export CSV reports?       |
| Team Gamma | Mar 7 | Carol       |
| Status: Resolved ✓               |
+----------------------------------+
```

---

### 7. User Profile & Reflection Page

**Profile Section**:
```
+----------------------------------+
| Profile                  [Edit]  |
+----------------------------------+
| [Avatar Placeholder]             |
| Alice Johnson                    |
| alice.johnson@univ-tiaret.dz     |
|                                  |
| Role: Developer                  |
| Team: Team Alpha (Leader)        |
| Status: Team Assigned            |
| Member Since: January 2024       |
+----------------------------------+
| Performance Metrics      [View →]|
| SRL Score: 85/100                |
| [Mini Radar Chart]               |
+----------------------------------+
```

**Reflection Page**:
```
+----------------------------------+
| My Reflections          [+ New]  |
+----------------------------------+
| [Search reflections...]          |
+----------------------------------+
| Week 5 - API Integration         |
| March 10, 2024                   |
| +------------------------------+ |
| | This week I focused on        ||
| | building the authentication   ||
| | API endpoints. I learned...   ||
| +------------------------------+ |
| [View Full] [Edit] [Delete]      |
+----------------------------------+
| Sprint 2 Retrospective           |
| March 3, 2024                    |
| +------------------------------+ |
| | Our team completed the UI...  ||
| +------------------------------+ |
| [View Full]                      |
+----------------------------------+
```

---

## D. Database Schema

### Core Tables

#### 1. `users` (Managed by Supabase Auth)
*Note: This is the built-in auth.users table. We DO NOT add custom fields here.*

```sql
-- auth.users (built-in, do not modify)
-- id (uuid, primary key)
-- email (text)
-- encrypted_password (text)
-- email_confirmed_at (timestamp)
-- created_at (timestamp)
-- updated_at (timestamp)
```

#### 2. `user_roles` (Custom roles table)
*Purpose: Define user access levels (student, supervisor, admin)*

```sql
CREATE TYPE app_role AS ENUM ('student', 'supervisor', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- RLS Policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
```

#### 3. `students` (Student profile data)
*Purpose: Extended student information beyond auth*

```sql
CREATE TYPE student_status AS ENUM ('active', 'team_assigned', 'inactive', 'graduated');

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  university_email TEXT UNIQUE NOT NULL,
  email_personal TEXT,
  status student_status DEFAULT 'active',
  role TEXT, -- Current role in team (e.g., 'Developer', 'Designer')
  observation_notes TEXT DEFAULT '', -- Supervisor notes
  metrics JSONB DEFAULT '{}'::jsonb, -- Current metrics snapshot
  metrics_history JSONB[] DEFAULT ARRAY[]::jsonb[], -- Historical metrics
  srl_score NUMERIC DEFAULT 0,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage students"
  ON public.students FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own profile"
  ON public.students FOR SELECT
  USING (auth.uid() = user_id);
```

#### 4. `teams` (Team information)
*Purpose: Store team metadata*

```sql
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT, -- Stored in Supabase Storage
  leader_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active', -- active, inactive, completed
  research_focus TEXT DEFAULT '',
  project_description TEXT DEFAULT '',
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage teams"
  ON public.teams FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view teams"
  ON public.teams FOR SELECT
  TO authenticated
  USING (true);
```

#### 5. `team_members` (Junction table for teams and students)
*Purpose: Many-to-many relationship between teams and students*

```sql
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  role TEXT, -- Role within the team (e.g., 'Frontend Dev', 'Designer')
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, student_id) -- Student can only be in a team once
);

-- RLS Policies
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger: Update student status when assigned to team
CREATE OR REPLACE FUNCTION update_student_status_on_team_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.students 
    SET status = 'team_assigned', updated_at = NOW()
    WHERE id = NEW.student_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Check if student is in any other team
    IF NOT EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE student_id = OLD.student_id AND id != OLD.id
    ) THEN
      UPDATE public.students 
      SET status = 'active', updated_at = NOW()
      WHERE id = OLD.student_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER team_member_status_update
  AFTER INSERT OR DELETE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION update_student_status_on_team_change();
```

#### 6. `tasks` (Project task management)
*Purpose: Track individual tasks across teams*

```sql
CREATE TYPE task_status AS ENUM ('backlog', 'todo', 'in_progress', 'in_review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'needs_revision');

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  assignee_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  status task_status DEFAULT 'backlog',
  priority task_priority DEFAULT 'medium',
  review_status review_status DEFAULT 'pending',
  estimated_duration INTERVAL, -- e.g., '8 hours'
  actual_duration INTERVAL,
  due_date TIMESTAMPTZ,
  remarks TEXT, -- Student's notes during work
  review_remarks TEXT, -- Supervisor's feedback
  tags TEXT[], -- e.g., ['UI', 'Backend', 'Bug Fix']
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and supervisors can manage all tasks"
  ON public.tasks FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

CREATE POLICY "Students can view their team's tasks"
  ON public.tasks FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM public.team_members tm
      JOIN public.students s ON s.id = tm.student_id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their assigned tasks"
  ON public.tasks FOR UPDATE
  USING (
    assignee_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );
```

#### 7. `student_action_plans` (Personal action items)
*Purpose: Student-created goals and action items*

```sql
CREATE TYPE action_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

CREATE TABLE public.student_action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  task_title TEXT NOT NULL,
  description TEXT,
  owner TEXT, -- Who is responsible (can be "self" or teammate name)
  deadline TIMESTAMPTZ,
  status action_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.student_action_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all action plans"
  ON public.student_action_plans FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can manage their own action plans"
  ON public.student_action_plans FOR ALL
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );
```

#### 8. `student_reflections` (Personal reflections)
*Purpose: Store student reflection entries*

```sql
CREATE TABLE public.student_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  reflection_text TEXT NOT NULL,
  milestone TEXT, -- e.g., "Week 5 - API Integration"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.student_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and supervisors can view all reflections"
  ON public.student_reflections FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

CREATE POLICY "Students can manage their own reflections"
  ON public.student_reflections FOR ALL
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );
```

#### 9. `feedback_issues` (Bug reports and suggestions)
*Purpose: Track feedback and issues submitted by students*

```sql
CREATE TYPE issue_type AS ENUM ('bug', 'suggestion', 'question', 'resource_request');
CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE issue_status AS ENUM ('open', 'in_progress', 'resolved', 'closed', 'wont_fix');

CREATE TABLE public.feedback_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  submitted_by UUID REFERENCES public.students(id) ON DELETE SET NULL NOT NULL,
  assigned_to UUID REFERENCES public.students(id) ON DELETE SET NULL,
  type issue_type NOT NULL,
  priority issue_priority DEFAULT 'medium',
  status issue_status DEFAULT 'open',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_component TEXT, -- e.g., 'Frontend', 'Backend', 'Mobile'
  resolution_notes TEXT,
  resolved_by UUID REFERENCES public.students(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.feedback_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and supervisors can manage all issues"
  ON public.feedback_issues FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

CREATE POLICY "Students can create issues"
  ON public.feedback_issues FOR INSERT
  WITH CHECK (
    submitted_by IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their team's issues"
  ON public.feedback_issues FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM public.team_members tm
      JOIN public.students s ON s.id = tm.student_id
      WHERE s.user_id = auth.uid()
    )
  );
```

#### 10. `requests` (Team creation/join requests)
*Purpose: Handle student requests for team formation*

```sql
CREATE TYPE request_type AS ENUM ('create_team', 'join_team');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type request_type NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL, -- For join requests
  team_name TEXT, -- For create requests
  logo_url TEXT, -- For create requests
  selected_members UUID[], -- Proposed team members for create requests
  message TEXT NOT NULL,
  status request_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all requests"
  ON public.requests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can create their own requests"
  ON public.requests FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own requests"
  ON public.requests FOR SELECT
  USING (user_id = auth.uid());
```

#### 11. `documents` (Team document repository)
*Purpose: Store metadata for uploaded team documents*

```sql
CREATE TYPE document_category AS ENUM (
  'design_mockup', 
  'architecture', 
  'meeting_notes', 
  'report', 
  'deliverable', 
  'research', 
  'other'
);

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_size INTEGER, -- in bytes
  file_type TEXT, -- MIME type
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES public.students(id) ON DELETE SET NULL NOT NULL,
  category document_category DEFAULT 'other',
  description TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all documents"
  ON public.documents FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Team members can view their team's documents"
  ON public.documents FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM public.team_members tm
      JOIN public.students s ON s.id = tm.student_id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can upload documents"
  ON public.documents FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.team_members tm
      JOIN public.students s ON s.id = tm.student_id
      WHERE s.user_id = auth.uid()
    )
  );
```

#### 12. `metric_history` (Historical metric snapshots)
*Purpose: Audit trail of metric changes*

```sql
CREATE TABLE public.metric_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  technical_skills INTEGER,
  collaboration INTEGER,
  adaptability INTEGER,
  consistency INTEGER,
  problem_solving INTEGER,
  srl_score INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.metric_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and supervisors can view metric history"
  ON public.metric_history FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

-- Trigger: Auto-record metric changes
CREATE OR REPLACE FUNCTION record_metric_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.metric_history (
    student_id,
    technical_skills,
    collaboration,
    adaptability,
    consistency,
    problem_solving,
    srl_score
  ) VALUES (
    NEW.id,
    (NEW.metrics->>'technical_skills')::integer,
    (NEW.metrics->>'collaboration')::integer,
    (NEW.metrics->>'adaptability')::integer,
    (NEW.metrics->>'consistency')::integer,
    (NEW.metrics->>'problem_solving')::integer,
    NEW.srl_score
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER metrics_history_trigger
  AFTER UPDATE OF metrics, srl_score ON public.students
  FOR EACH ROW 
  WHEN (OLD.metrics IS DISTINCT FROM NEW.metrics)
  EXECUTE FUNCTION record_metric_history();
```

---

### Storage Buckets (Supabase Storage)

#### 1. `team-logos` (Public bucket)
*Purpose: Store team logo images*

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-logos', 'team-logos', true);

-- RLS Policies for storage.objects
CREATE POLICY "Anyone can view team logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team-logos');

CREATE POLICY "Admins can upload team logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'team-logos' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update team logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'team-logos' AND
    public.has_role(auth.uid(), 'admin')
  );
```

#### 2. `team-documents` (Private bucket)
*Purpose: Store team documents and deliverables*

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-documents', 'team-documents', false);

-- RLS Policies for storage.objects
CREATE POLICY "Team members can view their team's documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'team-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT team_id::text FROM public.team_members tm
      JOIN public.students s ON s.id = tm.student_id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'team-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT team_id::text FROM public.team_members tm
      JOIN public.students s ON s.id = tm.student_id
      WHERE s.user_id = auth.uid()
    )
  );
```

---

### Database Indexes (Performance Optimization)

```sql
-- Students
CREATE INDEX idx_students_user_id ON public.students(user_id);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_students_archived ON public.students(archived);

-- Teams
CREATE INDEX idx_teams_status ON public.teams(status);
CREATE INDEX idx_teams_leader_id ON public.teams(leader_id);

-- Team Members
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_student_id ON public.team_members(student_id);

-- Tasks
CREATE INDEX idx_tasks_team_id ON public.tasks(team_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);

-- Reflections
CREATE INDEX idx_reflections_student_id ON public.student_reflections(student_id);
CREATE INDEX idx_reflections_created_at ON public.student_reflections(created_at DESC);

-- Feedback Issues
CREATE INDEX idx_issues_team_id ON public.feedback_issues(team_id);
CREATE INDEX idx_issues_status ON public.feedback_issues(status);
CREATE INDEX idx_issues_priority ON public.feedback_issues(priority);

-- Requests
CREATE INDEX idx_requests_student_id ON public.requests(student_id);
CREATE INDEX idx_requests_status ON public.requests(status);
```

---

## E. Application Workflow

### 1. Onboarding Workflow

**Step 1: Admin Creates Student Accounts**
```
Admin → Students Tab → Add Student
↓
Fill Form:
- Name: [Full Name]
- University Email: [email@univ-tiaret.dz]
- Personal Email: [optional]
- Status: Active
↓
System:
- Creates entry in students table
- Auto-assigns role 'student' in user_roles
- Sends welcome email with temporary password
↓
Student Receives Email → Sets Password → Logs In
```

**Step 2: Team Formation Process**
```
Student Logs In → Dashboard → "Request to Create Team"
↓
Fill Team Request Form:
- Team Name: [Choose unique name]
- Team Members: [Select up to 4 other students]
- Message: [Explain team composition rationale]
- Upload Team Logo (optional)
↓
System:
- Creates entry in requests table (status: pending)
- Notifies admin of new request
↓
Admin Reviews Request → Requests Tab
↓
Approve:
- System creates team in teams table
- Creates team_members entries for all selected students
- Updates student status to 'team_assigned'
- Assigns first member as leader (can be changed later)
- Sends notification to all team members
↓
Reject:
- Updates request status to 'rejected'
- Notifies requesting student
- Students remain status 'active' (can try again)
```

**Step 3: Initial Team Setup**
```
Team Approved → All Members Get Notification
↓
Team Leader Logs In → Team Detail Page
↓
Team Leader Actions:
- Update team description
- Set research focus
- Assign roles to members (Developer, Designer, etc.)
- Create initial tasks on task board
↓
Team Members:
- View team dashboard
- See assigned tasks
- Begin work
```

---

### 2. Task Management Cycle

**Creating a Task**
```
Supervisor/Admin → Team Page → Task Board → + New Task
↓
Fill Task Form:
- Title: [Clear, concise description]
- Description: [Detailed requirements]
- Assignee: [Select student from dropdown]
- Priority: [Low/Medium/High/Critical]
- Estimated Duration: [Hours or days]
- Due Date: [Select date]
- Tags: [UI, Backend, etc.]
↓
Submit → Task appears in "Backlog" column
↓
System:
- Creates task in tasks table (status: backlog)
- Sends notification to assignee
```

**Working on a Task**
```
Student Logs In → Dashboard → My Tasks → View Task
↓
Student Actions:
1. Move task from Backlog → To Do (when ready to start)
2. Move task To Do → In Progress (when starting work)
3. Add remarks as work progresses
4. Track actual time spent
5. When complete → Move to In Review
↓
System:
- Updates task status in database
- Records timestamp of each status change
- Sends notification to supervisor/team leader
```

**Reviewing a Task**
```
Task Moves to "In Review"
↓
Supervisor Gets Notification → Reviews Work
↓
Supervisor Options:

Option A: Approve
- Updates review_status to 'approved'
- Adds review_remarks (positive feedback)
- Moves task to "Done"
- Updates completed_at timestamp
- Student receives notification of approval

Option B: Request Revision
- Updates review_status to 'needs_revision'
- Adds review_remarks (what needs to change)
- Moves task back to "In Progress"
- Student receives notification with feedback
- Student addresses feedback → Resubmits to In Review
```

---

### 3. Feedback Cycle

**Submitting Feedback/Issue**
```
Student Encounters Problem → Feedback Page → + New Issue
↓
Fill Form:
- Type: [Bug/Suggestion/Question/Resource Request]
- Priority: [Low/Medium/High/Critical]
- Title: [Brief summary]
- Description: [Detailed explanation]
- Attach File (screenshot, error log, etc.)
↓
Submit → Issue Created (status: open)
↓
System:
- Creates entry in feedback_issues table
- Sends notification to supervisors
- Assigns to designated supervisor (if configured)
```

**Processing Feedback**
```
Supervisor Logs In → Dashboard → Feedback Tab
↓
View Issue Details → Assess Priority
↓
Supervisor Actions:

1. Investigate Issue
   - Update status to 'in_progress'
   - Add notes to resolution_notes field

2. Resolve Issue
   - Implement fix or provide answer
   - Update status to 'resolved'
   - Add resolution_notes (explanation of solution)
   - Update resolved_at timestamp
   - Student receives notification

3. Close Issue
   - Update status to 'closed'
   - Issue moved to closed list

4. Mark Won't Fix (if not applicable)
   - Update status to 'wont_fix'
   - Add explanation in resolution_notes
```

---

### 4. SRL Cycle (Self-Regulated Learning)

**Phase 1: Planning & Goal Setting**
```
Student Logs In → Dashboard → Action Plans Tab → + New Action Plan
↓
Fill Form:
- Task Title: [What needs to be done]
- Description: [How will I do it]
- Owner: [Self or teammate]
- Deadline: [When it should be complete]
↓
Create Action Plan → Appears in Personal Dashboard
↓
System:
- Creates entry in student_action_plans table
- Displays upcoming deadlines prominently
- Sends reminder notifications as deadline approaches
```

**Phase 2: Performance Monitoring**
```
Student Works on Tasks → Views Dashboard Daily
↓
Dashboard Shows:
- Current SRL Score: 78/100 (↑ +5 since last week)
- Radar Chart: Visual of 6 skill dimensions
- Task Completion Rate: 85%
- Action Plans: 3 pending, 1 overdue
- Recent Reflections: Last 3 entries
↓
Student Self-Monitors:
- Are my metrics improving?
- Am I meeting deadlines?
- Where do I need to improve?
- What strategies are working?
```

**Phase 3: Reflection & Self-Evaluation**
```
End of Week → Student Reflects on Progress
↓
Navigate to Reflections Page → + New Reflection
↓
Guided Prompts:
1. What did I accomplish this week?
   [Student writes: "Completed login UI, started API integration"]

2. What challenges did I face?
   [Student writes: "Struggled with JWT authentication, needed help from Bob"]

3. What strategies worked well?
   [Student writes: "Breaking tasks into smaller chunks helped me stay focused"]

4. What will I do differently next time?
   [Student writes: "Will ask for help earlier when stuck, not after 2 hours"]

5. How did I contribute to my team?
   [Student writes: "Helped Carol debug CSS issue, participated in daily standup"]
↓
Submit Reflection → Saved to student_reflections table
↓
System:
- Records reflection with timestamp
- Displays in reflection timeline
- Increases reflection consistency score
- Supervisors can view (for assessment/support)
```

**Phase 4: Metric Updates & Feedback**
```
Supervisor Reviews Student Progress → Student Profile → Edit Metrics
↓
Supervisor Updates Metrics (0-100 scale):
- Technical Skills: 75 → 80 (+5)
- Collaboration: 85 (no change)
- Adaptability: 70 → 75 (+5)
- Consistency: 80 (no change)
- Problem Solving: 65 → 70 (+5)
↓
System:
- Auto-calculates new SRL Score (weighted average)
- Records change in metric_history table
- Updates metrics_history array in students table
- Student sees updated metrics on next login
↓
Student Views Metrics → Sees Growth → Adjusts Strategies
- If skills improving → Continue current approach
- If skills declining → Reflect on what changed, adjust
```

**Continuous Cycle**
```
1. Student sets goals (Action Plans)
   ↓
2. Student works on tasks (Task Board)
   ↓
3. Student monitors progress (Dashboard)
   ↓
4. Student reflects on learning (Reflections)
   ↓
5. Supervisor provides feedback (Metric Updates, Task Reviews)
   ↓
6. Student adapts strategies based on feedback
   ↓
7. Repeat cycle weekly/biweekly
```

---

## F. Technical Implementation Plan

### Tech Stack Recommendation

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast, modern, optimized for React)
- **UI Framework**: TailwindCSS + Shadcn UI (pre-built, accessible components)
- **State Management**: 
  - React Query / TanStack Query (server state, caching)
  - Zustand or Context API (client state)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod (validation)
- **Charts**: Recharts (SRL metrics visualization)
- **Icons**: Lucide React
- **Date Handling**: date-fns

#### Backend
- **Backend-as-a-Service**: Supabase
  - **Database**: PostgreSQL (managed, automatic backups)
  - **Authentication**: Supabase Auth (email/password, role-based)
  - **Storage**: Supabase Storage (team logos, documents)
  - **Real-time**: Supabase Realtime (live updates for task board)
  - **API**: Auto-generated REST/GraphQL APIs
  - **Row-Level Security**: Database-level authorization

#### Deployment
- **Frontend Hosting**: Vercel or Netlify (automatic deployments from Git)
- **Database**: Supabase Cloud (free tier supports up to 500MB, 2GB bandwidth)
- **CI/CD**: GitHub Actions (automated testing and deployment)

---

### Integration Plan with Supabase

#### Phase 1: Database Setup
1. Create Supabase project (supabase.com)
2. Run SQL migrations to create all tables (see Database Schema section)
3. Set up RLS policies for each table
4. Create storage buckets (team-logos, team-documents)
5. Set up storage policies
6. Create database functions and triggers
7. Configure email templates for auth

#### Phase 2: Authentication Integration
1. Install Supabase client in React app
   ```bash
   npm install @supabase/supabase-js
   ```

2. Initialize Supabase client
   ```typescript
   // src/lib/supabase.ts
   import { createClient } from '@supabase/supabase-js';
   
   const supabaseUrl = process.env.VITE_SUPABASE_URL!;
   const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

3. Create auth context
   ```typescript
   // src/contexts/AuthContext.tsx
   const AuthContext = createContext<AuthContextType | undefined>(undefined);
   
   export function AuthProvider({ children }) {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       // Check active session
       supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null);
         setLoading(false);
       });
       
       // Listen for auth changes
       const { data: { subscription } } = supabase.auth.onAuthStateChange(
         (_event, session) => {
           setUser(session?.user ?? null);
         }
       );
       
       return () => subscription.unsubscribe();
     }, []);
     
     return (
       <AuthContext.Provider value={{ user, loading }}>
         {children}
       </AuthContext.Provider>
     );
   }
   ```

4. Implement role-based routing
   ```typescript
   function ProtectedRoute({ children, allowedRoles }) {
     const { user } = useAuth();
     const [role, setRole] = useState<string | null>(null);
     
     useEffect(() => {
       if (user) {
         supabase
           .from('user_roles')
           .select('role')
           .eq('user_id', user.id)
           .single()
           .then(({ data }) => setRole(data?.role));
       }
     }, [user]);
     
     if (!user) return <Navigate to="/login" />;
     if (allowedRoles && !allowedRoles.includes(role)) {
       return <Navigate to="/unauthorized" />;
     }
     
     return children;
   }
   ```

#### Phase 3: Data Fetching & Real-time Updates
1. Install React Query
   ```bash
   npm install @tanstack/react-query
   ```

2. Set up React Query client
   ```typescript
   // src/lib/queryClient.ts
   import { QueryClient } from '@tanstack/react-query';
   
   export const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 1000 * 60 * 5, // 5 minutes
         cacheTime: 1000 * 60 * 10, // 10 minutes
       },
     },
   });
   ```

3. Create custom hooks for data fetching
   ```typescript
   // src/hooks/useStudents.ts
   import { useQuery } from '@tanstack/react-query';
   import { supabase } from '@/lib/supabase';
   
   export function useStudents() {
     return useQuery({
       queryKey: ['students'],
       queryFn: async () => {
         const { data, error } = await supabase
           .from('students')
           .select('*, team_members(team:teams(*))');
         
         if (error) throw error;
         return data;
       },
     });
   }
   ```

4. Implement real-time subscriptions for task board
   ```typescript
   // src/hooks/useTasks.ts
   import { useQuery, useQueryClient } from '@tanstack/react-query';
   import { supabase } from '@/lib/supabase';
   
   export function useTasks(teamId: string) {
     const queryClient = useQueryClient();
     
     // Subscribe to real-time changes
     useEffect(() => {
       const subscription = supabase
         .channel(`tasks:team_id=eq.${teamId}`)
         .on(
           'postgres_changes',
           { 
             event: '*', 
             schema: 'public', 
             table: 'tasks',
             filter: `team_id=eq.${teamId}`
           },
           (payload) => {
             // Invalidate and refetch tasks
             queryClient.invalidateQueries(['tasks', teamId]);
           }
         )
         .subscribe();
       
       return () => {
         subscription.unsubscribe();
       };
     }, [teamId, queryClient]);
     
     return useQuery({
       queryKey: ['tasks', teamId],
       queryFn: async () => {
         const { data, error } = await supabase
           .from('tasks')
           .select('*, assignee:students(*)')
           .eq('team_id', teamId)
           .order('created_at', { ascending: false });
         
         if (error) throw error;
         return data;
       },
     });
   }
   ```

#### Phase 4: File Upload Integration
1. Create file upload utility
   ```typescript
   // src/utils/fileUpload.ts
   export async function uploadTeamLogo(
     file: File, 
     teamId: string
   ): Promise<string> {
     const fileExt = file.name.split('.').pop();
     const fileName = `${teamId}_${Date.now()}.${fileExt}`;
     const filePath = `${fileName}`;
     
     const { error: uploadError } = await supabase.storage
       .from('team-logos')
       .upload(filePath, file, { upsert: true });
     
     if (uploadError) throw uploadError;
     
     const { data } = supabase.storage
       .from('team-logos')
       .getPublicUrl(filePath);
     
     return data.publicUrl;
   }
   ```

2. Implement file upload component
   ```typescript
   function TeamLogoUpload({ teamId, onUpload }) {
     const [uploading, setUploading] = useState(false);
     
     async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
       const file = event.target.files?.[0];
       if (!file) return;
       
       try {
         setUploading(true);
         const logoUrl = await uploadTeamLogo(file, teamId);
         onUpload(logoUrl);
         toast.success('Logo uploaded successfully');
       } catch (error) {
         toast.error('Failed to upload logo');
       } finally {
         setUploading(false);
       }
     }
     
     return (
       <div>
         <input 
           type="file" 
           accept="image/*"
           onChange={handleUpload}
           disabled={uploading}
         />
         {uploading && <Spinner />}
       </div>
     );
   }
   ```

---

### Security & Authorization Implementation

#### 1. Row-Level Security (RLS) Enforcement
**Critical: All tables must have RLS enabled**
```sql
-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
-- ... (repeat for all tables)
```

**Best Practices:**
- Never bypass RLS by using service role key in client-side code
- Always use anon key for client-side operations
- RLS policies should check `auth.uid()` to ensure user context
- Use `SECURITY DEFINER` functions for complex authorization logic

#### 2. Input Validation & Sanitization
```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  estimated_duration: z.number().positive().optional(),
  due_date: z.date().optional(),
});

// Usage in form
function TaskForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(taskSchema),
  });
  
  const handleSubmit = form.handleSubmit(async (data) => {
    // Data is validated and type-safe
    await onSubmit(data);
  });
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### 3. API Error Handling
```typescript
// src/utils/errorHandler.ts
export function handleSupabaseError(error: any): string {
  // Never expose raw database errors to users
  if (error.code === '23505') {
    return 'This record already exists';
  }
  if (error.code === '42501') {
    return 'You do not have permission to perform this action';
  }
  if (error.message?.includes('row-level security')) {
    return 'Access denied';
  }
  
  // Log full error for debugging (server-side only)
  console.error('Database error:', error);
  
  return 'An unexpected error occurred. Please try again.';
}
```

#### 4. Rate Limiting (via Supabase)
Configure rate limiting in Supabase project settings:
- Auth: 30 requests per hour per IP
- API: 100 requests per second per IP
- Storage: 500 uploads per hour per user

---

### Deployment Strategy

#### Frontend Deployment (Vercel)
1. **Push code to GitHub repository**
2. **Connect repository to Vercel**
   - Go to vercel.com → New Project
   - Import GitHub repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
3. **Set environment variables**
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxx
   ```
4. **Deploy**
   - Vercel auto-deploys on every push to main branch
   - Preview deployments for pull requests

#### Backend Deployment (Supabase)
1. **Database is already hosted** on Supabase Cloud
2. **Monitor usage** in Supabase dashboard
3. **Set up backups** (automatic on paid plans)
4. **Configure alerts** for downtime/errors

#### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

### Future Mobile App Integration

#### Path 1: React Native (Recommended)
**Why**: Reuse React components, share business logic, Supabase has React Native support

**Migration Steps**:
1. Install React Native & Expo
2. Share data fetching hooks between web and mobile
3. Create mobile-specific UI components
4. Use Supabase React Native client (same API as web)
5. Deploy to App Store & Google Play

**Shared Code Structure**:
```
/packages
  /shared (shared hooks, utils, types)
  /web (React web app)
  /mobile (React Native app)
```

#### Path 2: Progressive Web App (PWA)
**Why**: No app store required, works offline, installable

**Implementation**:
1. Add service worker for offline support
2. Configure `manifest.json` for installability
3. Cache static assets and API responses
4. Add "Add to Home Screen" prompt
5. Students can install directly from browser

---

### Monitoring & Maintenance

#### Error Tracking
- **Tool**: Sentry (free tier)
- **Setup**: 
  ```typescript
  import * as Sentry from "@sentry/react";
  
  Sentry.init({
    dsn: "https://xxxxx@sentry.io/xxxxx",
    environment: process.env.NODE_ENV,
  });
  ```

#### Analytics
- **Tool**: Plausible or Simple Analytics (privacy-friendly)
- **Track**:
  - Page views
  - Task completion rates
  - Reflection submission frequency
  - Login frequency

#### Database Monitoring
- **Supabase Dashboard**: Monitor query performance, connection pool
- **Set up alerts** for:
  - Database size approaching limit
  - Slow queries (> 1 second)
  - High error rates

#### Backup Strategy
- **Database**: Automatic daily backups (Supabase)
- **Storage**: Supabase backs up storage buckets
- **Code**: Git version control + GitHub

---

## Summary

This comprehensive plan provides a complete blueprint for developing a Team Management & SRL Web Application tailored to 29 Master's students working on a collaborative mobile app project. The system integrates:

✅ **Structured Team Management**: Clear team formation, role assignment, and progress tracking  
✅ **Task Management**: Visual Kanban board with review workflow  
✅ **SRL Principles**: Action plans, reflections, metric tracking, and feedback loops  
✅ **Role-Based Access**: Student, Supervisor, and Admin roles with appropriate permissions  
✅ **Modern Tech Stack**: React + TypeScript + Supabase for rapid, secure development  
✅ **Security First**: RLS policies, input validation, error sanitization  
✅ **Scalable Architecture**: Ready for future mobile app integration  

The next step is to begin implementation following this plan, starting with database setup and authentication, then building out core features iteratively.

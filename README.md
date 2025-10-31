# TP Teams - SRL-Focused Student & Team Management Platform

A modern, analytics-first platform for managing students and teams with a focus on Self-Regulated Learning (SRL) metrics and progress tracking.

## Project Info

**URL**: https://lovable.dev/projects/e45ddf6c-7c95-4915-a810-1eb0f6b2c0b8

## 🎯 Features

### Student Dashboard
- **Analytics-First Interface**: View comprehensive student metrics including SRL scores, technical skills, collaboration, adaptability, consistency, and problem-solving abilities
- **Visual Analytics**: Radar charts for skill distribution, line charts for historical trends
- **Manual Metric Editing**: Admins can manually update student metrics from the UI
- **Reflection Timeline**: Track student reflections and journals with timestamps
- **Action Plans**: Assignable tasks with deadlines, owners, and status tracking
- **Data Export**: Export individual or bulk student data in JSON/CSV formats

### Team Management
- **Smart Team Creation**: Searchable multi-select for adding team members (max 5 per team)
- **Team Logo Upload**: Optional logo upload with preview stored in Supabase Storage
- **Automatic Status Updates**: Student status automatically changes between "free" and "busy" based on team membership
- **Team Analytics**: View team averages, synergy scores, and member performance

### Admin Operations
- **Secure Role-Based Access**: Server-side role validation using Supabase RLS policies
- **Request Management**: Approve/reject student join and team creation requests
- **Analytics Dashboard**: Aggregated metrics, top performers, at-risk students, team comparisons
- **Duplicate Detection**: Automatic deduplication at query level, with manual cleanup scripts

### Security
- **Row-Level Security (RLS)**: Properly configured RLS policies for all tables
- **Role-Based Access Control**: Secure admin functions using security definer pattern
- **Soft Delete**: Archive functionality instead of hard deletes for data recovery

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Setting Up Admin Access

To grant admin privileges to a user, run this SQL in your Supabase SQL Editor:

```sql
-- Replace 'USER_ID_HERE' with the actual user ID from auth.users
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin');
```

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed admin configuration instructions.

## 📊 Database Schema

### Core Tables
- `students`: Student profiles with status (free/busy/graduated) and archive flag
- `student_metrics`: Performance metrics (0-100 scale) for ML/AI analysis
- `metric_history`: Historical metric tracking with automatic triggers
- `student_reflections`: Timestamped reflections and journals
- `student_action_plans`: Tasks with deadlines and status
- `teams`: Team profiles with logo URLs and status
- `team_members`: Junction table for team-student relationships
- `team_metrics`: Aggregated team performance metrics
- `requests`: Join/create team requests with approval workflow
- `user_roles`: Role-based access control table

### Automatic Triggers
- **Student Status Updates**: Automatically updates student status when joining/leaving teams
- **Metric History**: Records all metric changes for historical analysis
- **Updated Timestamps**: Auto-updates `updated_at` columns

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366F1) - Focus and Responsibility
- **Secondary**: Teal/Sea-green (#0EA5A4) - Growth and Autonomy
- **Accent**: Warm Amber (#F59E0B) - Achievement and Milestones

### UI Features
- Glassmorphism panels with frosted glass effect
- Soft gradients and smooth micro-interactions
- Light theme default with dark mode toggle
- Responsive design for mobile/tablet/desktop

## 📖 Key Documentation

- [ADMIN_SETUP.md](./ADMIN_SETUP.md): Admin user setup and management
- [DUPLICATE_CLEANUP.sql](./DUPLICATE_CLEANUP.sql): SQL script for merging duplicate records

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── admin/          # Admin dashboard tabs
│   ├── dashboard/      # Student dashboard components
│   ├── students/       # Student CRUD components
│   ├── teams/          # Team management components
│   └── ui/             # Shadcn UI components
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
├── utils/              # Utility functions
└── integrations/       # Supabase integration
```

### Manual Metric Editing

Admins can edit student metrics from the Student Dashboard:
1. Navigate to Students page
2. Click on a student card
3. Find "Edit Metrics" section
4. Click "Edit", update values (0-100), and save

All metrics are stored as structured JSON for future ML/AI analysis.

### Duplicate Handling

The system automatically deduplicates students at query level by:
- Filtering by normalized name (lowercase, trimmed)
- Keeping the earliest created record
- Preserving all relationships

For manual cleanup, use the [DUPLICATE_CLEANUP.sql](./DUPLICATE_CLEANUP.sql) script.

### Data Export

**Single Student**: Click "Export Data" on student dashboard
**All Students**: Use "Export" dropdown on Students page (JSON or CSV)

CSV exports are ML-ready with normalized 0-100 scale metrics.

## 🛠 Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Shadcn UI + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## 🔐 Security Best Practices

1. **Never** store admin credentials in client-side code
2. **Always** use `has_role()` function for RLS policies
3. **Validate** all input data before database operations
4. **Use** soft deletes (archive flag) to prevent data loss
5. **Audit** admin actions through database logs

## 📝 Testing Checklist

- [ ] Sidebar responsive and never overlaps content
- [ ] Create team multi-select works (max 5 members)
- [ ] Delete student works for admins
- [ ] Duplicate cleanup script tested
- [ ] Metrics editing saves correctly
- [ ] Student status updates automatically
- [ ] All RLS policies enforced
- [ ] Export functions work (JSON/CSV)

## 🚀 Deployment

Simply open [Lovable](https://lovable.dev/projects/e45ddf6c-7c95-4915-a810-1eb0f6b2c0b8) and click on Share -> Publish.

### Custom Domain

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 🤝 Editing this Project

### Use Lovable

Simply visit the [Lovable Project](https://lovable.dev/projects/e45ddf6c-7c95-4915-a810-1eb0f6b2c0b8) and start prompting.

### Use your preferred IDE

Clone the repo and push changes - they will be reflected in Lovable.

### Use GitHub Codespaces

- Navigate to your repository
- Click "Code" → "Codespaces" → "New codespace"
- Edit files and commit changes

## 🆘 Support

For issues or questions:
1. Check Supabase logs in Dashboard → Database → Logs
2. Review RLS policies in Dashboard → Database → Tables
3. Verify user roles in `user_roles` table
4. See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for troubleshooting

---

Built with ❤️ for Self-Regulated Learning research

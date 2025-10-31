# Admin Setup & User Management Guide

## Setting Up Admin Users

This application uses a secure role-based access control system. To grant admin privileges to a user:

### 1. Create an Admin User in Supabase

Run this SQL query in your Supabase SQL Editor to add an admin role for a user:

```sql
-- Replace 'USER_ID_HERE' with the actual user ID from auth.users
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin');
```

### 2. Find a User's ID

To find a user's ID, go to:
- Supabase Dashboard → Authentication → Users
- Copy the UUID from the user you want to make an admin

### 3. Verify Admin Access

The admin can now:
- Create, edit, and delete students
- Create and manage teams
- Manage team members
- Update student metrics
- Access admin analytics dashboard

## Manual Metric Editing

Admins can manually edit student metrics from the Student Dashboard:

1. Navigate to Students page
2. Click on a student card
3. Find the "Edit Metrics" section
4. Click "Edit" button
5. Update values (0-100 range)
6. Click "Save"

All metrics are stored as structured data in the `student_metrics` table for future ML/AI analysis.

## Duplicate Cleanup

### Automatic Deduplication

The system automatically deduplicates students at query level by:
- Keeping the earliest created record
- Filtering by normalized name (lowercase, trimmed)

### Manual Cleanup Script

To merge duplicate records and preserve relationships:

```sql
-- Run this in Supabase SQL Editor
-- This script identifies duplicates and merges relationships

WITH duplicates AS (
  SELECT 
    id,
    name,
    university_email,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(name)) 
      ORDER BY created_at ASC
    ) as rn
  FROM public.students
  WHERE archived = false
)
UPDATE public.team_members tm
SET student_id = (
  SELECT id FROM duplicates WHERE rn = 1 AND duplicates.name = d.name
)
FROM duplicates d
WHERE tm.student_id = d.id AND d.rn > 1;

-- Soft delete duplicates (keeps data for rollback)
UPDATE public.students
SET archived = true
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
```

### Rollback Plan

To restore archived students:

```sql
UPDATE public.students
SET archived = false
WHERE id = 'STUDENT_ID_HERE';
```

## Student Status Management

Student status is automatically managed:
- **Free**: Not assigned to any team
- **Busy**: Assigned to one or more teams
- **Graduated**: Manually set for completed students

The `update_student_status()` trigger automatically updates status when students join/leave teams.

## Data Export for Research

### Export Single Student

From the Student Dashboard, click the "Export Data" button to download:
- Student profile
- All metrics (current and historical)
- Reflections and journals
- Action plans and tasks

### Export All Students

From the Students page:
1. Click "Export" dropdown
2. Choose JSON (complete data) or CSV (summary)

### ML-Ready Dataset Format

CSV exports include:
```
name, university_email, status, team, role, srl_score, technical_skills, 
collaboration, adaptability, consistency, problem_solving, created_at
```

All metrics are normalized to 0-100 scale for easy model training.

## Security Notes

⚠️ **Important Security Practices:**

1. **Never** store admin credentials in client-side code
2. **Always** use the `has_role()` function for RLS policies
3. **Use** server-side service role key only for privileged operations
4. **Validate** all input data before database operations
5. **Audit** admin actions through database logs

## Team Creation

When creating teams:
- Max team size: 5 members (1 leader + 4 members)
- Only "free" students can be assigned
- Team names must be unique
- Optional logo upload to Supabase Storage

## Troubleshooting

### "New row violates row-level security policy"

This means:
1. User is not authenticated, OR
2. User doesn't have admin role

Solution: Verify user has admin role in `user_roles` table

### Students Not Showing

Check:
1. `archived` column is `false`
2. RLS policies allow SELECT for everyone
3. No duplicate filtering issues

### Metrics Not Updating

Verify:
1. User has admin privileges
2. `student_metrics` table exists for the student
3. Values are within 0-100 range

## Support

For issues or questions:
1. Check Supabase logs in Dashboard → Database → Logs
2. Review RLS policies in Dashboard → Database → Tables
3. Verify user roles in `user_roles` table

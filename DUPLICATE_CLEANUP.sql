-- DUPLICATE CLEANUP SCRIPT
-- This script safely merges duplicate student records
-- ALWAYS backup your database before running!

-- Step 1: Identify duplicates (preview only)
SELECT 
  LOWER(TRIM(name)) as normalized_name,
  COUNT(*) as count,
  ARRAY_AGG(id ORDER BY created_at) as student_ids,
  ARRAY_AGG(created_at ORDER BY created_at) as created_dates
FROM public.students
WHERE archived = false
GROUP BY LOWER(TRIM(name))
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Step 2: Merge relationships to oldest record
-- This updates team_members, requests, metrics, reflections, and action plans

DO $$
DECLARE
  duplicate_record RECORD;
  keep_id uuid;
  remove_ids uuid[];
BEGIN
  -- Loop through each duplicate group
  FOR duplicate_record IN
    SELECT 
      LOWER(TRIM(name)) as normalized_name,
      ARRAY_AGG(id ORDER BY created_at) as student_ids
    FROM public.students
    WHERE archived = false
    GROUP BY LOWER(TRIM(name))
    HAVING COUNT(*) > 1
  LOOP
    -- First ID is the one we keep (oldest)
    keep_id := duplicate_record.student_ids[1];
    remove_ids := duplicate_record.student_ids[2:];

    -- Update team_members
    UPDATE public.team_members
    SET student_id = keep_id
    WHERE student_id = ANY(remove_ids);

    -- Update requests
    UPDATE public.requests
    SET student_id = keep_id
    WHERE student_id = ANY(remove_ids);

    -- Update student_metrics (keep oldest, delete duplicates)
    DELETE FROM public.student_metrics
    WHERE student_id = ANY(remove_ids)
    AND NOT EXISTS (
      SELECT 1 FROM public.student_metrics sm2
      WHERE sm2.student_id = keep_id
    );

    -- Update any remaining metrics
    UPDATE public.student_metrics
    SET student_id = keep_id
    WHERE student_id = ANY(remove_ids);

    -- Update student_reflections
    UPDATE public.student_reflections
    SET student_id = keep_id
    WHERE student_id = ANY(remove_ids);

    -- Update student_action_plans
    UPDATE public.student_action_plans
    SET student_id = keep_id
    WHERE student_id = ANY(remove_ids);

    -- Update metric_history
    UPDATE public.metric_history
    SET student_id = keep_id
    WHERE student_id = ANY(remove_ids);

    -- Soft delete duplicate students (don't actually delete, mark as archived)
    UPDATE public.students
    SET archived = true
    WHERE id = ANY(remove_ids);

    RAISE NOTICE 'Merged duplicates for student %, kept ID %, archived % records', 
      duplicate_record.normalized_name, keep_id, array_length(remove_ids, 1);
  END LOOP;
END $$;

-- Step 3: Verify cleanup
SELECT 
  'Total active students' as metric,
  COUNT(*) as count
FROM public.students
WHERE archived = false
UNION ALL
SELECT 
  'Archived students' as metric,
  COUNT(*) as count
FROM public.students
WHERE archived = true
UNION ALL
SELECT 
  'Remaining duplicates' as metric,
  COUNT(*) as count
FROM (
  SELECT LOWER(TRIM(name)) as normalized_name
  FROM public.students
  WHERE archived = false
  GROUP BY LOWER(TRIM(name))
  HAVING COUNT(*) > 1
) sub;

-- ROLLBACK INSTRUCTIONS
-- If you need to undo the archiving (does not restore old relationships):
/*
UPDATE public.students
SET archived = false
WHERE id IN (
  -- List specific IDs you want to restore
  'uuid-here',
  'uuid-here'
);
*/

-- PERMANENT DELETE (DANGER! Only after verifying everything is correct)
/*
DELETE FROM public.students
WHERE archived = true 
AND created_at < NOW() - INTERVAL '30 days';
*/

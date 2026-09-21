-- Add missing column for question_goal in class_assignments table
ALTER TABLE class_assignments ADD COLUMN IF NOT EXISTS question_goal integer;
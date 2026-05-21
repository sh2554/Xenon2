-- Theory quizzes & programming code submissions for class assignments

ALTER TABLE class_assignments ADD COLUMN IF NOT EXISTS assignment_type TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE class_assignments ADD COLUMN IF NOT EXISTS content_json JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE assignment_submissions ADD COLUMN IF NOT EXISTS answers_json JSONB;
ALTER TABLE assignment_submissions ADD COLUMN IF NOT EXISTS submitted_code TEXT NOT NULL DEFAULT '';
ALTER TABLE assignment_submissions ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE assignment_submissions ADD COLUMN IF NOT EXISTS max_score INTEGER;

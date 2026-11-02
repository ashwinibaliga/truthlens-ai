-- =========================================================================
-- TruthLens AI — Supabase PostgreSQL Schema with Authentication & RLS
-- =========================================================================

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Scans Table Associated with auth.users
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video', 'text')),
    file_size BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    provider TEXT NOT NULL,
    provider_job_id TEXT,
    verdict TEXT NOT NULL CHECK (verdict IN ('likely_ai', 'likely_human', 'potentially_manipulated', 'inconclusive')),
    confidence_metrics JSONB NOT NULL,
    forensic_results JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- If user_id was not previously present, alter table to add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'scans' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.scans ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Indexes for High-Performance Scoped Queries
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans (user_id);
CREATE INDEX IF NOT EXISTS idx_scans_media_type ON public.scans (media_type);
CREATE INDEX IF NOT EXISTS idx_scans_verdict ON public.scans (verdict);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_status ON public.scans (status);

-- 3. Row Level Security (RLS) Configuration
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Drop old generic policies if they exist
DROP POLICY IF EXISTS "Public Read Access" ON public.scans;
DROP POLICY IF EXISTS "Public Insert Access" ON public.scans;
DROP POLICY IF EXISTS "Public Delete Access" ON public.scans;
DROP POLICY IF EXISTS "Users can only read own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can only insert own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can only delete own scans" ON public.scans;

-- Users can only view their own scans
CREATE POLICY "Users can only read own scans"
    ON public.scans FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Authenticated users can only insert scans tagged with their user ID
CREATE POLICY "Users can only insert own scans"
    ON public.scans FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Users can only delete their own scans
CREATE POLICY "Users can only delete own scans"
    ON public.scans FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Comment metadata
COMMENT ON TABLE public.scans IS 'Stores forensic scan metadata, detection verdicts, and confidence metrics scoped per authenticated user in TruthLens AI.';
COMMENT ON COLUMN public.scans.user_id IS 'Foreign key referencing Supabase auth.users(id) ensuring complete per-user isolation.';

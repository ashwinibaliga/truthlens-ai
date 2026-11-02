-- =========================================================================
-- TruthLens AI — Supabase PostgreSQL Schema
-- =========================================================================

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Scans Table
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 2. Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_scans_media_type ON public.scans (media_type);
CREATE INDEX IF NOT EXISTS idx_scans_verdict ON public.scans (verdict);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_status ON public.scans (status);

-- 3. Row Level Security (RLS)
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for hackathon demo simplicity)
CREATE POLICY "Public Read Access"
    ON public.scans FOR SELECT
    USING (true);

-- Allow authenticated or service_role inserts and deletes
CREATE POLICY "Public Insert Access"
    ON public.scans FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public Delete Access"
    ON public.scans FOR DELETE
    USING (true);

-- 4. Comment metadata
COMMENT ON TABLE public.scans IS 'Stores forensic scan metadata, detection verdicts, confidence metrics, and technical indicators for TruthLens AI.';
COMMENT ON COLUMN public.scans.confidence_metrics IS 'JSONB payload containing ai_probability, human_probability, confidence_level, and explanation.';
COMMENT ON COLUMN public.scans.forensic_results IS 'JSONB payload containing indicators, ELA / FFT / audio spectral / linguistic breakdown.';


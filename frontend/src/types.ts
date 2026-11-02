export type MediaType = 'image' | 'audio' | 'video' | 'text';

export type ScanStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type Verdict = 
  | 'likely_ai'
  | 'likely_human'
  | 'potentially_manipulated'
  | 'inconclusive';

export type ConfidenceLevel = 'high' | 'moderate' | 'low';

export type IndicatorStatus = 'flag' | 'pass' | 'neutral' | 'info';

export interface EvidenceItem {
  title: string;
  description: string;
  metric_value?: string;
  indicator_type: IndicatorStatus;
  detail?: string;
}

export interface ConfidenceMetrics {
  ai_probability: number;
  human_probability: number;
  confidence_level: ConfidenceLevel;
  entropy?: number;
  raw_score?: number;
  explanation: string;
}

export interface FrameAnalysisItem {
  frame_index: number;
  timestamp: string;
  ai_probability: number;
  verdict: Verdict;
}

export interface LinguisticBreakdown {
  burstiness?: {
    avg_sentence_length: number;
    sentence_length_std_dev: number;
    burstiness_index: number;
  };
  vocabulary?: {
    total_words: number;
    unique_words: number;
    type_token_ratio: number;
    root_ttr: number;
  };
  entropy?: number;
  ai_markers_found?: string[];
}

export interface ForensicResults {
  media_metadata: Record<string, any>;
  indicators: EvidenceItem[];
  technical_details: Record<string, any>;
  limitations_disclaimer: string;
  frame_analysis?: FrameAnalysisItem[];
  linguistic_breakdown?: LinguisticBreakdown;
}

export interface ScanResponse {
  id: string;
  filename: string;
  media_type: MediaType;
  file_size: number;
  status: ScanStatus;
  provider: string;
  provider_job_id?: string;
  verdict: Verdict;
  confidence_metrics: ConfidenceMetrics;
  forensic_results: ForensicResults;
  created_at: string;
  completed_at?: string;
}

export interface StatsResponse {
  total_scans: number;
  ai_detected_count: number;
  human_detected_count: number;
  manipulated_count: number;
  inconclusive_count: number;
  by_media_type: {
    image: number;
    audio: number;
    video: number;
    text: number;
  };
  recent_activity: {
    id: string;
    filename: string;
    media_type: MediaType;
    verdict: Verdict;
    ai_probability: number;
    created_at: string;
    provider: string;
  }[];
}

export interface ProviderStatus {
  name: string;
  category: string;
  status: 'operational' | 'active_api' | 'local_engine' | 'local_fallback' | 'unavailable';
  description: string;
  details: string;
}


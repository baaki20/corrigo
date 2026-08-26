export const evidenceGrades = [
  "SUPPORTED",
  "MISLEADING",
  "FALSE",
  "UNCLEAR",
  "CONTEXT_DEPENDENT",
] as const;

export type EvidenceGrade = (typeof evidenceGrades)[number];

export const gradeLabels: Record<EvidenceGrade, string> = {
  SUPPORTED: "Supported",
  MISLEADING: "Misleading",
  FALSE: "False",
  UNCLEAR: "Unclear",
  CONTEXT_DEPENDENT: "Context-dependent",
};

export type SourceType =
  | "PRIMARY_STUDY"
  | "OFFICIAL_SOURCE"
  | "REFERENCE"
  | "JOURNALISM"
  | "EXPERT_ANALYSIS"
  | "OTHER";

export const sourceTypeLabels: Record<SourceType, string> = {
  PRIMARY_STUDY: "Primary study",
  OFFICIAL_SOURCE: "Official source",
  REFERENCE: "Reference",
  JOURNALISM: "Journalism",
  EXPERT_ANALYSIS: "Expert analysis",
  OTHER: "Other",
};

export type RichTextNode = {
  type: string;
  text?: string;
  attrs?: { level?: number; [key: string]: unknown };
  content?: RichTextNode[];
};

export type SourceRecord = {
  id: string;
  title: string;
  publisher: string;
  type: SourceType;
  url: string;
  publicationDate?: Date | null;
  note?: string | null;
};

export type DossierRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  claim: string;
  conclusion: string;
  grade: EvidenceGrade;
  body: RichTextNode;
  youtubeUrl: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  scheduledAt?: Date | null;
  publishedAt?: Date | null;
  reviewedAt?: Date | null;
  sources: SourceRecord[];
  topics: { name: string; slug: string }[];
};

export const displayDate = (date?: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date)
    : "Not reviewed yet";

export const gradeClass = (grade: EvidenceGrade) => grade.toLowerCase().replaceAll("_", "-");

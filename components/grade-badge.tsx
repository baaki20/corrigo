import { gradeClass, gradeLabels, type EvidenceGrade } from "@/lib/types";

export function GradeBadge({ grade, large = false }: { grade: EvidenceGrade; large?: boolean }) {
  return <span className={`grade-badge ${gradeClass(grade)} ${large ? "grade-badge-large" : ""}`}><i aria-hidden="true" />{gradeLabels[grade]}</span>;
}

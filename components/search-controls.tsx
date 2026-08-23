import Link from "next/link";
import { gradeLabels, evidenceGrades } from "@/lib/types";

export function SearchControls({ query, topic, grade, topics }: { query?: string; topic?: string; grade?: string; topics: { name: string; slug: string }[] }) {
  const href = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const all = { q: query, topic, grade, ...next };
    Object.entries(all).forEach(([key, value]) => value && params.set(key, value));
    return `/library${params.toString() ? `?${params}` : ""}`;
  };
  return <div className="search-controls">
    <form className="search-form" action="/library">
      <label htmlFor="library-search">Search the desk</label>
      <div><input id="library-search" name="q" defaultValue={query} placeholder="Try “statistics” or a claim" /><button type="submit">Search</button></div>
    </form>
    <div className="filter-row">
      <span className="filter-label">Browse by</span>
      <Link className={!topic && !grade ? "filter active" : "filter"} href={href({ topic: undefined, grade: undefined })}>All notes</Link>
      {topics.map((item) => <Link className={topic === item.slug ? "filter active" : "filter"} key={item.slug} href={href({ topic: item.slug, grade: undefined })}>{item.name}</Link>)}
      {evidenceGrades.map((item) => <Link className={grade === item ? "filter active" : "filter"} key={item} href={href({ grade: item, topic: undefined })}>{gradeLabels[item]}</Link>)}
    </div>
  </div>;
}

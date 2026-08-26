"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useMemo, useState } from "react";
import type { RichTextNode, SourceType } from "@/lib/types";

type SourceDraft = { title: string; publisher: string; type: SourceType; url: string; note: string };
const emptySource: SourceDraft = { title: "", publisher: "", type: "OTHER", url: "", note: "" };

function localDateValue(date?: Date | string | null) {
  if (!date) return "";
  const value = new Date(date);
  const offset = value.getTimezoneOffset();
  return new Date(value.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export function DossierEditor({ initial, action, id }: { initial?: any; action: (formData: FormData) => void; id?: string }) {
  const [sources, setSources] = useState<SourceDraft[]>(initial?.sources?.map((s: any) => ({ title: s.title, publisher: s.publisher, type: s.type, url: s.url, note: s.note || "" })) || [{ ...emptySource }]);
  const [body, setBody] = useState<RichTextNode>(initial?.body || { type: "doc", content: [{ type: "paragraph" }] });
  const editor = useEditor({ extensions: [StarterKit, Link.configure({ openOnClick: false })], content: body, immediatelyRender: false, onUpdate: ({ editor: current }) => setBody(current.getJSON() as RichTextNode) });
  const sourcesJson = useMemo(() => JSON.stringify(sources), [sources]);
  const timing = initial?.status || "DRAFT";
  const updateSource = (index: number, key: keyof SourceDraft, value: string) => setSources((items) => items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  return <form action={action} className="editor-grid">
    <input type="hidden" name="id" value={id || ""} /><input type="hidden" name="body" value={JSON.stringify(body)} /><input type="hidden" name="sources" value={sourcesJson} />
    <div>
      <div className="field"><label htmlFor="title">Dossier title</label><input required id="title" name="title" defaultValue={initial?.title} placeholder="The sentence we need to look at again" /></div>
      <div className="field"><label htmlFor="slug">URL slug</label><input required id="slug" name="slug" defaultValue={initial?.slug} placeholder="the-sentence-we-need-to-look-at" /></div>
      <div className="field"><label htmlFor="summary">Short summary</label><textarea required id="summary" name="summary" rows={3} defaultValue={initial?.summary} /></div>
      <div className="field"><label htmlFor="claim">The claim</label><textarea required id="claim" name="claim" rows={4} defaultValue={initial?.claim} /></div>
      <div className="field"><label htmlFor="conclusion">Corrigo’s conclusion</label><textarea required id="conclusion" name="conclusion" rows={4} defaultValue={initial?.conclusion} /></div>
      <div className="field"><label htmlFor="youtubeUrl">Original YouTube URL</label><input required id="youtubeUrl" name="youtubeUrl" type="url" defaultValue={initial?.youtubeUrl} /></div>
      <div className="field"><label htmlFor="topic">Topic</label><input id="topic" name="topic" defaultValue={initial?.topics?.[0]?.name || "Media literacy"} /></div>
      <div className="field"><label htmlFor="grade">Evidence grade</label><select id="grade" name="grade" defaultValue={initial?.grade || "UNCLEAR"}><option value="SUPPORTED">Supported</option><option value="MISLEADING">Misleading</option><option value="FALSE">False</option><option value="UNCLEAR">Unclear</option><option value="CONTEXT_DEPENDENT">Context-dependent</option></select></div>
      <div className="field"><label htmlFor="timing">Publication timing</label><select id="timing" name="timing" defaultValue={timing}><option value="DRAFT">Save as draft</option><option value="SCHEDULED">Schedule publication</option><option value="PUBLISHED">Publish now</option></select></div>
      <div className="field"><label htmlFor="scheduledAt">Publish at <span className="field-hint">your local time</span></label><input id="scheduledAt" name="scheduledAt" type="datetime-local" defaultValue={localDateValue(initial?.scheduledAt)} /></div>
      <div className="field"><label>Evidence body</label><div className="editor-box"><div className="editor-toolbar"><button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button><button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button><button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>Heading</button><button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>List</button></div><EditorContent editor={editor} className="editor-content" /></div></div>
      <button className="admin-button" type="submit">Save dossier</button>
    </div>
    <aside><div className="field"><label>Sources</label>{sources.map((source, index) => <div className="source-editor" key={index}><h3>Source {index + 1}</h3><div className="source-input"><input aria-label="Source title" placeholder="Title" required value={source.title} onChange={(event) => updateSource(index, "title", event.target.value)} /><input aria-label="Publisher" placeholder="Publisher" required value={source.publisher} onChange={(event) => updateSource(index, "publisher", event.target.value)} /><select aria-label="Source type" value={source.type} onChange={(event) => updateSource(index, "type", event.target.value as SourceType)}><option value="PRIMARY_STUDY">Primary study</option><option value="OFFICIAL_SOURCE">Official source</option><option value="REFERENCE">Reference</option><option value="JOURNALISM">Journalism</option><option value="EXPERT_ANALYSIS">Expert analysis</option><option value="OTHER">Other</option></select><input aria-label="Source URL" placeholder="https://" type="url" required value={source.url} onChange={(event) => updateSource(index, "url", event.target.value)} /></div><textarea aria-label="Source note" placeholder="What does this source establish?" rows={3} value={source.note} onChange={(event) => updateSource(index, "note", event.target.value)} /></div>)}<button type="button" className="admin-button secondary" onClick={() => setSources((items) => [...items, { ...emptySource }])}>+ Add source</button></div></aside>
  </form>;
}

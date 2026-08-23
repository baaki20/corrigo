import type { RichTextNode } from "@/lib/types";

function renderNode(node: RichTextNode, index: number): React.ReactNode {
  const children = node.content?.map((child, childIndex) => renderNode(child, childIndex));
  if (node.type === "text") return node.text;
  if (node.type === "paragraph") return <p key={index}>{children}</p>;
  if (node.type === "heading") return node.attrs?.level === 3 ? <h3 key={index}>{children}</h3> : <h2 key={index}>{children}</h2>;
  if (node.type === "bulletList") return <ul key={index}>{children}</ul>;
  if (node.type === "orderedList") return <ol key={index}>{children}</ol>;
  if (node.type === "listItem") return <li key={index}>{children}</li>;
  if (node.type === "blockquote") return <blockquote key={index}>{children}</blockquote>;
  if (node.type === "hardBreak") return <br key={index} />;
  return <div key={index}>{children}</div>;
}

export function RichText({ body }: { body: RichTextNode }) {
  return <div className="rich-text">{body.content?.map((node, index) => renderNode(node, index))}</div>;
}

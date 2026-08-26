"use client";

export function ConfirmForm({ action, children, message }: { action: (formData: FormData) => void; children: React.ReactNode; message: string }) {
  return <form action={action} onSubmit={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>{children}</form>;
}

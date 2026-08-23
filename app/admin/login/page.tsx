import { login } from "@/app/actions";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <main className="login-card"><span className="kicker">Private desk</span><h1>Welcome back.</h1><p>Sign in to write and publish Corrigo evidence files.</p>{params.error && <p className="error">That email and password did not match.</p>}<form action={login}><div className="field"><label htmlFor="email">Email</label><input required id="email" name="email" type="email" /></div><div className="field"><label htmlFor="password">Password</label><input required id="password" name="password" type="password" /></div><button className="admin-button" type="submit">Enter the desk</button></form></main>;
}

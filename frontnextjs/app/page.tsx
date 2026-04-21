import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 bg-black" />
      <h1 className="text-lg font-semibold tracking-tight text-black">
        Deep Focus
      </h1>
      <div className="flex gap-4 mt-4">
        <Link
          href="/auth/login"
          className="bg-black text-white text-sm font-medium tracking-widest uppercase px-6 py-3 hover:bg-gray-900 transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/auth/register"
          className="border border-black text-black text-sm font-medium tracking-widest uppercase px-6 py-3 hover:bg-black hover:text-white transition-colors"
        >
          Register
        </Link>
      </div>
    </main>
  );
}

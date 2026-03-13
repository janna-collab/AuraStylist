export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Login / Sign Up</h1>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <p className="mb-4 text-center">Authentication will go here via Supabase.</p>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Authenticate</button>
      </div>
    </div>
  );
}

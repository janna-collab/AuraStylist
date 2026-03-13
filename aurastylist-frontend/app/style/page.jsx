import ChatBot from '../../components/ChatBot';

export default function StylePage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8">Style Request Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">Venue & Vibe</h2>
          <input type="text" placeholder="Venue/Event (e.g. Wedding)" className="border p-3 w-full mb-4 rounded-lg" />
          <input type="text" placeholder="Desired Aesthetic (e.g. Dark Academia)" className="border p-3 w-full mb-4 rounded-lg" />
          <button className="w-full bg-black text-white py-3 rounded-lg font-bold">Generate Looks</button>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

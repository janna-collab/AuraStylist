export default function VoiceRecorder({ onRecord }) {
  return (
    <div className="flex items-center justify-center p-4">
      <button className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-transform transform active:scale-95">
        Record Voice
      </button>
    </div>
  );
}

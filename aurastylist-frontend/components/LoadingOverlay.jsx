export default function LoadingOverlay({ isLoading, message }) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4"></div>
      <p className="text-white text-lg font-semibold">{message || "Loading..."}</p>
    </div>
  );
}

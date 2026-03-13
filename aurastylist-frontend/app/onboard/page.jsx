import ImageUpload from '../../components/ImageUpload';

export default function OnboardPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-extrabold mb-6">Create Your Body Profile</h1>
      <ImageUpload onUpload={(file) => console.log('Uploaded', file)} />
      <div className="mt-8 space-y-4">
        <input type="text" placeholder="Height" className="border p-2 w-full rounded" />
        <input type="text" placeholder="Shoe Size" className="border p-2 w-full rounded" />
        <input type="text" placeholder="Preferred Fit" className="border p-2 w-full rounded" />
        <button className="bg-black text-white px-6 py-3 rounded-lg font-bold">Save Profile</button>
      </div>
    </div>
  );
}

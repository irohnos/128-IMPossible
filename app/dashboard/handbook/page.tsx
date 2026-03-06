export default async function HandbookPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#7b1113]">Student Handbook</h1>
          <p className="text-gray-600 mt-2">Bachelor of Science in Management Economics</p>
        </div>
      </div>

      <div className="w-full h-full">
        <iframe
          src="/BSME-SH-2021-v3.pdf#view=FitH&toolbar=1&navpanes=0"
          className="w-full h-full border-none"
          title="BS Management Economics Student Handbook"
        />
      </div>
    </div>
  );
}

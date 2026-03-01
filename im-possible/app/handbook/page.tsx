export default function HandbookPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Handbook</h1>
          <p className="text-sm text-slate-500">Bachelor of Science in Management Economics</p>
        </div>

        <a href="/BSME-SH-2021-v3.pdf" download>
        </a>
      </div>

      <div className="flex-1 w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <iframe
          src="/BSME-SH-2021-v3.pdf"
          className="w-full h-full border-none"
          title="BS Management Economics Student Handbook"
        />
      </div>
    </div>
  );
}
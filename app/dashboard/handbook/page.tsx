export default async function HandbookPage() {
  return (
    <div className="flex flex-col h-full">
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

import { Search, Filter, Plus } from "lucide-react";

//placeholder
const batches = [
  "Batch '25 - '26", "Batch '24 - '25", "Batch '23 - '24", "Batch '22 - '23",
  "Batch '21 - '22", "Batch '20 - '21", "Batch '19 - '20", "Batch '18 - '19"
];

export default function StudentChecklist() {
  return (
    <div className="bg-white min-h-screen">
      {/*Header */}
      <div className="bg-[#4b4b4b] h-14 w-full shadow-sm mb-10 rounded-md" />
      <div className="px-10">
        <div className="flex items-center justify-between mb-12">
          {/*Search */}
          <div className="flex gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by Admission Year, Name" 
                className="w-full pl-10 pr-4 py-2 rounded-md bg-[#e5e7eb] focus:outline-none border-none text-sm placeholder-gray-500"
              />
            </div>
            {/*Filter */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#e5e7eb] text-gray-600 hover:bg-gray-300 border-none transition-colors text-sm">
              <Filter className="h-5 w-5 text-gray-500" />
              Filters
            </button>
          </div>
          {/*Add button */}
          <button className="p-2 bg-[#e5e7eb] hover:bg-gray-300 rounded-md transition-colors border-none shadow-sm ml-4">
            <Plus className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {/*Folder */}
        <div className="grid grid-cols-5 gap-y-12 gap-x-6">
          {batches.map((batch) => (
            <div key={batch} className="group flex flex-col items-center cursor-pointer">

              <div className="relative w-20 h-16 mb-3 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-8 h-3 bg-gray-500 rounded-t-sm transition-colors group-hover:bg-gray-600" />
                <div className="absolute bottom-0 w-full h-14 bg-gray-500 rounded-tr-sm rounded-b-sm shadow-sm transition-all duration-300 group-hover:bg-gray-600 group-hover:h-12" />
                <div className="absolute bottom-0 w-full h-12 bg-gray-400 rounded-b-sm origin-bottom transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:skew-x-[-15deg] group-hover:scale-y-[1.1]" />
              </div>
              <p className="text-[15px] font-medium text-[#374151] tracking-tight transition-colors group-hover:text-black text-center leading-relaxed">
                {batch}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

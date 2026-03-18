import { createClient } from "@/lib/supabase/client";

export interface SearchConfig<T = Record<string, unknown>> {
  fetchSuggestions: (term: string) => Promise<T[]>;
  getLabel: (item: T) => string;
  getValue?: (item: T) => string;
  getSubLabel?: (item: T) => string; 
}

// academic papers
export interface PaperSuggestion {
  paper_title: string;
  paper_year_submitted: number;
  adviser: { adviser_fname: string; adviser_lname: string } | null;
  author: { author_fname: string; author_lname: string }[];
}

export const paperSearchConfig: SearchConfig<PaperSuggestion> = {
fetchSuggestions: async (term) => {
  const supabase = createClient();
  const isYear = !isNaN(Number(term)) && term.length === 4;
  const lowerTerm = term.toLowerCase();

  // match title
  const titleYearPromise = supabase
    .from("academic_papers")
    .select(`
      paper_title,
      paper_year_submitted,
      adviser ( adviser_fname, adviser_lname ),
      author ( author_fname, author_lname )
    `)
    .or(
      [
        `paper_title.ilike.%${term}%`,
        isYear ? `paper_year_submitted.eq.${term}` : "",
      ].filter(Boolean).join(",")
    )
    .order("paper_title", { ascending: true })
    .limit(15);

  // match adviser
  const adviserPromise = supabase
    .from("academic_papers")
    .select(`
      paper_title,
      paper_year_submitted,
      adviser!inner ( adviser_fname, adviser_lname ),
      author ( author_fname, author_lname )
    `)
    .or(
      `adviser_fname.ilike.%${term}%,adviser_lname.ilike.%${term}%`,
      { referencedTable: "adviser" }
    )
    .order("paper_title", { ascending: true })
    .limit(15);

//match author
  const authorPromise = supabase
    .from("academic_papers")
    .select(`
      paper_title,
      paper_year_submitted,
      adviser ( adviser_fname, adviser_lname ),
      author!inner ( author_fname, author_lname )
    `)
    .or(
      `author_fname.ilike.%${term}%,author_lname.ilike.%${term}%`,
      { referencedTable: "author" }
    )
    .order("paper_title", { ascending: true })
    .limit(15);

  const [titleYearRes, adviserRes, authorRes] = await Promise.all([
    titleYearPromise,
    adviserPromise,
    authorPromise,
  ]);

  if (titleYearRes.error) console.error("Paper title/year search error:", titleYearRes.error.message);
  if (adviserRes.error) console.error("Paper adviser search error:", adviserRes.error.message);
  if (authorRes.error) console.error("Paper author search error:", authorRes.error.message);

  const combined = [
    ...((titleYearRes.data as unknown as PaperSuggestion[]) ?? []),
    ...((adviserRes.data as unknown as PaperSuggestion[]) ?? []),
    ...((authorRes.data as unknown as PaperSuggestion[]) ?? []),
  ];

  const seenTitles = new Set<string>();
  return combined.filter((row) => {
    if (seenTitles.has(row.paper_title)) return false;
    seenTitles.add(row.paper_title);
    return true;
  }).slice(0, 7);
},
  getLabel: (item) => item.paper_title,
  getValue: (item) => item.paper_title,
  getSubLabel: (item) => {
    const parts: string[] = [];
    if (item.paper_year_submitted) parts.push(String(item.paper_year_submitted));
    if (item.adviser) parts.push(`Adviser: ${item.adviser.adviser_fname} ${item.adviser.adviser_lname}`);
    if (item.author?.length > 0) {
        const names = item.author.map(a => `${a.author_fname} ${a.author_lname}`).join(", ");
        parts.push(`Author/s: ${names}`);
    }
    return parts.join(" · ");
  },
};

// student
export interface StudentSuggestion {
  student_fname: string;
  student_lname: string;
  student_number: number;
}

export const studentSearchConfig: SearchConfig<StudentSuggestion> = {
  fetchSuggestions: async (term) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("student")
      .select("student_fname, student_lname, student_number")
      .or(`student_fname.ilike.%${term}%,student_lname.ilike.%${term}%,student_number.ilike.%${term}%`)
      .order("student_lname", { ascending: true })
      .limit(7);

    if (error) {
      console.error("Student search error:", error.message);
      return [];
    }
    return (data as StudentSuggestion[]) ?? [];
  },
  getLabel: (item) => `${item.student_fname} ${item.student_lname}`,
  getValue: (item) => String(item.student_number),
  getSubLabel: (item) => `ID: ${item.student_number}`,
};

// advisers
//export interface AdviserSuggestion {
  //adviser_fname: string;
  //adviser_lname: string;
//}


// courses
export interface CourseSuggestion {
  course_id: string;
  course_title: string;
}

export const courseSearchConfig: SearchConfig<CourseSuggestion> = {
  fetchSuggestions: async (term) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("course_id, course_title")
      .or(`course_id.ilike.%${term}%,course_title.ilike.%${term}%`)
      .order("course_title", { ascending: true })
      .limit(7);

    if (error) {
      console.error("Course search error:", error.message);
      return [];
    }
    return (data as CourseSuggestion[]) ?? [];
  },
  getLabel: (item) => `${item.course_id} — ${item.course_title}`,
  getValue: (item) => item.course_id,
};

export const searchConfigRegistry = {
  papers: paperSearchConfig,
  students: studentSearchConfig,
  courses: courseSearchConfig,
} as const;

export type SearchConfigKey = keyof typeof searchConfigRegistry;
export default async function Page() {
  const theme = {
    bg: 'bg-[#faf7f5]',
    primary: 'text-[#7b1113]',
    primaryBg: 'bg-[#7b1113]',
    accent: 'border-[#7b1113]',
    text: 'text-[#3b0708]',
  };

  return (
    <main className={`min-h-screen bg-white`}>
      <div className="max-w-auto mx-auto">
        <section className="space-y-6 text-lg leading-relaxed text-[#3b0708]/90">
          <p className="text-justify">
            As the only national university in the country, the University of the Philippines takes pride in being the pioneer in higher education through 
            academic excellence, outstanding research and relevant public service. Established in 1908, UP started as a small Manila campus with few colleges.
          </p>
          
          <p className="text-justify">
            Today, the university is composed of eight (8) constituent universities spread throughout 17 campuses across the archipelago. 
            Established in 1961 as a unit of the UP System, <span className="font-semibold">UP Baguio</span> was a regional campus of UP Diliman for nearly four decades. 
            It became the 7th constituent university of the UP System in 2002 to serve as the hub of knowledge generation and human resource training and development in Northern Luzon.
            It contributes in nurturing and developing innovative programs in the arts and sciences as it develops the niche it has created over the past decades in indigenous studies.
          </p>

          <div className={`p-6 my-8 border-l-4 ${theme.accent} bg-white shadow-sm italic`}>
            The College of Social Sciences (CSS) was established on December 2, 2002. The Institute of Management, 
            formerly known as the Management Sciences Division, was integrated with the college.
          </div>
        </section>

        <section className="mt-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className={`text-2xl font-bold ${theme.primary} mb-6 flex items-center gap-2`}>
              Our Commitment
            </h2>
            <p className="mb-4 text-justify text-[#3b0708]/90">
              The Institute of Management, in maintaining itself as the premier professional management education center in Northern Luzon, 
              nurturing competent and flexible professionals dedicated to:
            </p>
            <ul className="space-y-3">
              {[
                'develop and enrich a responsive, updated and relevant curriculum;',
                'attract and maintain a pool of qualified and competent academic and support staff;',
                'pursue a selective process of student admission;',
                'provide facilities conducive to learning; and',
                'conduct research and public service.'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 rounded-full ${theme.primaryBg} shrink-0`} />
                  <span className="text-sm font-medium text-[#3b0708]/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#7b1113]/20">
              <h2 className={`text-xl font-bold ${theme.primary} mb-4 flex items-center gap-2`}>
                Bachelor of Science in Management Economics (BSME)
              </h2>
              <div className="space-y-4 text-sm text-[#3b0708]/90">
                <p className="text-justify">
                  An undergraduate program which provides students with knowledge and training in business management that is anchored on 
                  conceptual foundations developed in the field of economics.
                </p>
              </div>
            </div>

            <div className="bg-[#7b1113] p-6 rounded-xl text-white shadow-md">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                Master of Management (MM)
              </h2>
              <p className="text-sm text-white/90 text-justify leading-relaxed">
                A graduate program that equips students, professionals, and  practitioners with holistic and integrated knowledge 
                and skills in management to enable them to assume and implement responsible supervisory and other related positions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
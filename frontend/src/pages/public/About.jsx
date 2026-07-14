export function About() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-950">About SkillShare</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          The Engineering Skill Sharing Platform connects students and staff across all engineering departments to learn, teach, and grow together.
          Through shared skills, workshops, and mentorship, it fosters collaboration, innovation, and continuous learning beyond the classroom.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {['Course marketplace', 'Role dashboards', 'Payment-ready flow'].map((item) => (
            <article key={item} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="font-black text-gray-950">{item}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Clean and and scalable modules for good production growth.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

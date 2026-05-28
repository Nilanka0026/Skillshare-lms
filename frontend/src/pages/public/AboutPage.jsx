export function AboutPage({ page }) {
  return (
    <section className="page-section page-pad prose-page">
      <h1>{page.title}</h1>
      <p>{page.description}</p>
      <p>SkillShare connects students with practical, project-based courses and gives instructors the tools to publish, analyze, and earn from their knowledge.</p>
      <p>The platform is structured for a MERN backend with separate learner, instructor, admin, payment, and course modules.</p>
    </section>
  );
}

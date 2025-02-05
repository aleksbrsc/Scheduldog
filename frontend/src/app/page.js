"use client";
import coursesData from "./data/courses.json";
import styles from "./css/home.module.css";
import dynamic from 'next/dynamic';

const Scheduler = dynamic(() => import('./scheduler/page.js'), {
  ssr: false // Disable SSR for Scheduler
});

export default function Home() {
  return (
    <section id={styles.hero_section}>
      <div id={styles.hero_container}>
        {coursesData.courses.map((course) => (
          <Scheduler key={course.courseCode} course={course} />
        ))}
      </div>
    </section>
  );
}

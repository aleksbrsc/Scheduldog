"use client";
import coursesData from "./data/courses.json";
import Scheduler from "./scheduler/page.js";
import styles from "./css/home.module.css";

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

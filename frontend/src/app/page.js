import Image from "next/image";
import styles from "./css/home.module.css";
import courses from "./data/courses.json";

export default function Home() {
  return (
    <main>
      <section id={styles.hero_section}>
        <div id={styles.hero_container}>
          <h1>Scheduldog :0</h1>
          <h2>Audrey here</h2>
        </div>
      </section>
    </main>
  );
}

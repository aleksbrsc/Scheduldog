import Image from "next/image";
import styles from "./css/home.module.css";

export default function Home() {
  return (
    <main>
      <section id={styles.hero_section}>
        <div id={styles.hero_container}>
          <h1>Scheduldog :0</h1>
        </div>
      </section>
    </main>
  );
}

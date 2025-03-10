import styles from "./css/home.module.css";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import dachs from './assets/images/home/dachs.png';
import schedule_demo from './assets/images/home/schedule_demo.png';
import angled_arrow from './assets/icons/angled_arrow.svg';

// const Scheduler = dynamic(() => import('./scheduler/page.js'), {
//   ssr: false // Disable SSR for Scheduler
// });

export default function Home() {
  return (
    <section id={styles.hero_section}>
      <div id={styles.hero_container}>
        <h1>Scheduling so easy, <span>man’s best friend</span> 🐕✨ could do it.</h1>
        <Image id={styles.dachshund} src={dachs} alt="buff dachshund" priority={true}/>
        <div id={styles.demo_container}>
          <div id={styles.demo_snippet} onClick={null}>
            <Image id={styles.demo_image} src={schedule_demo} alt="demo schedule image" priority={true}/>
            <Image id={styles.demo_arrow} src={angled_arrow} alt="fancy arrow" priority={true}/>
          </div>
          <h2>Get started now!</h2>
          <p>Plug in your courses and generate a schedule</p>
        </div>
      </div>
    </section>
    // <section id={styles.hero_section}>
    //   <div id={styles.hero_container}>
    //     {coursesData.courses.map((course) => (
    //       <Scheduler key={course.courseCode} course={course} />
    //     ))}
    //   </div>
    // </section>
  );
}
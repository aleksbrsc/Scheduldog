"use client";
import coursesData from "./data/courses.json";
import Scheduler from "./scheduler/page.js";

export default function Home() {
  return (
    <div>
      <h1>Course Scheduler</h1>
      {coursesData.courses.map((course) => (
        <Scheduler key={course.courseCode} course={course} />
      ))}
    </div>
  );
}

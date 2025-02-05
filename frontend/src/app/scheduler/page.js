"use client";
import { useRef, useEffect, useState } from "react";
import { createSwapy } from "swapy";
import styles from "../css/scheduler.module.css";

export default function Scheduler({ course }) {
  const [selected, setSelected] = useState(course.sections);
  const [available, setAvailable] = useState(null);

  const containerRef = useRef(null);
  const swapyRef = useRef(null);

  // Update selected and available sections when course changes
  useEffect(() => {
    if (course) {
      setSelected(course.sections[0]);
      setAvailable(course.sections.slice(1));
    }
  }, [course]);

  // Initialize Swapy when container, selected, and available are ready
  useEffect(() => {
    if (containerRef.current && selected && available) {
      swapyRef.current = createSwapy(containerRef.current);

      swapyRef.current.onSwap((event) => {
        if (!event ||!event.source ||!event.target) {
          return;
        }
        const { source, target } = event;

        const sourceId = source.getAttribute("data-swapy-item");
        const targetId = target.getAttribute("data-swapy-item");

        if (
          (sourceId === "selected" && targetId!== "selected") ||
          (targetId === "selected" && sourceId!== "selected")
        ) {
          const availableSectionId = sourceId === "selected"? targetId: sourceId;
          const swappedSection = available.find(
            (sec) => sec.class === availableSectionId
          );
          if (swappedSection) {
            setAvailable((prev) =>
              prev.map((sec) =>
                sec.class === swappedSection.class? selected: sec
              )
            );
            setSelected(swappedSection);
          }
        }
      });
    }

    return () => {
      swapyRef.current?.destroy();
    };
  }, [selected, available]);

  if (!course ||!selected ||!available) {
    return <div className={styles.scheduler_skeleton}>Loading...</div>;
  }

  return (
    <section className={styles.course_scheduler}>
      <h2>
        {course.courseTitle} ({course.courseCode})
      </h2>
      <div ref={containerRef} className={styles.swapy_container}>
        <div data-swapy-slot="selected" className={styles.slot}>
          <div data-swapy-item="selected" className={styles.selected_item}>
            <h3>Selected Section</h3>
            <div>{selected.class}</div>
            <div>
              <strong>Room:</strong> {selected.room}
            </div>
            <div>
              <strong>Professor:</strong> {selected.professor}
            </div>
          </div>
        </div>

        {available.map((sec) => (
          <div
            key={sec.class}
            data-swapy-slot={sec.class}
            className={styles.slot}
          >
            <div data-swapy-item={sec.class} className={styles.available_item}>
              <h3>Available Section</h3>
              <div>{sec.class}</div>
              <div>
                <strong>Room:</strong> {sec.room}
              </div>
              <div>
                <strong>Professor:</strong> {sec.professor}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
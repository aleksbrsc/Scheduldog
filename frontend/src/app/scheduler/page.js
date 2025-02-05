"use client";
import { useRef, useEffect, useState } from "react";
import { createSwapy } from "swapy";
import styles from "../css/scheduler.module.css";

export default function Scheduler({ course }) {
  // Set the first section as the initially selected section
  const [selected, setSelected] = useState(course.sections[0]);
  // The rest of the sections are available for swapping
  const [available, setAvailable] = useState(course.sections.slice(1));

  const containerRef = useRef(null);
  const swapyRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current);

      swapyRef.current.onSwap((event) => {
        if (!event || !event.source || !event.target) {
          return;
        }
        const { source, target } = event;

        const sourceId = source.getAttribute("data-swapy-item");
        const targetId = target.getAttribute("data-swapy-item");

        // Only allow swap if one of the swapped items is the selected section.
        if (
          (sourceId === "selected" && targetId !== "selected") ||
          (targetId === "selected" && sourceId !== "selected")
        ) {
          // Identify the available section that is involved in the swap.
          const availableSectionId = sourceId === "selected" ? targetId : sourceId;
          const swappedSection = available.find(
            (sec) => sec.class === availableSectionId
          );
          if (swappedSection) {
            // Swap the selected and the available section.
            setAvailable((prev) =>
              prev.map((sec) =>
                sec.class === swappedSection.class ? selected : sec
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

  return (
    <div className={styles.course_scheduler}>
      <h2>
        {course.courseTitle} ({course.courseCode})
      </h2>
      {/* The Swapy container needs each slot directly as a child */}
      <div ref={containerRef} className={styles.swapy_container}>
        {/* Selected Section Slot */}
        <div data-swapy-slot="selected" className={styles.slot}>
          <div data-swapy-item="selected" className={styles.selectedItem}>
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

        {/* we create a separate slot for each available section */}
        {available.map((sec) => (
          <div
            key={sec.class}
            data-swapy-slot={sec.class}
            className={styles.slot}
          >
            <div data-swapy-item={sec.class} className={styles.availableItem}>
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
    </div>
  );
}

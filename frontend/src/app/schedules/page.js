'use client';

import { useState, useEffect, useRef } from 'react';
import coursesData from '../data/courses.json';
import styles from '../css/schedules.module.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Input, Tabs } from 'antd';
import Image from 'next/image';
import FlipMove from 'react-flip-move';
import gemini_icon from '.././assets/icons/gemini.png';
const { TabPane } = Tabs;

export default function EditingPage() {
  const [courses, setCourses] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [view, setView] = useState('timeGridWeek');
  const [validSchedules, setValidSchedules] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const calendarRef = useRef(null);

  const courseColors = {
    'DBAS17370': { bg: '#A5D6A7', border: '#81C784' },
    'SYST34104': { bg: '#90CAF9', border: '#64B5F6' },
    'INFO12345': { bg: '#FFE082', border: '#FFB74D' },
    'PROG24678': { bg: '#CE93D8', border: '#BA68C8' },
    'TELE35791': { bg: '#EF9A9A', border: '#E57373' }
  };

  useEffect(() => {
    setCourses(coursesData.courses);
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      generateValidSchedules();
    }
  }, [courses]);

  useEffect(() => {
    if (currentSchedule) {
      generateCalendarEvents();
    }
  }, [currentSchedule]);

  const generateValidSchedules = () => {
    const allPossibleSchedules = generateAllScheduleCombinations(courses);
    const validSchedules = allPossibleSchedules.filter(schedule => !hasTimeConflict(schedule));

    const generateScheduleIds = (numSchedules) => {
      const ids = [];
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < numSchedules; i++) {
        if (i < 26) {
          ids.push(alphabet[i]);
        } else {
          const prefix = Math.floor(i / 26);
          const suffix = alphabet[i % 26];
          ids.push(`${prefix}${suffix}`);
        }
      }
      return ids;
    };

    const scheduleIds = generateScheduleIds(validSchedules.length);

    validSchedules.forEach((schedule, index) => {
      schedule.scheduleId = scheduleIds[index];
    });

    setValidSchedules(validSchedules);

    if (validSchedules.length > 0) {
      setCurrentSchedule(validSchedules[0]);
    }


    console.log(validSchedules);
  };

  const generateAllScheduleCombinations = (courses) => {
    const schedules = [];

    const buildSchedules = (courseIndex, currentSchedule) => {
      if (courseIndex === courses.length) {
        schedules.push({
          scheduleId: schedules.length + 1,
          sections: [...currentSchedule]
        });
        return;
      }

      const course = courses[courseIndex];
      course.sections.forEach(section => {
        buildSchedules(courseIndex + 1, [...currentSchedule, section]);
      });
    };

    buildSchedules(0, []);
    return schedules;
  };

  const hasTimeConflict = (schedule) => {
    const timeSlots = [];

    // get all time slots in the schedule
    schedule.sections.forEach(section => {
      section.schedule.forEach(time => {
        const dayNum = getDayNumber(time.day);
        const startTime = convertTimeToMinutes(time.startTime);
        const endTime = convertTimeToMinutes(time.endTime);

        timeSlots.push({ day: dayNum, start: startTime, end: endTime });
      });
    });

    // check for overlaps
    for (let i = 0; i < timeSlots.length; i++) {
      for (let j = i + 1; j < timeSlots.length; j++) {
        const slot1 = timeSlots[i];
        const slot2 = timeSlots[j];

        if (slot1.day === slot2.day &&
          ((slot1.start <= slot2.start && slot2.start < slot1.end) ||
            (slot2.start <= slot1.start && slot1.start < slot2.end))) {
          return true;
        }
      }
    }

    return false;
  };

  const convertTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };


  const getDayNumber = (day) => {
    const dayMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    return dayMap[day];
  };

  const generateCalendarEvents = () => {
    if (!currentSchedule) return;
    const events = [];

    currentSchedule.sections.forEach((section) => {
      if (!section.schedule) return;

      const course = courses.find((c) =>
        c.sections.some(
          (s) => s.class === section.class && s.professor === section.professor
        )
      );

      if (!course) return;

      const termStart = new Date(section.termDates.startDate);
      const termEnd = new Date(section.termDates.endDate);

      section.schedule.forEach((time) => {
        const dayNum = getDayNumber(time.day);
        let currentDate = new Date(termStart);

        while (currentDate.getDay() !== dayNum) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        while (currentDate <= termEnd) {
          const startDate = new Date(currentDate);
          const endDate = new Date(currentDate);

          const startHour = parseInt(time.startTime.split(':')[0]);
          const startMin = parseInt(time.startTime.split(':')[1]);
          const endHour = parseInt(time.endTime.split(':')[0]);
          const endMin = parseInt(time.endTime.split(':')[1]);
          const colors = courseColors[course.courseCode] || { bg: '#4CAF50', border: '#2E7D32' };

          startDate.setHours(startHour, startMin);
          endDate.setHours(endHour, endMin);

          const formatTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const period = hours >= 12 ? ' PM' : ' AM';
            const formattedHours = hours % 12 || 12;
            return `${formattedHours}:${minutes.toString().padStart(2, '0')}${period}`;
          };

          events.push({
            id: `${course.courseCode}-${section.class}-${startDate.toISOString()}`,
            title: `${course.courseCode}`,
            start: startDate,
            end: endDate,
            extendedProps: {
              courseCode: course.courseCode,
              section: section.class,
              professor: section.professor,
              time: `${formatTime(time.startTime)}-${formatTime(time.endTime)}`,
              room: section.room,
            },
            backgroundColor: colors.bg,
            borderColor: colors.border,
            textColor: 'black',
          });

          currentDate.setDate(currentDate.getDate() + 7);
        }
      });
    });

    setCalendarEvents(events);
  };



  const handleScheduleClick = (schedule) => {
    setCurrentSchedule(schedule);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
    }
  };

  const handleAiOptimize = async (prompt) => {
    try {
      const newOrder = ["C", "A", "D", "B", "E"];

      const reordered = newOrder
        .map(id => validSchedules.find(s => s.scheduleId === id))
        .filter(Boolean);

      setValidSchedules(reordered);
      if (reordered.length > 0) setCurrentSchedule(reordered[0]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('AI optimization failed', err);
    }
  };

  return (
    <section id={styles.edit_section}>
      <div id={styles.edit_container}>
        <div id={styles.data}>
          <div id={styles.schedule_grid}>
            <h2>Schedule Options ({validSchedules.length})</h2>
            <FlipMove id={styles.schedule_cards}>
              {validSchedules.map((schedule) => (
                <div
                  key={schedule.scheduleId}
                  className={`${styles.schedule_card} ${currentSchedule?.scheduleId === schedule.scheduleId ? styles.selectedSchedule : ''}`}
                  onClick={() => handleScheduleClick(schedule)}
                >
                  <h3>{schedule.scheduleId}</h3>
                </div>
              ))}
              <button
                className={styles.star_button}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <Image src={gemini_icon} alt="AI optimize" />
              </button>
            </FlipMove>
            <Modal
              title="AI Optimize Your Schedule"
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              onOk={() => handleAiOptimize(aiPrompt)}
              okText="Optimize"
            >
              <Input
                placeholder="e.g. earliest times, no classes on Friday"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </Modal>
          </div>

          {currentSchedule && (
            <div id={styles.current_schedule_details}>
              <h2>Current Schedule: {currentSchedule.scheduleId}</h2>
              <div id={styles.sections_container}>
                {currentSchedule.sections.map((section, idx) => {
                  const courseInfo = courses.find(c =>
                    c.sections.some(s =>
                      s.class === section.class &&
                      s.professor === section.professor
                    )
                  );

                  const colors = courseInfo ? courseColors[courseInfo.courseCode] : { bg: '#4CAF50', border: '#2E7D32' };
                  const sectionStyle = {
                    borderLeft: `4px solid ${colors.bg}`,
                    paddingLeft: '1rem'
                  };

                  return (
                    <div key={idx} className={styles.section_card} style={sectionStyle}>
                      <h4>{courseInfo?.courseCode}: {section.class}</h4>
                      <p>Professor: {section.professor}</p>
                      <p>Room: {section.room}</p>
                      <p>Term: {section.termDates.startDate} to {section.termDates.endDate}</p>

                      <h5>Schedule</h5>
                      {section.schedule.map((time, i) => (
                        <p key={i}>
                          {time.day}: {time.startTime} - {time.endTime}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div id={styles.calendar}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: '',
              center: 'title',
              right: '',
            }}
            events={calendarEvents}
            eventContent={(arg) => {
              const { event } = arg;
              const { professor, time, room } = event.extendedProps;
              return (
                <div>
                  <div><strong>{event.title}</strong> {professor}</div>
                  <div style={{ marginTop: '5px' }}>{time}</div>
                  <div><em>{room}</em></div>
                </div>
              );
            }}
            height="auto"
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            initialDate="2025-03-09"
          />

          <div id={styles.calendar_controls_bottom}>
            <div id={styles.left_right_buttons}>
              <button onClick={() => calendarRef.current?.getApi().prev()}>←</button>
              <button onClick={() => calendarRef.current?.getApi().next()}>→</button>
            </div>
            <div id="calendar_controls">
              <Tabs defaultActiveKey="timeGridWeek" onChange={handleViewChange} items={[
                { label: 'Day', key: 'timeGridDay' },
                { label: 'Week', key: 'timeGridWeek' },
                { label: 'Month', key: 'dayGridMonth' },
              ]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
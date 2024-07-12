import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

import clsxm from '@/lib/clsxm';

type AgendaCalendarProps = {
  className?: string;
};

export default function AgendaCalendarSiswa({ className, ...rest }: AgendaCalendarProps) {
  const [schedules, setSchedules] = React.useState([]);
  const toast = useToast();

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/schedule/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setSchedules(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching schedules:', error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data jadwal',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, []);
  return (
    <div className={clsxm('', className)} {...rest}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height={800}
        droppable={true}
        dayMaxEventRows={true}
        dayMaxEvents={true}
        eventMaxStack={3}
        views={{
          dayGridMonth: {
            dayMaxEventRows: 2
          },
          timeGridWeek: {
            dayMaxEventRows: 2
          }
        }}
        timeZone="UTC"
        editable={true}
        eventStartEditable={true}
        eventDurationEditable={true}
        eventResizableFromStart={true}
        events={schedules?.map((schedule) => ({
          id: schedule.id,
          title: schedule.subject_name,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          daysOfWeek: [`${schedule.day}`],
          color: 'blue',
          allDay: false
        }))}
        headerToolbar={{
          left: 'prev,next today',
          center: '',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
      />
    </div>
  );
}

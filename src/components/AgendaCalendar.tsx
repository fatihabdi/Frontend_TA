import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  useToast
} from '@chakra-ui/react';
import { PiFlagBannerBold } from 'react-icons/pi';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import clsxm from '@/lib/clsxm';
import axios from 'axios';
import { useRouter } from 'next/router';

type AgendaCalendarProps = {
  className?: string;
};

export default function AgendaCalendar({ className, ...rest }: AgendaCalendarProps) {
  const { isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose } = useDisclosure();
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure();
  const toast = useToast();
  const [classes, setClasses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [teachers, setTeachers] = React.useState([]);
  const [schedules, setSchedules] = React.useState([]);
  const router = useRouter();
  const [selectedSchedule, setSelectedSchedule] = React.useState(null);
  const [formData, setFormData] = React.useState({
    class_id: '',
    subject_id: '',
    teacher_id: '',
    day_of_week: '',
    start_time: '',
    end_time: ''
  });

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/schedule/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== id));
          toast({
            title: 'Jadwal berhasil dihapus',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          onSecondModalClose();
        } else {
          console.error('Failed to delete schedule');
          toast({
            title: 'Error',
            description: 'Gagal menghapus jadwal',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting schedule:', error);
        toast({
          title: 'Error',
          description: 'Gagal menghapus jadwal',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/schedule/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setSchedules(response.data.data || []);
      })
      .catch((error) => {
        console.error('Error fetching schedules:', error);
        setSchedules([]);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data jadwal',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, []);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/teacher/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setTeachers(response.data.data || []);
      })
      .catch((error) => {
        console.error('Error fetching teacher:', error);
        setTeachers([]);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data guru',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, []);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setSubjects(response.data.data || []);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data Mapel',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, []);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/class/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setClasses(response.data.data || []);
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
        setClasses([]);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data kelas',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    let formattedValue = value;

    if (id === 'day_of_week') {
      formattedValue = parseInt(value);
    } else if (id === 'start_time' || id === 'end_time') {
      formattedValue = value + ':00'; // Append ":00" to make it HH:MM:SS
    }

    setFormData((prevData) => ({
      ...prevData,
      [id]: formattedValue
    }));
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/schedule/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.status === 201) {
          const newSchedule = response.data.data;
          setSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
          toast({
            title: 'Jadwal berhasil dibuat',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          onFirstModalClose();
          router.reload();
        }
      })
      .catch((error) => {
        console.error('Error creating schedule:', error);
        toast({
          title: 'Error',
          description: error.response.data.error,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  console.log(formData);

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
        eventClick={(clickInfo) => {
          const scheduleId = clickInfo.event.id;
          const selected = schedules.find((schedule) => schedule.id === scheduleId);
          setSelectedSchedule(selected);
          onSecondModalOpen();
        }}
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
        events={schedules.map((schedule) => ({
          id: schedule.id,
          title: schedule.subject,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          daysOfWeek: [`${schedule.day_of_week}`],
          color: 'blue',
          allDay: false
        }))}
        customButtons={{
          myCustomButton: {
            text: 'Tambah Kegiatan',
            click: function () {
              onFirstModalOpen();
            }
          }
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: '',
          right: 'dayGridMonth,timeGridWeek,timeGridDay myCustomButton'
        }}
      />
      <Modal isOpen={isFirstModalOpen} onClose={onFirstModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
              <PiFlagBannerBold className="rotate-0" />
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1 className="text-lg font-semibold">Tambah Jadwal Baru</h1>
            <p className="text-sm font-light text-Gray-600">Atur jadwal dan tambah jadwalmu disini</p>
            <form action="" className="mt-3">
              <label htmlFor="class" className="text-sm text-Gray-600">
                Kelas
              </label>
              <Select
                name="class"
                id="class_id"
                className="w-full  mt-2 mb-2 border-2 rounded-md border-Gray-300"
                onChange={(e) => handleInputChange(e)}
              >
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </Select>
              <label htmlFor="subject" className="text-sm text-Gray-600">
                Mata Pelajaran
              </label>
              <Select
                name="subject"
                id="subject_id"
                className="w-full  mt-2 mb-2 border-2 rounded-md border-Gray-300"
                onChange={(e) => handleInputChange(e)}
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
              <label htmlFor="teacher" className="text-sm text-Gray-600">
                Guru
              </label>
              <Select
                name="teacher"
                id="teacher_id"
                className="w-full  mt-2 mb-2 border-2 rounded-md border-Gray-300"
                onChange={(e) => handleInputChange(e)}
              >
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </Select>
              <label htmlFor="day_of_week" className="text-sm text-Gray-600">
                Hari
              </label>
              <Select
                name="day_of_week"
                id="day_of_week"
                className="w-full  mt-2 mb-2 border-2 rounded-md border-Gray-300"
                onChange={(e) => handleInputChange(e)}
              >
                <option value="1">Senin</option>
                <option value="2">Selasa</option>
                <option value="3">Rabu</option>
                <option value="4">Kamis</option>
                <option value="5">Jumat</option>
              </Select>
              <div className="flex justify-between gap-3 mt-2">
                <div className="flex flex-col w-full">
                  <label htmlFor="start" className="text-sm text-Gray-600">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    className="p-2 mt-2 border-2 rounded-md border-Gray-300"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="end" className="text-sm text-Gray-600">
                    Jam Berakhir
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    className="p-2 mt-2 border-2 rounded-md border-Gray-300"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-3">
            <SecondaryButton onClick={onFirstModalClose} btnClassName="font-semibold">
              Batal
            </SecondaryButton>
            <PrimaryButton onClick={(e) => handleCreateSchedule(e)} btnClassName="font-semibold">
              Konfirmasi
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSecondModalOpen} onClose={onSecondModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
              <PiFlagBannerBold className="rotate-0" />
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1 className="text-lg font-semibold">View Jadwal</h1>
            <p className="text-sm font-light text-Gray-600">Lihat jadwalmu disini</p>
            <form action="" className="mt-3">
              <label htmlFor="class" className="text-sm text-Gray-600">
                Kelas
              </label>
              <input
                type="text"
                id="class_id"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                value={selectedSchedule ? selectedSchedule.class : ''}
                readOnly
              />
              <label htmlFor="subject" className="text-sm text-Gray-600">
                Mata Pelajaran
              </label>
              <input
                type="text"
                id="subject_id"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                value={selectedSchedule ? selectedSchedule.subject : ''}
                readOnly
              />
              <label htmlFor="teacher" className="text-sm text-Gray-600">
                Guru
              </label>
              <input
                type="text"
                id="teacher_id"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                value={selectedSchedule ? selectedSchedule.teacher : ''}
                readOnly
              />
              <label htmlFor="day_of_week" className="text-sm text-Gray-600">
                Hari
              </label>
              <input
                type="text"
                id="day_of_week"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                value={selectedSchedule ? selectedSchedule.day_of_week : ''}
                readOnly
              />
              <div className="flex justify-between gap-3 mt-2">
                <div className="flex flex-col w-full">
                  <label htmlFor="start" className="text-sm text-Gray-600">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    className="p-2 mt-2 border-2 rounded-md border-Gray-300"
                    value={selectedSchedule ? selectedSchedule.start_time : ''}
                    readOnly
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="end" className="text-sm text-Gray-600">
                    Jam Berakhir
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    className="p-2 mt-2 border-2 rounded-md border-Gray-300"
                    value={selectedSchedule ? selectedSchedule.end_time : ''}
                    readOnly
                  />
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-3">
            <SecondaryButton onClick={onSecondModalClose} btnClassName="font-semibold">
              Batal
            </SecondaryButton>
            <PrimaryButton onClick={() => handleDelete(selectedSchedule ? selectedSchedule.id : '')} btnClassName="font-semibold">
              Delete
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

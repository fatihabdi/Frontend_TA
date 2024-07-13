import * as React from 'react';
import { useRouter } from 'next/router';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { DayPicker, DayMouseEventHandler } from 'react-day-picker';
import Holidays from 'date-holidays';
import { isSameDay } from 'date-fns';
import PrimaryButton from '@/components/PrimaryButton';
import { Select, useDisclosure, useToast, Button } from '@chakra-ui/react';
import { FiSearch, FiCalendar, FiBook } from 'react-icons/fi';
import { format } from 'date-fns';
import axios from 'axios';

export default function PreviewTugas() {
  const initiallySelectedDate = new Date();
  const [disabledDays, setDisabledDays] = React.useState([]);
  const [selectedDates, setSelectedDates] = React.useState([initiallySelectedDate]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const calendarContainerRef = React.useRef<HTMLDivElement>(null);
  const toast = useToast();
  const [tasks, setTasks] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [submissionStatuses, setSubmissionStatuses] = React.useState({});
  const tasksPerPage = 5;
  const router = useRouter();

  React.useEffect(() => {
    const hd = new Holidays('ID');
    const currentYear = new Date().getFullYear();
    const holidays = hd.getHolidays(currentYear);
    const holidayDates = holidays.map((holiday) => new Date(holiday.date));
    setDisabledDays(holidayDates);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/student/task`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setTasks(response.data.data);
          response.data.data.forEach((task) => {
            checkSubmissionStatus(task.id);
          });
        } else {
          setTasks([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setTasks([]);
        toast({
          title: 'Error',
          description: 'Failed to fetch tasks',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/student/class/subjects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          const uniqueSubjects = Array.from(new Set(response.data.data.map((subject) => subject.subject_name)));
          setSubjects(uniqueSubjects);
        } else {
          setSubjects([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      });
  }, []);

  const checkSubmissionStatus = (taskId) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/student/task/${taskId}/assignment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        const assignment = response.data.data;
        const isSubmitted = assignment && assignment.id !== '';
        setSubmissionStatuses((prevStatuses) => ({
          ...prevStatuses,
          [taskId]: isSubmitted ? 'Sudah Mengumpulkan' : 'Belum Mengumpulkan'
        }));
      })
      .catch((error) => {
        console.error(`Error fetching submission status for task ${taskId}:`, error);
      });
  };

  const handleDayClick: DayMouseEventHandler = (day) => {
    if (selectedDates.some((selectedDate) => isSameDay(selectedDate, day))) {
      setSelectedDates(selectedDates.filter((selectedDate) => !isSameDay(selectedDate, day)));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
  };

  const handleTaskSubmit = (id: string, title: string) => {
    router.push({
      pathname: `/siswa/tugas/${id}`,
      query: { id, title }
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearchTerm = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === '' || task.subject === selectedSubject;
    return matchesSearchTerm && matchesSubject;
  });

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const currentTasks = filteredTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-4 rounded-md shadow-lg h-fit bg-Base-white" ref={calendarContainerRef}>
          <div className="flex items-center justify-between gap-4 lg:border-b lg:border-Gray-200 lg:px-5 lg:pb-5">
            <div className="w-full">
              <h1 className="text-lg font-semibold">Daftar Tugas</h1>
            </div>
            <Select value={selectedSubject} onChange={handleSubjectChange} placeholder="Mata Pelajaran" size="md" className="w-fit">
              <option value="">Semua Mata Pelajaran</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
                placeholder="Search"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            {currentTasks.map((task) => (
              <div key={task.id} className="p-4 border rounded-md shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-semibold text-[#6941C6]">Tugas</h2>
                    <h3 className="mt-2 text-lg font-bold">{task.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {submissionStatuses[task.id] === 'Sudah Mengumpulkan' ? (
                      <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={() => handleTaskSubmit(task.id, task.title)}>
                        Edit Tugas
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={() => handleTaskSubmit(task.id, task.title)}>
                        Submit Tugas
                      </PrimaryButton>
                    )}
                  </div>
                </div>
                <div className="justify-between lg:flex">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-3 mt-2 text-gray-500">
                      <FiCalendar />
                      <span>Start: {format(new Date(task.created_at), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-gray-500">
                      <FiBook />
                      <span>{task.type_of_task}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1 font-semibold text-Gray-600">
                    <h1>
                      <span className="text-Gray-900">Deadline :</span> {format(new Date(task.deadline), 'MMMM d, yyyy')}
                    </h1>
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && <div className="text-center py-5 text-Gray-600">Tidak ada tugas ditemukan</div>}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between mt-4">
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          )}
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

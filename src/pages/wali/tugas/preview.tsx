import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutWali/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { DayPicker, DayMouseEventHandler } from 'react-day-picker';
import Holidays from 'date-holidays';
import { isSameDay } from 'date-fns';
import { Select, Button, Tag, TagLabel, Skeleton } from '@chakra-ui/react';
import { FiSearch, FiCalendar, FiBook } from 'react-icons/fi';
import { format } from 'date-fns';
import { PiListBulletsBold } from 'react-icons/pi';
import axios from 'axios';

export default function PreviewTugas() {
  const initiallySelectedDate = new Date();
  const [disabledDays, setDisabledDays] = React.useState([]);
  const [selectedDates, setSelectedDates] = React.useState([initiallySelectedDate]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const tasksPerPage = 5;
  const calendarContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const hd = new Holidays('ID');
    const currentYear = new Date().getFullYear();
    const holidays = hd.getHolidays(currentYear);
    const holidayDates = holidays.map((holiday) => new Date(holiday.date));
    setDisabledDays(holidayDates);
  }, []);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parent/task`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setTasks(response.data.data);
        } else {
          setError('No data available');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

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

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredTasks.length / tasksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentTasks = filteredTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-4 rounded-md shadow-lg h-fit bg-Base-white" ref={calendarContainerRef}>
          <div className="flex items-center justify-between gap-4 lg:border-b lg:border-Gray-200 lg:px-5 lg:pb-5">
            <div className="w-full">
              <h1 className="text-lg font-semibold">Daftar Tugas</h1>
            </div>
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
            {loading ? (
              <>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </>
            ) : error ? (
              <div className="text-center py-5 text-Gray-600">{error}</div>
            ) : currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-md shadow-sm">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="font-semibold text-[#6941C6]">Tugas</h2>
                      <h3 className="mt-2 text-lg font-bold">{task.title}</h3>
                    </div>
                    <div className="flex items-center">
                      <Tag colorScheme="purple" borderRadius="full" size="sm" className="h-fit">
                        <TagLabel>{task.type_of_task}</TagLabel>
                      </Tag>
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
                        <span>{task.subject}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-1 font-semibold text-Gray-600">
                      <h1>
                        <span className="text-Gray-900">Deadline :</span> {format(new Date(task.deadline), 'MMMM d, yyyy')}
                      </h1>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 text-Gray-600">Tidak ada tugas yang tersedia.</div>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button onClick={handleNextPage} disabled={currentPage >= Math.ceil(filteredTasks.length / tasksPerPage)}>
              Next
            </Button>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutAdmin/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { DayPicker } from 'react-day-picker';
import Holidays from 'date-holidays';
import ScheduleCard from '@/components/ScheduleCard';
import { Table, Thead, Tbody, Tr, Th, Skeleton } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import axios from 'axios';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

interface ScheduleItem {
  id: number;
  subject: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  status: 'inactive' | 'ongoing' | 'done';
}

interface Announcement {
  id: number;
  title: string;
  information: string;
  created_at: string;
}

interface Subject {
  id: number;
  name: string;
  semester: number;
  created_at: string;
}

export default function Home() {
  const initiallySelectedDate = new Date();
  const router = useRouter();
  const [announcement, setAnnouncement] = React.useState<Announcement[]>([]);
  const [disabledDays, setDisabledDays] = React.useState<Date[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [selectedDate, setSelectedDate] = React.useState(initiallySelectedDate);
  const [schedule, setSchedule] = React.useState<ScheduleItem[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = React.useState(true);
  const [loadingSubjects, setLoadingSubjects] = React.useState(true);
  const [loadingSchedule, setLoadingSchedule] = React.useState(true);

  const dayOfWeekMap: { [key: number]: string } = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'
  };

  React.useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get<{ data: ScheduleItem[] }>(`${process.env.NEXT_PUBLIC_API_URL}/admin/schedule/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

        const scheduleWithStatus =
          response.data.data?.map((item) => {
            const itemDay = dayOfWeekMap[item.day_of_week];
            let status: 'inactive' | 'ongoing' | 'done' = 'inactive';
            if (itemDay === currentDay && dayjs(now).isSame(selectedDate, 'day')) {
              if (currentTime > item.end_time) {
                status = 'done';
              } else if (currentTime >= item.start_time && currentTime <= item.end_time) {
                status = 'ongoing';
              }
            }
            return {
              ...item,
              day_of_week: itemDay,
              status
            };
          }) || [];

        setSchedule(scheduleWithStatus);
        setLoadingSchedule(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setLoadingSchedule(false);
      }
    };

    const updateScheduleStatus = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

      setSchedule((prevSchedule) =>
        prevSchedule.map((item) => {
          if (item.day_of_week === currentDay && dayjs(now).isSame(selectedDate, 'day')) {
            if (currentTime > item.end_time) {
              return { ...item, status: 'done' };
            } else if (currentTime >= item.start_time && currentTime <= item.end_time) {
              return { ...item, status: 'ongoing' };
            } else {
              return { ...item, status: 'inactive' };
            }
          }
          return item;
        })
      );
    };

    fetchSchedule();
    const interval = setInterval(updateScheduleStatus, 60000);
    updateScheduleStatus();

    return () => clearInterval(interval);
  }, [selectedDate]);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        const sortedSubjects =
          response.data.data
            ?.sort((a: Subject, b: Subject) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3) || [];
        setSubjects(sortedSubjects);
        setLoadingSubjects(false);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        setLoadingSubjects(false);
      });
  }, []);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/announcement`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        const sortedAnnouncements =
          response.data.data
            ?.sort((a: Announcement, b: Announcement) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3) || [];
        setAnnouncement(sortedAnnouncements);
        setLoadingAnnouncements(false);
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
        setLoadingAnnouncements(false);
      });
  }, []);

  React.useEffect(() => {
    const hd = new Holidays('ID');
    const currentYear = new Date().getFullYear();
    const holidays = hd.getHolidays(currentYear);
    const holidayDates = holidays.map((holiday) => new Date(holiday.date));
    setDisabledDays(holidayDates);
  }, []);

  const getDayOfWeek = (date: Date) => {
    const day = date.getDay();
    return day === 0 ? 7 : day;
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="flex flex-col items-center justify-around pt-4 lg:pt-0 lg:items-start lg:flex-row">
          <div className="flex flex-col w-full max-w-sm gap-5 md:max-w-lg lg:max-w-xl 2xl:max-w-2xl 5xl:max-w-6xl">
            <div className="flex flex-col gap-3">
              <span className="flex justify-between">
                <h1 className="text-lg font-semibold">Informasi dan Pengaduan</h1>
                <button className="font-semibold text-Primary-500" onClick={() => router.push('/admin/pengaduan/list')}>
                  Lihat Semua
                </button>
              </span>
              <div className="flex flex-col justify-between border border-Gray-200 gap-4 p-5 rounded-xl bg-Base-white">
                {loadingAnnouncements ? (
                  <>
                    <Skeleton height="40px" my="10px" />
                    <Skeleton height="40px" my="10px" />
                    <Skeleton height="40px" my="10px" />
                  </>
                ) : announcement.length > 0 ? (
                  announcement.map((item, index) => (
                    <div className="flex justify-between w-full items-center border-b border-Gray-200" key={index}>
                      <div className="p-6">
                        <h1 className="text-sm font-medium text-gray-900">{item.title}</h1>
                        <p className="text-sm text-gray-500">
                          {item.information.length > 100 ? item.information.substring(0, 100) + '...' : item.information}
                        </p>
                      </div>
                      <SecondaryButton onClick={() => router.push('/admin/pengaduan/list')} btnClassName="w-fit h-fit text-sm py-2">
                        Detail
                      </SecondaryButton>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-Gray-600">Tidak ada informasi atau pengaduan</div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="flex justify-between">
                <h1 className="text-lg font-semibold">List Mata Pelajaran Terbaru</h1>
                <button className="font-semibold text-Primary-500" onClick={() => router.push(`/admin/mata-pelajaran/list`)}>
                  Lihat Semua
                </button>
              </span>
              <div className="flex flex-col justify-between border border-Gray-200 gap-4 rounded-xl bg-Base-white">
                {loadingSubjects ? (
                  <>
                    <Skeleton height="40px" my="10px" />
                    <Skeleton height="40px" my="10px" />
                    <Skeleton height="40px" my="10px" />
                  </>
                ) : subjects.length > 0 ? (
                  <Table className="">
                    <Thead className="bg-Gray-50">
                      <Tr>
                        <Th>No</Th>
                        <Th>Nama Mata Pelajaran</Th>
                        <Th>Semester</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {subjects.map((item, index) => (
                        <Tr key={index}>
                          <Th>{index + 1}</Th>
                          <Th>{item.name}</Th>
                          <Th>{item.semester}</Th>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5 text-Gray-600">Tidak ada mata pelajaran terbaru</div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start px-3 py-6 mt-6 rounded-xl bg-Base-white lg:mt-0">
            <DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} showOutsideDays disabled={disabledDays} />
            <h1 className="pt-5 pl-6 font-semibold">{selectedDate.toDateString()}</h1>
            {loadingSchedule ? (
              <>
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
              </>
            ) : schedule.length > 0 ? (
              schedule.map((item, index) => (
                <ScheduleCard
                  key={index}
                  title={item.subject}
                  status={item.status}
                  startTime={item.start_time}
                  endTime={item.end_time}
                  day={item.day_of_week === selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                  className="mt-5"
                />
              ))
            ) : (
              <div className="text-center py-5 text-Gray-600">Tidak ada jadwal untuk hari ini</div>
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

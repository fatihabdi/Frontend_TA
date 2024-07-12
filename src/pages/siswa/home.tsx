import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { DayPicker } from 'react-day-picker';
import Holidays from 'date-holidays';
import ScheduleCard from '@/components/ScheduleCard';
import SecondaryButton from '@/components/SecondaryButton';
import { Table, Thead, Tbody, Tr, Th, Td, Skeleton, TableContainer } from '@chakra-ui/react';

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
  created_at: string; // Assuming the announcement has a created_at property
}

interface Grade {
  id: number;
  rataRata: string;
  nilaiTertinggi: string;
  nilaiTerendah: string;
  median: string;
  created_at: string; // Assuming the grade has a created_at property
}

export default function Home() {
  const initiallySelectedDate = new Date();
  const router = useRouter();
  const [announcement, setAnnouncement] = React.useState<Announcement[]>([]);
  const [disabledDays, setDisabledDays] = React.useState<Date[]>([]);
  const [grades, setGrades] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(initiallySelectedDate);
  const [schedule, setSchedule] = React.useState<ScheduleItem[]>([]);
  const [semester, setSemester] = React.useState('1');
  const [academicYear, setAcademicYear] = React.useState('2023-2024');
  const [loadingSchedule, setLoadingSchedule] = React.useState(true);
  const [attendance, setAttendance] = React.useState([]);
  const [groupedAttendance, setGroupedAttendance] = React.useState([]);
  const [username, setUsername] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchGrades(semester, academicYear);
  }, [semester, academicYear]);

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
    if (semester && academicYear) {
      fetchGrades();
    }
  }, [semester, academicYear]);

  const fetchGrades = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/grades`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          semester,
          academicYear
        }
      });
      const data = response.data.data || [];
      setGrades(data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get<{ data: ScheduleItem[] }>(`${process.env.NEXT_PUBLIC_API_URL}/student/schedule`, {
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
    fetchGrades(semester, academicYear);
  }, [semester, academicYear]);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/global/announcements`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        const sortedAnnouncements = response.data.data
          .sort((a: Announcement, b: Announcement) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
        setAnnouncement(sortedAnnouncements);
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
    return day === 0 ? 7 : day; // Convert Sunday (0) to 7
  };

  const selectedDayOfWeek = getDayOfWeek(selectedDate);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username') || '');
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/student/attedance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          const data = response.data.data || [];
          console.log('Fetched Attendance Data:', data); // Add logging
          setAttendance(data);
          const groupedData = groupAttendanceBySubject(data);
          console.log('Grouped Attendance Data:', groupedData); // Add logging
          setGroupedAttendance(groupedData);
        });
    }
  }, []);

  const groupAttendanceBySubject = (data) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.subject_name]) {
        acc[item.subject_name] = {
          subject_name: item.subject_name,
          total_attendance: 0,
          total_meetings: 0
        };
      }
      acc[item.subject_name].total_meetings += 1;
      if (item.attedance_status === 'Hadir') {
        acc[item.subject_name].total_attendance += 1;
      }
      return acc;
    }, {});

    return Object.values(grouped).map((item) => ({
      ...item,
      attendance_percentage: ((item.total_attendance / item.total_meetings) * 100).toFixed(2) + '%'
    }));
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
                {announcement.map((item, index) => (
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
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="flex justify-between">
                <h1 className="text-lg font-semibold">Rangkuman Nilai</h1>
                <button className="font-semibold text-Primary-500" onClick={() => router.push(`/siswa/nilai/list`)}>
                  Lihat Semua
                </button>
              </span>
              <div className="flex flex-col justify-between border border-Gray-200 gap-4 rounded-xl bg-Base-white">
                <TableContainer className="">
                  <Table className="">
                    <Thead className="bg-Gray-50">
                      <Tr>
                        <Th>No</Th>
                        <Th>Mata Pelajaran</Th>
                        <Th>Rata-Rata Formatif</Th>
                        <Th>Rata-Rata Sumatif</Th>
                        <Th>Rata-Rata Proyek</Th>
                        <Th>Nilai Akhir</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {loading ? (
                        <Tr>
                          <Td colSpan="7" className="text-center">
                            Loading...
                          </Td>
                        </Tr>
                      ) : (
                        grades.map((item, index) => (
                          <Tr key={item.id}>
                            <Td>{index + 1}</Td>
                            <Td>{item.subject}</Td>
                            <Td>{item.formative_scores}</Td>
                            <Td>{item.summative_scores}</Td>
                            <Td>{item.project_scores}</Td>
                            <Td>{item.final_grade}</Td>
                            <Td>
                              <SecondaryButton btnClassName="font-semibold" onClick={() => router.push(`/siswa/nilai/list`)}>
                                Detail
                              </SecondaryButton>
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="flex justify-between">
                <h1 className="text-lg font-semibold">Rangkuman Kehadiran</h1>
                <button className="font-semibold text-Primary-500" onClick={() => router.push(`/siswa/kehadiran/ListKehadiran`)}>
                  Lihat Semua
                </button>
              </span>
              <div className="flex flex-col justify-between border border-Gray-200 gap-4 rounded-xl bg-Base-white">
                <TableContainer className="">
                  <Table variant="simple" className="">
                    <Thead>
                      <Tr>
                        <Th>No</Th>
                        <Th>Mata Pelajaran</Th>
                        <Th>Presentase Kehadiran</Th>
                        <Th>Jumlah Kehadiran</Th>
                        <Th>Jumlah Pertemuan</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {groupedAttendance.length === 0 ? (
                        <Tr>
                          <Td colSpan={6} className="text-center">
                            No data available
                          </Td>
                        </Tr>
                      ) : (
                        groupedAttendance.map((item, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{item.subject_name}</Td>
                            <Td>{item.attendance_percentage}</Td>
                            <Td>{item.total_attendance}</Td>
                            <Td>{item.total_meetings}</Td>
                            <Td>
                              <SecondaryButton
                                colorScheme="gray"
                                variant="outline"
                                size="md"
                                onClick={() => router.push(`/siswa/kehadiran/ListKehadiran`)}
                              >
                                Details
                              </SecondaryButton>
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
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

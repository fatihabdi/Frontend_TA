import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import { useRouter } from 'next/router';
import Seo from '@/components/Seo';
import { FiEdit } from 'react-icons/fi';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tag, TagLabel, Input, Select, Button, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import PrimaryButton from '@/components/PrimaryButton';
import { BiInfoSquare } from 'react-icons/bi';

export default function ChecklistKehadiran() {
  const router = useRouter();
  const [students, setStudents] = React.useState([]);
  const [attendance, setAttendance] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [classes, setClasses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const isHomeroomTeacher = typeof window !== 'undefined' && localStorage.getItem('is_homeroom_teacher') === 'true';

  React.useEffect(() => {
    const fetchClassesAndSubjects = async () => {
      const token = localStorage.getItem('token');
      try {
        const [classesResponse, subjectsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const uniqueClasses = classesResponse.data.data.filter(
          (cls, index, self) => self.findIndex((c) => c.class_name === cls.class_name) === index
        );

        setClasses(uniqueClasses || []);
        const allSubjects = subjectsResponse.data.data.flatMap((subjectGroup) => subjectGroup.subject);
        setSubjects(allSubjects || []);
      } catch (error) {
        console.error('Error fetching classes and subjects:', error);
      }
    };

    fetchClassesAndSubjects();
  }, []);

  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
    if (selectedClass && selectedSubject) {
      fetchStudentsAndAttendance(selectedClass, selectedSubject);
    }
  };

  const handleSubjectChange = async (e) => {
    const selectedSubject = e.target.value;
    setSelectedSubject(selectedSubject);
    if (selectedClass && selectedSubject) {
      fetchStudentsAndAttendance(selectedClass, selectedSubject);
    }
  };

  const fetchStudentsAndAttendance = async (classId, subjectId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const [studentsResponse, attendanceResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class/${classId}/students`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/${subjectId}/attendance`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStudents(studentsResponse.data.data || []);
      setAttendance(attendanceResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStudents([]);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const filteredAttendance = selectedDate
    ? attendance.filter((att) => new Date(att.attendace_at).toDateString() === new Date(selectedDate).toDateString())
    : attendance;

  return (
    <div className="overflow-x-auto">
      <AuthenticatedLayout>
        <Seo templateTitle="Kehadiran" />
        {isHomeroomTeacher && (
          <div className="w-full shadow rounded-md h-fit bg-Base-white flex justify-between p-3">
            <h1 className="flex items-center gap-2 text-lg font-semibold">Detail Wali Kelas</h1>
            <PrimaryButton
              leftIcon={<BiInfoSquare className="text-lg text-Base-white" />}
              size="mini"
              btnClassName="w-fit h-fit"
              onClick={() => router.push('/guru/kehadiran/detailKehadiran')}
            >
              Detail Wali Kelas
            </PrimaryButton>
          </div>
        )}
        <div className="w-full rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex items-center justify-between p-4">
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              Daftar siswa{' '}
              <Tag colorScheme="blue" borderRadius="full" size="sm">
                <TagLabel>{students.length} User</TagLabel>
              </Tag>
            </h1>
            <div className="flex items-center gap-2">
              <Input size="md" type="date" onChange={(e) => setSelectedDate(e.target.value)} />
              <Select placeholder="Kelas" size="md" onChange={handleClassChange}>
                {classes.map((cls, index) => (
                  <option key={index} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
              <Select placeholder="Mata Pelajaran" size="md" onChange={handleSubjectChange}>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="gray"
                variant="outline"
                size="md"
                leftIcon={<FiEdit />}
                paddingLeft={8}
                paddingRight={8}
                onClick={() => router.push('/guru/kehadiran/editKehadiran')}
              >
                Edit
              </Button>
              <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={() => router.push('/guru/kehadiran/detailKehadiranGuru')}>
                Overview Absensi
              </PrimaryButton>
            </div>
          </div>
          <div className="pb-5">
            {loading ? (
              <div className="flex justify-center items-center">
                <Spinner size="xl" />
              </div>
            ) : (
              <TableContainer className="">
                <Table variant="simple" className="">
                  <Thead className="bg-Gray-50">
                    <Tr>
                      <Th>Name</Th>
                      <Th>Nomor Induk</Th>
                      <Th>Email</Th>
                      <Th>Status</Th>
                      <Th>Tanggal Hadir</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {students.map((student, index) => {
                      const studentAttendance = filteredAttendance.find((att) => att.student_id === student.id) || {};
                      return (
                        <Tr key={index}>
                          <Td>{student.name}</Td>
                          <Td>{student.nisn}</Td>
                          <Td>{student.email}</Td>
                          <Td>
                            {studentAttendance.attendace_status === 'Hadir' ? (
                              <Tag colorScheme="green" borderRadius="full" size="sm">
                                <TagLabel>Hadir</TagLabel>
                              </Tag>
                            ) : studentAttendance.attendace_status === 'Sakit' || studentAttendance.attendace_status === 'Izin' ? (
                              <Tag colorScheme="blue" borderRadius="full" size="sm">
                                <TagLabel>{studentAttendance.attendace_status}</TagLabel>
                              </Tag>
                            ) : (
                              <Tag colorScheme="red" borderRadius="full" size="sm">
                                <TagLabel>Alpha</TagLabel>
                              </Tag>
                            )}
                          </Td>
                          <Td>{studentAttendance.attendace_at ? formatDate(studentAttendance.attendace_at) : '-'}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Input, Select, Spinner, useToast, Tag, TagLabel } from '@chakra-ui/react';
import Image from 'next/image';

interface Student {
  id: string;
  name: string;
  nisn: string;
}

interface Attendance {
  student_id: string;
  status: string;
}

export default function ChecklistKehadiran() {
  const [classData, setClassData] = React.useState({ id: '', name: '' });
  const [students, setStudents] = React.useState<Student[]>([]);
  const [attendance, setAttendance] = React.useState<Attendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = React.useState([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [subjects, setSubjects] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  const router = useRouter();

  React.useEffect(() => {
    const fetchClassData = async () => {
      const token = localStorage.getItem('token');
      try {
        const classResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class/homeroom`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const classInfo = classResponse.data.data;
        setClassData({ id: classInfo.id, name: classInfo.name });

        await fetchStudents(classInfo.id);
        await fetchSubjects(classInfo.id);
      } catch (error) {
        console.error('Error fetching class data:', error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data kelas',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    };

    fetchClassData();
  }, []);

  const fetchStudents = async (classId: string) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class/${classId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil data siswa',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (classId: string) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allSubjects = response.data.data.flatMap((subjectGroup) => subjectGroup.subject);
      setSubjects(allSubjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil data mata pelajaran',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (subjectId: string) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/${subjectId}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data.data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil data kehadiran',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    fetchAttendance(subjectId);
  };

  const calculateAttendance = () => {
    const attendanceSummary = students.map((student) => {
      const studentAttendance = attendance.filter((att) => att.student_id === student.id);
      const totalMeetings = studentAttendance.length;
      const totalPresent = studentAttendance.filter((att) => att.status === 'Hadir').length;
      const totalAbsent = totalMeetings - totalPresent;

      return {
        ...student,
        totalMeetings,
        totalPresent,
        totalAbsent
      };
    });
    setFilteredAttendance(attendanceSummary);
  };

  React.useEffect(() => {
    if (attendance.length > 0) {
      calculateAttendance();
    }
  }, [attendance]);

  return (
    <div className="overflow-x-auto">
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex items-center justify-between p-4">
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              Detail Kehadiran Siswa{' '}
              <Tag colorScheme="blue" borderRadius="full" size="sm">
                <TagLabel>{students.length} User</TagLabel>
              </Tag>
            </h1>
            <div className="flex items-center gap-2">
              <Input type="text" className="w-fit p-2 border rounded-lg border-Gray-200 h-fit" value={classData.name} readOnly />
              <Select placeholder="Mata Pelajaran" size="md" onChange={handleSubjectChange}>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="pb-4">
            {loading ? (
              <Spinner size="xl" />
            ) : (
              <TableContainer className="">
                <Table variant="simple" className="">
                  <Thead>
                    <Tr>
                      <Th>Nama</Th>
                      <Th>Nomor Induk</Th>
                      <Th>Jumlah Pertemuan</Th>
                      <Th>Jumlah Siswa Hadir</Th>
                      <Th>Jumlah Siswa Tidak Hadir</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredAttendance.map((item, index) => (
                      <Tr key={index}>
                        <Td>
                          <div className="flex items-center gap-3">
                            <Image
                              src={`https://ui-avatars.com/api/?name=${item.name}`}
                              alt="Logo"
                              width={40}
                              height={24}
                              className="rounded-full"
                            />
                            {item.name}
                          </div>
                        </Td>
                        <Td>{item.nisn}</Td>
                        <Td>{item.totalMeetings}</Td>
                        <Td>{item.totalPresent}</Td>
                        <Td>{item.totalAbsent}</Td>
                      </Tr>
                    ))}
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

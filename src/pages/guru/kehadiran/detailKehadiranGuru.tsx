import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Select, Spinner, useToast, Tag, TagLabel } from '@chakra-ui/react';
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
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState({ id: '', name: '' });
  const [students, setStudents] = React.useState<Student[]>([]);
  const [attendance, setAttendance] = React.useState<Attendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = React.useState([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [subjects, setSubjects] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

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

        const classesData = classesResponse.data.data || [];
        setClasses(classesData);

        const allSubjects = subjectsResponse.data.data.flatMap((subjectGroup) => subjectGroup.subject);
        const uniqueSubjects = allSubjects.filter(
          (subject, index, self) => index === self.findIndex((s) => s.subject_name === subject.subject_name)
        );
        setSubjects(uniqueSubjects || []);
      } catch (error) {
        console.error('Error fetching classes and subjects:', error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data kelas dan mata pelajaran',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
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
                <TagLabel>{students.length} Siswa</TagLabel>
              </Tag>
            </h1>
            <div className="flex items-center gap-2">
              <Select placeholder="Pilih Kelas" size="md" onChange={handleClassChange}>
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

import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { FiSave } from 'react-icons/fi';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tag,
  TagLabel,
  Input,
  Select,
  Radio,
  RadioGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner
} from '@chakra-ui/react';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function EditKehadiran() {
  const router = useRouter();
  const status = ['Hadir', 'Sakit', 'Izin', 'Alpha'];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [students, setStudents] = React.useState([]);
  const [attendance, setAttendance] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [classes, setClasses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [user, setUser] = React.useState([]);

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

        setClasses(classesResponse.data.data || []);
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

      // Merge student and attendance data
      const mergedData = studentsResponse.data.data.map((student) => {
        const studentAttendance = attendanceResponse.data.data.find((att) => att.student_id === student.id) || {};
        return {
          ...student,
          status: studentAttendance.attendace_status || 'Hadir',
          keterangan: studentAttendance.keterangan || '-',
          attendance_id: studentAttendance.id || null
        };
      });

      setUser(mergedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStudents([]);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const setKeteranganHandler = (index, value) => {
    setUser((prevData) => {
      const newData = [...prevData];
      newData[index].keterangan = value;
      return newData;
    });
  };

  const setStatusHandler = (index, value) => {
    setUser((prevData) => {
      const newData = [...prevData];
      newData[index].status = value;
      return newData;
    });
  };

  const handleBlur = (index) => {
    setUser((prevData) => {
      const newData = [...prevData];
      if (!newData[index].keterangan) {
        newData[index].keterangan = '-';
      }
      return newData;
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    for (const student of user) {
      try {
        const existingAttendance = attendance.find(
          (att) => att.student_id === student.id && new Date(att.attendace_at).toDateString() === new Date(selectedDate).toDateString()
        );

        if (existingAttendance) {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/attendance/${existingAttendance.id}/update`,
            {
              attedance_status: student.status
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/${selectedSubject}/attendance`,
            {
              student_id: student.id,
              attendace_status: student.status,
              attendace_at: selectedDate
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        }
      } catch (error) {
        console.error(`Error updating attendance for student ${student.name}:`, error);
      }
    }
    onClose();
    router.push('/guru/kehadiran/checklistKehadiran');
  };

  const countUser = user.length;

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Edit Kehadiran" />
        <div className="w-full h-full rounded-md shadow-lg bg-Base-white">
          <div className="flex items-center justify-between p-4">
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              Daftar siswa{' '}
              <Tag colorScheme="blue" borderRadius="full" size="sm">
                <TagLabel>{countUser} User</TagLabel>
              </Tag>
            </h1>
            <div className="flex items-center gap-2">
              <Input size="md" type="date" onChange={(e) => setSelectedDate(e.target.value)} className="w-full" />
              <Select placeholder="Kelas" size="md" onChange={handleClassChange}>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
              <Select placeholder="Mapel" size="md" onChange={handleSubjectChange}>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
              <PrimaryButton btnClassName="h-[36px] w-[84px] rounded-md" onClick={onOpen}>
                Save
              </PrimaryButton>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Spinner size="xl" />
            </div>
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Nomor Induk</Th>
                    <Th>Email</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {user.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.name}</Td>
                      <Td>{item.nisn}</Td>
                      <Td>{item.email}</Td>
                      <Td>
                        <RadioGroup value={item.status} onChange={(value) => setStatusHandler(index, value)} className="flex gap-4">
                          {status.map((statusItem, statusIndex) => (
                            <div
                              key={statusIndex}
                              className="relative flex items-center p-2 border border-gray-200 rounded-full cursor-pointer bg-Gray-50 group"
                            >
                              <Radio value={statusItem} className="form-radio">
                                <span className="ml-2">{statusItem}</span>
                              </Radio>
                            </div>
                          ))}
                        </RadioGroup>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </div>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay backdropBlur="10px" />
          <ModalContent>
            <ModalHeader className="mt-3">
              <div className="p-2 w-[36px] rounded-full bg-Warning-100">
                <FiSave className="text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton className="mt-4" />
            <ModalBody>
              <h1 className="text-lg font-semibold">Simpan Perubahan</h1>
              <p className="text-sm">Apakah kamu ingin menyimpan perubahan?</p>
            </ModalBody>

            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleSubmit} btnClassName="font-semibold">
                Konfirmasi
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

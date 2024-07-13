import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import {
  Select,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useToast,
  useDisclosure,
  Spinner
} from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import PrimaryButton from '@/components/PrimaryButton';
import axios from 'axios';
import { useRouter } from 'next/router';
import { LuBookOpen } from 'react-icons/lu';

export default function NilaiList() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const toast = useToast();
  const [classes, setClasses] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [grades, setGrades] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState('');
  const [academicYear, setAcademicYear] = React.useState('');
  const [semester, setSemester] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [formativeScore, setFormativeScore] = React.useState('');
  const [summativeScore, setSummativeScore] = React.useState('');
  const [projectScore, setProjectScore] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [editingGrade, setEditingGrade] = React.useState(null);

  React.useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const uniqueClasses = [];
      const classSet = new Set();

      response.data.data.forEach((cls) => {
        if (!classSet.has(cls.class_name)) {
          classSet.add(cls.class_name);
          uniqueClasses.push(cls);
        }
      });

      setClasses(uniqueClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (classId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class/${classId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchGrades = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/grade`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          academic_year: academicYear,
          semester: semester,
          subject_id: subject
        }
      });
      setGrades(response.data.data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const fetchSubjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uniqueSubjects = response.data.data.reduce((acc, current) => {
        if (!acc.some((item) => item.subject_name === current.subject_name)) {
          acc.push(current);
        }
        return acc;
      }, []);
      setSubjects(uniqueSubjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  React.useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
      fetchSubjects();
      fetchGrades();
    }
  }, [selectedClass, academicYear, semester, subject]);

  const getUnratedStudents = () => {
    return students.filter((student) => !grades.some((grade) => grade.student_id === student.id));
  };

  const getRatedStudents = () => {
    return students.filter((student) => grades.some((grade) => grade.student_id === student.id));
  };

  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setFormativeScore('');
    setSummativeScore('');
    setProjectScore('');
    onOpen();
  };

  const handleEdit = async (gradeId, student) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/grade/${gradeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const grade = response.data.data;
      setSelectedStudent(student);
      setEditingGrade(grade);
      setFormativeScore(grade.formative_scores);
      setSummativeScore(grade.summative_scores);
      setProjectScore(grade.project_scores);
      onEditOpen();
    } catch (error) {
      console.error('Error fetching grade details:', error);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const finalGrade = (parseFloat(formativeScore) + parseFloat(summativeScore) + parseFloat(projectScore)) / 3;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/grade/${subject}/insert`,
        {
          student_id: selectedStudent.id,
          semester: parseInt(semester),
          academic_year: academicYear,
          formative_scores: parseFloat(formativeScore),
          summative_scores: parseFloat(summativeScore),
          project_scores: parseFloat(projectScore),
          final_grade: finalGrade
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast({
        title: 'Success',
        description: 'Grade submitted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      fetchGrades();
      onClose();
    } catch (error) {
      console.error('Error submitting grade:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit grade',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    const finalGrade = (parseFloat(formativeScore) + parseFloat(summativeScore) + parseFloat(projectScore)) / 3;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/grade/${editingGrade.id}/update`,
        {
          formative_scores: parseFloat(formativeScore),
          summative_scores: parseFloat(summativeScore),
          project_scores: parseFloat(projectScore),
          final_grade: finalGrade
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast({
        title: 'Success',
        description: 'Grade updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      fetchGrades();
      onEditClose();
    } catch (error) {
      console.error('Error updating grade:', error);
      toast({
        title: 'Error',
        description: 'Failed to update grade',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Nilai" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex justify-between p-3 border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Belum Dinilai</h1>
            <div className="flex gap-3">
              <Select placeholder="Semester" size="md" onChange={(e) => setSemester(e.target.value)}>
                <option value="1">Ganjil</option>
                <option value="2">Genap</option>
              </Select>
              <Select placeholder="Tahun Akademik" size="md" onChange={(e) => setAcademicYear(e.target.value)}>
                <option value="2023-2024">2023/2024</option>
                <option value="2024-2025">2024/2025</option>
                <option value="2025-2026">2025/2026</option>
              </Select>
              <Select placeholder="Kelas" size="md" onChange={(e) => setSelectedClass(e.target.value)}>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
              <Select placeholder="Mata Pelajaran" size="md" onChange={(e) => setSubject(e.target.value)}>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="m-5 border rounded-lg shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <Spinner size="xl" />
              </div>
            ) : (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>No</Th>
                    <Th>NIS</Th>
                    <Th>Nama Siswa</Th>
                    <Th>Jenis Kelamin</Th>
                    <Th>Rata-Rata Formatif</Th>
                    <Th>Rata-Rata Sumatif</Th>
                    <Th>Rata-Rata Proyek</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {getUnratedStudents().length > 0 ? (
                    getUnratedStudents().map((student, index) => (
                      <Tr key={student.id}>
                        <Td>{index + 1}</Td>
                        <Td>{student.nisn}</Td>
                        <Td>{student.name}</Td>
                        <Td>{student.gender}</Td>
                        <Td>-</Td>
                        <Td>-</Td>
                        <Td>-</Td>
                        <Td>
                          <SecondaryButton size="mini" btnClassName="font-semibold" onClick={() => handleOpenModal(student)}>
                            Beri Nilai
                          </SecondaryButton>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={8} className="text-center">
                        Data Kosong / Sudah Dinilai Semua
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </div>
          <div className="p-3">
            <h1 className="text-lg font-semibold">Sudah Dinilai</h1>
            <div className="m-2 border rounded-lg shadow-sm">
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>No</Th>
                    <Th>NIS</Th>
                    <Th>Nama Siswa</Th>
                    <Th>Jenis Kelamin</Th>
                    <Th>Rata-Rata Formatif</Th>
                    <Th>Rata-Rata Sumatif</Th>
                    <Th>Rata-Rata Proyek</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {getRatedStudents().length > 0 ? (
                    getRatedStudents().map((student, index) => {
                      const studentGrade = grades.find((grade) => grade.student_id === student.id);
                      return (
                        <Tr key={student.id}>
                          <Td>{index + 1}</Td>
                          <Td>{student.nisn}</Td>
                          <Td>{student.name}</Td>
                          <Td>{student.gender}</Td>
                          <Td>{studentGrade?.formative_scores}</Td>
                          <Td>{studentGrade?.summative_scores}</Td>
                          <Td>{studentGrade?.project_scores}</Td>
                          <Td>
                            <SecondaryButton size="mini" btnClassName="font-semibold" onClick={() => handleEdit(studentGrade.id, student)}>
                              Edit
                            </SecondaryButton>
                          </Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <Tr>
                      <Td colSpan={8} className="text-center">
                        Data Kosong / Belum Dinilai Semua
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </div>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-full w-[36px] bg-Warning-100">
                <LuBookOpen className="rotate-0 text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Beri Nilai</h1>
              <p className="text-sm font-light text-Gray-600">Masukkan nilai siswa dengan mengisi dibawah ini</p>
              <div className="flex flex-col gap-3 mt-3">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-Gray-700">Nama Siswa</label>
                  <Input value={selectedStudent?.name} readOnly />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-Gray-700">Nilai Rata-rata Formatif</label>
                  <Input placeholder="Masukkan nilai" value={formativeScore} onChange={(e) => setFormativeScore(e.target.value)} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-Gray-700">Nilai Rata-rata Sumatif</label>
                  <Input placeholder="Masukkan nilai" value={summativeScore} onChange={(e) => setSummativeScore(e.target.value)} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-Gray-700">Nilai Rata-rata Proyek</label>
                  <Input placeholder="Masukkan nilai" value={projectScore} onChange={(e) => setProjectScore(e.target.value)} />
                </div>
              </div>
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
        <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-full w-[36px] bg-Warning-100">
                <LuBookOpen className="rotate-0 text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Edit Nilai</h1>
              <p className="text-sm font-light text-Gray-600">Edit nilai siswa dengan mengisi dibawah ini</p>
              <div className="flex flex-col gap-3 mt-3">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-Gray-700">Nama Siswa</label>
                  <Input value={selectedStudent?.name} readOnly />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-Gray-700">Nilai Rata-rata Formatif</label>
                  <Input placeholder="Masukkan nilai" value={formativeScore} onChange={(e) => setFormativeScore(e.target.value)} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-Gray-700">Nilai Rata-rata Sumatif</label>
                  <Input placeholder="Masukkan nilai" value={summativeScore} onChange={(e) => setSummativeScore(e.target.value)} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-Gray-700">Nilai Rata-rata Proyek</label>
                  <Input placeholder="Masukkan nilai" value={projectScore} onChange={(e) => setProjectScore(e.target.value)} />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onEditClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleUpdate} btnClassName="font-semibold">
                Konfirmasi
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

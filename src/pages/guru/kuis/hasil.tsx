import Seo from '@/components/Seo';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, Select, Spinner } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import PrimaryButton from '@/components/PrimaryButton';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

export default function Hasil() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [classes, setClasses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uniqueClasses = response.data.data.filter(
        (cls, index, self) => self.findIndex((c) => c.class_name === cls.class_name) === index
      );
      setClasses(uniqueClasses || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchQuizzes();
    }
  }, [selectedClass, selectedSubject]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredQuizzes = quizzes.filter((quiz) => quiz.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Hasil Kuis" />
        <div className="w-full p-3 rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:items-center">
            <h1 className="font-semibold ">Hasil Kuis</h1>
            <div className="flex justify-between gap-5">
              <div className="relative w-full">
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
              <Select placeholder="Pilih Kelas" size="md" onChange={(e) => setSelectedClass(e.target.value)}>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
              <Select placeholder="Pilih Mata Pelajaran" size="md" onChange={(e) => setSelectedSubject(e.target.value)}>
                {subjects.map((subjectGroup) =>
                  subjectGroup.subject.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))
                )}
              </Select>
            </div>
          </div>
          <TableContainer className="m-3 border rounded-lg shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <Spinner size="xl" />
              </div>
            ) : quizzes.length === 0 ? (
              <div className="flex justify-center items-center py-6">
                <p>Data Kosong</p>
              </div>
            ) : (
              <Table variant="simple">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>Tanggal</Th>
                    <Th>Jenis Kuis</Th>
                    <Th>Tipe Soal</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredQuizzes.map((item, index) => (
                    <Tr key={index}>
                      <Td>{format(new Date(item.deadline), 'd MMM, yyyy / HH:mm a')}</Td>
                      <Td>
                        <div className="flex flex-col">
                          <span>{item.title}</span>
                          <span>{item.description}</span>
                        </div>
                      </Td>
                      <Td>{item.type_of_quiz}</Td>
                      <Td>
                        {item.type_of_quiz === 'Multiple Choice' ? (
                          <SecondaryButton
                            size="mini"
                            btnClassName="w-fit h-fit"
                            onClick={() => router.push(`/guru/kuis/hasil/multiple?quizId=${item.id}`)}
                          >
                            Details
                          </SecondaryButton>
                        ) : (
                          <PrimaryButton
                            size="mini"
                            btnClassName="w-fit h-fit"
                            onClick={() => router.push(`/guru/kuis/hasil/essay?quizId=${item.id}`)}
                          >
                            Beri Nilai
                          </PrimaryButton>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </TableContainer>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

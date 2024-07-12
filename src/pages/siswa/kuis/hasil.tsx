import Seo from '@/components/Seo';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, Tag, TagLabel, Select, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function HasilKuis() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [subjects, setSubjects] = React.useState([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [hasil, setHasil] = React.useState([]);
  const toast = useToast();
  const router = useRouter();

  React.useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/class/subjects`, {
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
    if (selectedSubject) {
      fetchQuizGrades(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchQuizGrades = async (subjectId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/quiz/grades?subjectID=${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHasil(response.data.data || []);
    } catch (error) {
      console.error('Error fetching quiz grades:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch quiz grades',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredHasil = hasil.filter(
    (item) =>
      item.quiz_name.toLowerCase().includes(searchTerm.toLowerCase()) || item.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePercentage = (totalpoint: number) => {
    return (totalpoint / 100) * 100;
  };

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
              <Select placeholder="Pilih Mata Pelajaran" size="md" onChange={(e) => setSelectedSubject(e.target.value)}>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <TableContainer className="m-3 border rounded-lg shadow-sm ">
            <Table variant="simple" className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Tanggal</Th>
                  <Th>Nama Kuis</Th>
                  <Th>(%)</Th>
                  <Th>Total Points</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredHasil.length > 0 ? (
                  filteredHasil.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.submit_at}</Td>
                      <Td className="flex flex-col">
                        <span>{item.quiz_name}</span>
                      </Td>
                      <Td>{handlePercentage(item.grade)}%</Td>
                      <Td>{item.grade}/100</Td>
                      <Td>
                        {item.status === 'submitted' ? (
                          <Tag colorScheme="green" borderRadius="full" size="sm">
                            <TagLabel>Graded</TagLabel>
                          </Tag>
                        ) : item.status === 'Graded' ? (
                          <Tag colorScheme="green" borderRadius="full" size="sm">
                            <TagLabel>Graded</TagLabel>
                          </Tag>
                        ) : item.status === 'waiting for graded' ? (
                          <Tag colorScheme="blue" borderRadius="full" size="sm">
                            <TagLabel>Waiting Graded</TagLabel>
                          </Tag>
                        ) : (
                          <Tag colorScheme="red" borderRadius="full" size="sm">
                            <TagLabel>Not Submitted</TagLabel>
                          </Tag>
                        )}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} className="text-center py-5 text-Gray-600">
                      Tidak ada hasil ditemukan
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

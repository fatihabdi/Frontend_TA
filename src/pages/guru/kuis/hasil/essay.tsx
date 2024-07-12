import Seo from '@/components/Seo';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, Select, Spinner, useToast, Tag, TagLabel } from '@chakra-ui/react';
import Checkbox from '@/components/Checkbox';
import Image from 'next/image';
import SecondaryButton from '@/components/SecondaryButton';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Hasil() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState('Ascending');
  const toast = useToast();
  const router = useRouter();
  const { quizId } = router.query;

  React.useEffect(() => {
    if (quizId) {
      fetchQuizzes();
    }
  }, [quizId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${quizId}/assignment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch quiz assignments',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const sortQuizzes = (quizzesList) => {
    return quizzesList.sort((a, b) => {
      const dateA = new Date(a.submit_at);
      const dateB = new Date(b.submit_at);
      if (sortOrder === 'Ascending') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const filteredQuizzes = sortQuizzes(quizzes.filter((quiz) => quiz.student_name.toLowerCase().includes(searchTerm.toLowerCase())));

  const getStatusTag = (status) => {
    if (status === 'Graded') {
      return (
        <Tag colorScheme="green" borderRadius="full" size="sm">
          <TagLabel>Graded</TagLabel>
        </Tag>
      );
    } else if (status === 'waiting for graded') {
      return (
        <Tag colorScheme="blue" borderRadius="full" size="sm">
          <TagLabel>Waiting Graded</TagLabel>
        </Tag>
      );
    } else {
      return (
        <Tag colorScheme="red" borderRadius="full" size="sm">
          <TagLabel>Not Submitted</TagLabel>
        </Tag>
      );
    }
  };

  const handlePercentage = (totalpoint: number) => {
    return (totalpoint / 100) * 100;
  };

  const handleDetails = (id) => {
    router.push(`/guru/kuis/hasil/${id}?type=Essay`);
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Hasil Kuis" />
        <div className="w-full p-3 rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-3">
            <h1 className="font-semibold ">Hasil Kuis</h1>
            <div className="flex justify-between gap-5">
              <Select placeholder="Sort" size="md" className="w-fit" onChange={handleSortChange}>
                <option value="Ascending">Ascending</option>
                <option value="Descending">Descending</option>
              </Select>
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
              <Table variant="simple" className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>
                      <Checkbox />
                    </Th>
                    <Th>Nama Siswa</Th>
                    <Th>(%)</Th>
                    <Th>Total Points</Th>
                    <Th>Status</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredQuizzes.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <Checkbox />
                      </Td>
                      <Td className="">
                        <div className="flex items-center gap-2">
                          <Image
                            src={`https://ui-avatars.com/api/?name=${item.student_name}`}
                            alt="Logo"
                            width={40}
                            height={24}
                            className="rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-Gray-900">{item.student_name}</span>
                            <span className="text-sm text-Gray-600">{item.nisn}</span>
                          </div>
                        </div>
                      </Td>
                      <Td>{handlePercentage(item.grade)}%</Td>
                      <Td>{item.grade}/100</Td>
                      <Td>{getStatusTag(item.status)}</Td>
                      <Td>
                        <SecondaryButton size="mini" btnClassName="w-fit h-fit" onClick={() => handleDetails(item.id)}>
                          Details
                        </SecondaryButton>
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

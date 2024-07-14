import Seo from '@/components/Seo';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, Select, Spinner, Tag, TagLabel, useToast } from '@chakra-ui/react';
import Checkbox from '@/components/Checkbox';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import SecondaryButton from '@/components/SecondaryButton';

export default function Hasil() {
  const router = useRouter();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState('Ascending');
  const { quizId } = router.query;

  const fetchQuizzes = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${quizId}/assignment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let data = response.data.data || [];

      if (sortOrder === 'Ascending') {
        data.sort((a, b) => new Date(a.submit_at) - new Date(b.submit_at));
      } else {
        data.sort((a, b) => new Date(b.submit_at) - new Date(a.submit_at));
      }

      setQuizzes(data);
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

  React.useEffect(() => {
    if (quizId) {
      fetchQuizzes();
    }
  }, [quizId, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const handlePercentage = (totalpoint: number) => {
    return (totalpoint / 100) * 100;
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
                    <Th>Nama Siswa</Th>
                    <Th>(%)</Th>
                    <Th>Total Points</Th>
                    <Th>Status</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {quizzes.map((item, index) => (
                    <Tr key={index}>
                      <Td className="flex gap-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src={`https://ui-avatars.com/api/?name=${item.student_name}`}
                            alt="Logo"
                            width={40}
                            height={24}
                            className="rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-Gray-900">{item.student_name}</span>{' '}
                            <span className="text-sm text-Gray-600">{item.nisn}</span>
                          </div>
                        </div>
                      </Td>
                      <Td>{handlePercentage(item.grade)}%</Td>
                      <Td>{item.grade}/100</Td>
                      <Td>
                        {item.status === 'submitted' ? (
                          <Tag colorScheme="green" borderRadius="full" size="sm">
                            <TagLabel>Submitted</TagLabel>
                          </Tag>
                        ) : (
                          <Tag colorScheme="red" borderRadius="full" size="sm">
                            <TagLabel>Not Submitted</TagLabel>
                          </Tag>
                        )}
                      </Td>
                      <Td>
                        <SecondaryButton
                          btnClassName="w-fit h-fit"
                          size="mini"
                          onClick={() => router.push(`/guru/kuis/hasil/${item.id}?type=Multiple%20Choice`)}
                        >
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

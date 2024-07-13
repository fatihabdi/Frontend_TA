import Seo from '@/components/Seo';
import AuthenticatedLayout from '@/components/layout/layoutWali/AuthenticatedLayout';
import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, Tag, TagLabel, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SecondaryButton from '@/components/SecondaryButton';

export default function HasilTugas() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [assignments, setAssignments] = React.useState([]);
  const toast = useToast();
  const router = useRouter();

  React.useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parent/task/assignment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch assignments',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAssignments = assignments.filter((assignment) => assignment.task.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Hasil Tugas" />
        <div className="w-full p-3 rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:items-center">
            <h1 className="font-semibold ">Hasil Tugas</h1>
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
            </div>
          </div>
          <TableContainer className="m-3 border rounded-lg shadow-sm ">
            <Table variant="simple" className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Tanggal</Th>
                  <Th>Nama Tugas</Th>
                  <Th>Jenis Tugas</Th>
                  <Th>Nilai yang Diberikan</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment, index) => (
                    <Tr key={index}>
                      <Td>{assignment.id ? new Date(assignment.submit_at).toLocaleDateString() : '-'}</Td>
                      <Td>{assignment.task}</Td>
                      <Td>-</Td>
                      <Td>{assignment.id ? assignment.grade : '-'}</Td>
                      <Td>
                        {assignment.id ? (
                          <Tag colorScheme="green" borderRadius="full" size="sm">
                            <TagLabel>
                              {assignment.feedback !== 'Menunggu untuk dinilai guru' ? 'Sudah Dinilai' : 'Menunggu Penilaian'}
                            </TagLabel>
                          </Tag>
                        ) : (
                          <Tag colorScheme="red" borderRadius="full" size="sm">
                            <TagLabel>Belum Mengumpulkan</TagLabel>
                          </Tag>
                        )}
                      </Td>
                      <Td>
                        <SecondaryButton
                          onClick={() =>
                            router.push({
                              pathname: `/siswa/tugas/hasil/${assignment.id}`,
                              query: { id: assignment.id, title: assignment.task }
                            })
                          }
                          btnClassName="px-2 py-1 text-sm text-white bg-Primary rounded-md hover:bg-Primary-light"
                        >
                          Detail
                        </SecondaryButton>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={6} className="text-center py-5 text-Gray-600">
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

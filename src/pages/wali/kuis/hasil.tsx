import Seo from '@/components/Seo';
import AuthenticatedLayout from '@/components/layout/layoutWali/AuthenticatedLayout';
import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, Tag, TagLabel, Select } from '@chakra-ui/react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

export default function Hasil() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [hasil, setHasil] = React.useState([]);
  const toast = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  console.log(hasil);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parent/quiz`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setHasil(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching quiz results:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch quiz results',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, [toast]);

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
              <Select placeholder="Kelas" size="md" className="w-fit">
                <option value="1">X</option>
                <option value="2">XI</option>
                <option value="3">XII</option>
              </Select>
            </div>
          </div>
          <TableContainer className="m-3 border rounded-lg shadow-sm ">
            <Table variant="simple" className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Tanggal</Th>
                  <Th>Jenis Kuis</Th>
                  <Th>(%)</Th>
                  <Th>Total Points</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {hasil.map((item, index) => (
                  <Tr key={index}>
                    <Td>{new Date(item.submit_at).toLocaleDateString()}</Td>
                    <Td className="flex flex-col">
                      <span>{item.quiz_name}</span>
                    </Td>
                    <Td>{(item.grade / 100) * 100}%</Td>
                    <Td>{item.grade}/100</Td>
                    <Td>
                      {item.status === 'submitted' ? (
                        <Tag colorScheme="green" borderRadius="full" size="sm">
                          <TagLabel>Submitted</TagLabel>
                        </Tag>
                      ) : item.status === 'waiting for graded' ? (
                        <Tag colorScheme="orange" borderRadius="full" size="sm">
                          <TagLabel>Waiting For Graded</TagLabel>
                        </Tag>
                      ) : (
                        <Tag colorScheme="red" borderRadius="full" size="sm">
                          <TagLabel>Failed</TagLabel>
                        </Tag>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

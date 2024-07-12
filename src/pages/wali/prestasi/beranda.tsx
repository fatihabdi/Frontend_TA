import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutWali/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Avatar } from '@chakra-ui/react';
import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, Tag, TagLabel } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

export default function PrestasiList() {
  const router = useRouter();
  const toast = useToast();
  const [prestasi, setPrestasi] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [userData, setUserData] = React.useState(null);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parent/student`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setUserData(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch student data',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, []);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parent/achievement`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setPrestasi(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching achievements:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch achievements',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, [toast]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(prestasi.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const currentData = prestasi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Nilai" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex justify-between w-full p-3 border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Grades</h1>
            <div className="flex gap-3">
              <Select placeholder="Kelas" size="md">
                <option value="1">X</option>
                <option value="2">XI</option>
                <option value="3">XII</option>
              </Select>
            </div>
          </div>
          {userData ? (
            <div className="flex items-center gap-5 p-7">
              <Avatar size="2xl" name={userData[0].name} src="https://bit.ly/sage-adebayo" showBorder={true} className="shadow-lg" />
              <div>
                <h1 className="text-3xl font-semibold">{userData[0].name}</h1>
                <h1 className=" text-Gray-600 text-medium">NISN : {userData[0].nisn}</h1>
                <h1 className="text-Gray-600 text-medium">Jenis Kelamin : {userData[0].gender}</h1>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 text-Gray-600">Tidak ada data siswa ditemukan</div>
          )}
        </div>
        <div className="w-full p-3 rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:items-center">
            <h1 className="font-semibold ">List Pelaporan Prestasi</h1>
            <div className="relative">
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
          {prestasi.length > 0 ? (
            <TableContainer className="m-3 border rounded-lg shadow-sm ">
              <Table variant="simple" className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>No</Th>
                    <Th>Jenis Prestasi</Th>
                    <Th>Nama dan Judul Kegiatan</Th>
                    <Th>Partisipasi</Th>
                    <Th>Tingkat</Th>
                    <Th>Status</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{item.type_of_achievement}</Td>
                      <Td>{item.title}</Td>
                      <Td>{item.participation}</Td>
                      <Td>{item.level}</Td>
                      <Td>
                        {item.status === 'pending' ? (
                          <Tag colorScheme="blue" borderRadius="full" size="sm">
                            <TagLabel>Wait Approval</TagLabel>
                          </Tag>
                        ) : item.status === 'accepted' ? (
                          <Tag colorScheme="green" borderRadius="full" size="sm">
                            <TagLabel>Success</TagLabel>
                          </Tag>
                        ) : (
                          <Tag colorScheme="red" borderRadius="full" size="sm">
                            <TagLabel>Declined</TagLabel>
                          </Tag>
                        )}
                      </Td>
                      <Td>
                        <Button
                          colorScheme="gray"
                          variant="outline"
                          size="md"
                          onClick={() => router.push(`/siswa/prestasi/detail/${item.id}`)}
                        >
                          Details
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <div className="text-center py-5 text-Gray-600">Tidak ada data prestasi ditemukan</div>
          )}
          <div id="pagination" className="flex justify-between p-3 border-t border-Gray-200">
            <SecondaryButton
              btnClassName={`font-semibold w-fit ${currentPage === 1 ? 'text-Gray-300 border-Gray-300' : ''}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </SecondaryButton>
            <span className="self-center">
              Page {currentPage} of {Math.ceil(prestasi.length / itemsPerPage)}
            </span>
            <SecondaryButton
              btnClassName={`font-semibold w-fit ${currentPage === Math.ceil(prestasi.length / itemsPerPage) ? 'text-Gray-300 border-Gray-300' : ''}`}
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(prestasi.length / itemsPerPage)}
            >
              Next
            </SecondaryButton>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

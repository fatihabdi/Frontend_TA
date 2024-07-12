import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Avatar, Table, Thead, Tr, Th, Tbody, Td, TableContainer, Tag, TagLabel, Spinner } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';

export default function PrestasiList() {
  const router = useRouter();
  const [prestasi, setPrestasi] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(response.data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchPrestasi = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/achivement`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPrestasi(response.data.data || []);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchPrestasi();
  }, []);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [searchTerm, setSearchTerm] = React.useState('');
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = (prestasi || []).filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Nilai" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Nilai" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex justify-between w-full p-3 border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Prestasi</h1>
          </div>
          <div className="flex items-center gap-5 p-7">
            <Avatar
              size="2xl"
              name={profile.name}
              src={`https://ui-avatars.com/api/?name=${profile.name}&size=35&background=random&color=fff`}
              showBorder={true}
              className="shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-semibold">{profile.name}</h1>
              <h1 className=" text-Gray-600 text-medium">NISN : {profile.nisn}</h1>
              <h1 className="text-Gray-600 text-medium">Jenis Kelamin : {profile.gender}</h1>
            </div>
          </div>
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
                    <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                    <Td>{item.type_of_achivement}</Td>
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
          <div id="pagination" className="flex justify-between p-3 border-t border-Gray-200">
            <SecondaryButton
              btnClassName={`font-semibold w-fit ${currentPage === 1 ? 'text-Gray-300 border-Gray-300' : ''}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </SecondaryButton>
            <span className="self-center">
              Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <SecondaryButton
              btnClassName={`font-semibold w-fit ${currentPage === Math.ceil(filteredData.length / itemsPerPage) ? 'text-Gray-300 border-Gray-300' : ''}`}
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
            >
              Next
            </SecondaryButton>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

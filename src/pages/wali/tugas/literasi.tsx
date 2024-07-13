import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutWali/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Table, Thead, Tbody, Tr, Th, Td, Spinner, useToast, Button } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Literasi() {
  const router = useRouter();
  const toast = useToast();
  const [literations, setLiterations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [student, setStudent] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortOrder, setSortOrder] = React.useState('newest');
  const itemsPerPage = 5;

  React.useEffect(() => {
    fetchLiterations();
  }, [sortOrder]);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parent/student`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setStudent(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching student:', error);
      });
  }, []);

  const fetchLiterations = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parent/literation`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data.data || [];
      if (sortOrder === 'newest') {
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else {
        data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
      setLiterations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching literations:', error);
      setError('Failed to fetch literations');
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Gagal mengambil data literasi',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = literations.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(literations.length / itemsPerPage);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit bg-Base-white flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit bg-Base-white flex justify-center items-center">
          <p>{error}</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Detail Pengumpulan</h1>
            <div className="flex justify-between gap-5">
              <h1 className="text-Gray-500">
                Nama Anak : <span className="font-semibold text-Gray-900">{student[0] ? student[0].name : 'Loading...'}</span>
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="sort" className="text-sm font-medium text-Gray-700">
                Urutkan Berdasarkan
              </label>
              <Select placeholder="Sort" size="md" name="sort" className="" onChange={handleSortChange}>
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </Select>
            </span>
          </div>
          <div className="m-3 border rounded-lg shadow-sm ">
            <Table className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Judul Literasi</Th>
                  <Th>Total Points</Th>
                  <Th>Catatan dari guru</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} className="text-center">
                      Tidak ada data literasi
                    </Td>
                  </Tr>
                ) : (
                  currentItems.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.title}</Td>
                      <Td>{item.point}/50</Td>
                      <Td>{item.feedback}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

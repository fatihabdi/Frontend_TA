import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutWali/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Table, Thead, Tbody, Tr, Th, Td, Spinner, useToast } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Literasi() {
  const router = useRouter();
  const toast = useToast();
  const [literations, setLiterations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchLiterations();
  }, []);

  const fetchLiterations = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parent/literation`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLiterations(response.data.data || []);
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
                Nama Anak : <span className="font-semibold text-Gray-900">Dominica</span>
              </h1>
              <h1 className="text-Gray-500">
                Kelas : <span className="font-semibold text-Gray-900">VII A</span>
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="sort" className="text-sm font-medium text-Gray-700">
                Urutkan Berdasarkan
              </label>
              <Select placeholder="Kelas" size="md" name="sort" className="">
                <option value="1">X</option>
                <option value="2">XI</option>
                <option value="3">XII</option>
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
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {literations.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} className="text-center">
                      Tidak ada data literasi
                    </Td>
                  </Tr>
                ) : (
                  literations.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.title}</Td>
                      <Td>{item.point}/50</Td>
                      <Td>{item.feedback}</Td>
                      <Td>
                        <SecondaryButton
                          btnClassName="font-semibold w-fit h-fit"
                          onClick={() => router.push(`/materi/literasi/${item.id}`)}
                        >
                          Details
                        </SecondaryButton>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

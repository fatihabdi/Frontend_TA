import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Table, Thead, Tbody, Tr, Th, Td, Skeleton } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import PrimaryButton from '@/components/PrimaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Literasi() {
  const router = useRouter();
  const [literations, setLiterations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reverseOrder, setReverseOrder] = React.useState(false); // State for reverse order toggle

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/student/literation`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setLiterations(response.data.data);
        } else {
          setError('No data available');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  // Function to handle toggling between reverse order
  const toggleReverseOrder = () => {
    setReverseOrder(!reverseOrder);
  };

  // Function to get literations in reverse order if toggle is enabled
  const getOrderedLiterations = () => {
    if (reverseOrder) {
      return [...literations].reverse();
    } else {
      return [...literations];
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Detail Pengumpulan</h1>
            <PrimaryButton btnClassName="w-fit h-fit" onClick={() => router.push('/siswa/tugas/literasi/create')}>
              Tambah Literasi
            </PrimaryButton>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="sort" className="text-sm font-medium text-Gray-700">
                Urutkan Berdasarkan
              </label>
              <Select
                value={reverseOrder ? 'newest' : 'oldest'}
                onChange={toggleReverseOrder}
                placeholder="Sort"
                size="md"
                name="sort"
                className=""
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </Select>
            </span>
          </div>
          <div className="m-3 border rounded-lg shadow-sm">
            <Table className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Judul Literasi</Th>
                  <Th>Nilai</Th>
                  <Th>Feedback</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <>
                    <Tr>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                    </Tr>
                  </>
                ) : error ? (
                  <Tr>
                    <Td colSpan={4} className="text-center py-5 text-Gray-600">
                      {error}
                    </Td>
                  </Tr>
                ) : literations.length > 0 ? (
                  getOrderedLiterations().map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.title}</Td>
                      <Td>{item.point}</Td>
                      <Td>{item.feedback}</Td>
                      <Td>
                        <SecondaryButton
                          btnClassName="font-semibold w-fit h-fit"
                          onClick={() => router.push(`/siswa/tugas/literasi/${item.id}`)}
                        >
                          Details
                        </SecondaryButton>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} className="text-center py-5 text-Gray-600">
                      Tidak ada literasi yang tersedia.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

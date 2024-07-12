import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Table, Thead, Tr, Th, Tbody, Td, TableContainer, useToast } from '@chakra-ui/react';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Nilai() {
  const [hasil, setHasil] = React.useState(null);
  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/student/quiz/${id}/grade`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          if (response.data && response.data.data) {
            setHasil(response.data.data);
          } else {
            setHasil(null);
          }
        })
        .catch((error) => {
          console.error('Error fetching quiz grades:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch quiz grades',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    }
  }, [id, toast]);

  const renderFinalGrade = () => {
    if (hasil) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <h1 className="text-lg font-semibold">Nilai Final-mu untuk Kuis ini adalah {hasil.grade}/100</h1>
          <p className="text-sm text-Gray-500">Tidak ada Kesempatan lagi untuk Mengerjakan</p>
          <SecondaryButton btnClassName="w-fit h-fit" onClick={() => router.push('/siswa/kuis/list')}>
            Kembali ke Halaman Utama
          </SecondaryButton>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <h1 className="text-lg font-semibold">Tidak ada data nilai tersedia</h1>
          <SecondaryButton btnClassName="w-fit h-fit" onClick={() => router.push('/siswa/kuis/list')}>
            Kembali ke Halaman Utama
          </SecondaryButton>
        </div>
      );
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Hasil Kuis" />
        <div className="w-full p-3 rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-3 border-b border-Gray-200 lg:flex-row lg:items-center">
            <h1 className="font-semibold ">Hasil Kuis</h1>
          </div>
          <TableContainer className="m-3 border-t border-b shadow-sm ">
            <Table variant="simple" className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Tanggal Submit</Th>
                  <Th>Status</Th>
                  <Th>Nilai/100</Th>
                  <Th>Review</Th>
                </Tr>
              </Thead>
              <Tbody>
                {hasil && (
                  <Tr>
                    <Td>{hasil.submit_at}</Td>
                    <Td>{hasil.status}</Td>
                    <Td>{hasil.grade}</Td>
                    <Td>
                      <PrimaryButton btnClassName="w-fit h-fit">Review</PrimaryButton>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          {renderFinalGrade()}
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

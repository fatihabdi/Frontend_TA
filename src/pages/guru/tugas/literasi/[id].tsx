import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Table, Thead, Tr, Tbody, Th, Td, Spinner, Tag, TagLabel } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';

export default function DetailPengumpulanLiterasi() {
  const router = useRouter();
  const { classId } = router.query;
  const [literationDetails, setLiterationDetails] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (classId) {
      fetchLiterationDetails(classId);
    }
  }, [classId]);

  const fetchLiterationDetails = async (classId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/literation`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const filteredData = response.data.data.filter((item) => item.student_class_id === classId);
      setLiterationDetails(filteredData);
    } catch (error) {
      console.error('Error fetching literation details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Pengumpulan Literasi" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Pengumpulan Literasi" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Detail Pengumpulan</h1>
          </div>
          <div className="flex flex-col gap-4 px-3 py-6">
            <label htmlFor="sort" className="text-sm font-medium text-Gray-700">
              Sort By
            </label>
            <Select placeholder="Urutkan" size="md" name="sort" className="">
              <option value="1">X</option>
              <option value="2">XI</option>
              <option value="3">XII</option>
            </Select>
          </div>
          <div className="m-3 border rounded-lg shadow-sm ">
            <Table className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Nama Siswa</Th>
                  <Th>Judul Literasi</Th>
                  <Th>Total Point</Th>
                  <Th>Catatan Guru</Th>
                  <Th>Status Penilaian</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {literationDetails.length > 0 ? (
                  literationDetails.map((item) => (
                    <Tr key={item.id}>
                      <Td className="">
                        <div className="flex items-center gap-2">
                          <Image
                            src={`https://ui-avatars.com/api/?name=${item.student}`}
                            alt="Logo"
                            width={40}
                            height={24}
                            className="rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-Gray-900">{item.student}</span>
                          </div>
                        </div>
                      </Td>
                      <Td className="text-sm text-Gray-900">{item.title}</Td>
                      <Td className="text-sm text-Gray-900">{item.point}</Td>
                      <Td>{item.feedback || 'Belum ada catatan'}</Td>
                      <Td>
                        {item.status ? (
                          <Tag colorScheme="green">
                            <TagLabel>Sudah Dinilai</TagLabel>
                          </Tag>
                        ) : (
                          <Tag colorScheme="red">
                            <TagLabel>Belum Dinilai</TagLabel>
                          </Tag>
                        )}
                      </Td>
                      <Td>
                        <SecondaryButton
                          btnClassName="font-semibold"
                          onClick={() =>
                            router.push({
                              pathname: `/guru/tugas/literasi/detail/${item.id}`,
                              query: { id: item.id }
                            })
                          }
                        >
                          {item.point === '-' || item.point === 0 ? 'Evaluate' : 'Detail'}
                        </SecondaryButton>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="6" className="text-center">
                      Tidak ada data literasi yang ditemukan.
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

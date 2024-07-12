import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Table, Thead, Tr, Tbody, Th, Td, Tag, TagLabel, Select, Skeleton, Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SecondaryButton from '@/components/SecondaryButton';
import { FaFilePdf } from 'react-icons/fa';
import axios from 'axios';

export default function Dispensasi() {
  const router = useRouter();
  const [dispensations, setDispensations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/dispensation`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDispensations(response.data.data);
      } catch (error) {
        console.error('Error fetching dispensations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = (id: number) => {
    setDispensations((prevDispensations) =>
      prevDispensations.map((dispensation) => (dispensation.id === id ? { ...dispensation, status: 'Success' } : dispensation))
    );
  };

  const handleDecline = (id: number) => {
    setDispensations((prevDispensations) =>
      prevDispensations.map((dispensation) => (dispensation.id === id ? { ...dispensation, status: 'Declined' } : dispensation))
    );
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Dispensasi" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Daftar Dispensasi</h1>
            <div className="flex items-center gap-2">
              <Select placeholder="Kelas" size="md">
                <option value="1">VII - A</option>
                <option value="2">VIII - B</option>
                <option value="3">IX - C</option>
              </Select>
            </div>
          </div>
          <div className="m-3 border rounded-lg shadow-sm ">
            <Table className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Nama Siswa</Th>
                  <Th>Keterangan Dispensasi</Th>
                  <Th>Tanggal Mulai</Th>
                  <Th>Tanggal Akhir</Th>
                  <Th>Dokumen Pendukung</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Tr key={index}>
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
                    ))}
                  </>
                ) : dispensations.length === 0 ? (
                  <Tr>
                    <Td colSpan={7}>
                      <Box textAlign="center" py={10}>
                        <Text fontSize="lg" color="gray.500">
                          Data Kosong
                        </Text>
                      </Box>
                    </Td>
                  </Tr>
                ) : (
                  dispensations.map((item, index) => (
                    <Tr key={index}>
                      <Td className="">
                        <div className="flex items-center gap-2">
                          <Image
                            src={`https://ui-avatars.com/api/?name=${item.student}`}
                            alt="Logo"
                            width={40}
                            height={24}
                            className="rounded-full"
                          />
                          <div className="">
                            <span className="text-sm font-medium text-Gray-900">{item.student}</span>
                          </div>
                        </div>
                      </Td>
                      <Td className="text-sm text-Gray-900">{item.reason}</Td>
                      <Td className="text-sm text-Gray-900">{item.start_at}</Td>
                      <Td className="text-sm text-Gray-900">{item.end_at}</Td>
                      <Td className=" text-sm text-Gray-900">
                        <div className="flex items-center gap-2">
                          <FaFilePdf className="text-2xl text-Error-500" />
                          <div className="text-xs text-Gray-500">
                            <h1>{item.document.slice(0, 12) + '...'}</h1>
                          </div>
                        </div>
                      </Td>
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
                        <SecondaryButton btnClassName="font-semibold" onClick={() => router.push(`/guru/pengaturan/dispensasi/${item.id}`)}>
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

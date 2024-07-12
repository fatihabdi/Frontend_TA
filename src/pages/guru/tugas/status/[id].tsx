import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Table, Thead, Tr, Tbody, Th, Td, Tag, TagLabel, Spinner } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';

export default function Status() {
  const router = useRouter();
  const { id } = router.query; // Get the task ID from the URL
  const [assignments, setAssignments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('newest'); // Add state for sort order

  React.useEffect(() => {
    const fetchAssignments = async () => {
      if (!id) {
        setLoading(false); // Set loading to false if taskId is not available
        return;
      }

      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/task/${id}/assignment`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAssignments(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setAssignments([]);
      }
    };

    fetchAssignments();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);

    const sortedAssignments = [...assignments].sort((a, b) => {
      const dateA = new Date(a.submit_at);
      const dateB = new Date(b.submit_at);

      return value === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setAssignments(sortedAssignments);
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Status" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Detail Pengumpulan</h1>
            <div className="flex flex-col lg:flex-row gap-7">
              <h1 className="font-semibold text-Gray-600">
                <span className="font-medium text-Gray-500">Deadline Pengumpulan :</span> January 6, 2023 11:59 AM
              </h1>
              <h1 className="font-semibold text-Gray-600">
                <span className="font-medium text-Gray-500">Total Points :</span> 50
              </h1>
              <h1 className="font-semibold text-Gray-600">
                <span className="font-medium text-Gray-500">Point Minimum Lulus :</span> 25
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-3 py-6">
            <label htmlFor="sort" className="text-sm font-medium text-Gray-700">
              Sort By
            </label>
            <Select placeholder="All" size="md" name="sort" className="w-fit" onChange={handleSortChange}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </Select>
          </div>
          <div className="m-3 border rounded-lg shadow-sm ">
            {loading ? (
              <div className="flex justify-center items-center">
                <Spinner size="xl" />
              </div>
            ) : (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>Tanggal</Th>
                    <Th>Nama Siswa</Th>
                    <Th>Total Point</Th>
                    <Th>Status Submit</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {assignments.length === 0 ? (
                    <Tr>
                      <Td colSpan="6" className="text-center">
                        Tidak ada data pengumpulan
                      </Td>
                    </Tr>
                  ) : (
                    assignments.map((assignment, index) => (
                      <Tr key={index}>
                        <Td className="text-sm text-Gray-900">{formatDate(assignment.submit_at)}</Td>
                        <Td className="">
                          <div className="flex items-center gap-2">
                            <Image
                              src={`https://ui-avatars.com/api/?name=${assignment.student}`}
                              alt="Logo"
                              width={40}
                              height={24}
                              className="rounded-full"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-Gray-900">{assignment.student}</span>{' '}
                            </div>
                          </div>
                        </Td>
                        <Td className="text-sm text-Gray-900">{assignment.grade}/50</Td>
                        <Td>
                          {assignment.feedback === 'Menunggu untuk dinilai guru' ? (
                            <Tag colorScheme="blue" borderRadius="full" size="sm">
                              <TagLabel>Pending</TagLabel>
                            </Tag>
                          ) : (
                            <Tag colorScheme="green" borderRadius="full" size="sm">
                              <TagLabel>Graded</TagLabel>
                            </Tag>
                          )}
                        </Td>
                        <Td>
                          <SecondaryButton
                            btnClassName="font-semibold"
                            onClick={() => router.push(`/guru/tugas/status/detail/${assignment.id}`)}
                          >
                            {assignment.feedback === 'Menunggu untuk dinilai guru' ? 'Evaluate' : 'Detail'}
                          </SecondaryButton>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

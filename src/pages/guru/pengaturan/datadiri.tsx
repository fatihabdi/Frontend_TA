import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import { useRouter } from 'next/router';
import Seo from '@/components/Seo';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tag, TagLabel, Select, Button, useToast, Spinner } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import axios from 'axios';

export default function DataDiri() {
  const router = useRouter();
  const toast = useToast();
  const [students, setStudents] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uniqueClasses = [];
      const classSet = new Set();

      response.data.data.forEach((cls) => {
        if (!classSet.has(cls.class_name)) {
          classSet.add(cls.class_name);
          uniqueClasses.push(cls);
        }
      });

      setClasses(uniqueClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async (classId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/students/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch students',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId) {
      fetchStudents(classId);
    } else {
      setStudents([]);
    }
  };

  const handleDetailsClick = (student) => {
    router.push(
      {
        pathname: '/guru/pengaturan/datadiri/[id]',
        query: { id: student.id, student: JSON.stringify(student) }
      },
      `/guru/pengaturan/datadiri/${student.id}`
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(students.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const currentData = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="overflow-x-auto">
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex items-center justify-between p-4">
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              Daftar siswa{' '}
              <Tag colorScheme="blue" borderRadius="full" size="sm">
                <TagLabel>{students.length} User</TagLabel>
              </Tag>
            </h1>
            <div className="flex items-center gap-2">
              <Select placeholder="Kelas" size="md" onChange={handleClassChange}>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Spinner size="xl" />
            </div>
          ) : students.length === 0 ? (
            <div className="flex justify-center items-center py-6">
              <p>Data Kosong</p>
            </div>
          ) : (
            <>
              <TableContainer className="">
                <Table variant="simple" className="">
                  <Thead className="bg-Gray-50">
                    <Tr>
                      <Th>Name</Th>
                      <Th>Nomor Induk</Th>
                      <Th>Email</Th>
                      <Th>Nomor Hp</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentData.map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.name}</Td>
                        <Td>{item.nisn}</Td>
                        <Td>{item.email}</Td>
                        <Td>{item.phone}</Td>
                        <Td>
                          <Button colorScheme="gray" variant="outline" size="md" onClick={() => handleDetailsClick(item)}>
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
                  Page {currentPage} of {Math.ceil(students.length / itemsPerPage)}
                </span>
                <SecondaryButton
                  btnClassName={`font-semibold w-fit ${currentPage === Math.ceil(students.length / itemsPerPage) ? 'text-Gray-300 border-Gray-300' : ''}`}
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(students.length / itemsPerPage)}
                >
                  Next
                </SecondaryButton>
              </div>
            </>
          )}
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

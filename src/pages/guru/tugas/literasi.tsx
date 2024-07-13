import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Input, Select, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Literasi() {
  const router = useRouter();
  const [classes, setClasses] = React.useState([]);
  const [literations, setLiterations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedClass, setSelectedClass] = React.useState('');

  React.useEffect(() => {
    fetchClassData();
    fetchLiterationData();
  }, []);

  const fetchClassData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove duplicates
      const uniqueClasses = [];
      const classNames = new Set();

      response.data.data.forEach((cls) => {
        if (!classNames.has(cls.class_name)) {
          classNames.add(cls.class_name);
          uniqueClasses.push(cls);
        }
      });

      setClasses(uniqueClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchLiterationData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/literation`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLiterations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching literation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalSubmit = (classId) => {
    return literations.filter((literation) => literation.student_class_id === classId).length;
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const filteredClasses = selectedClass ? classes.filter((cls) => cls.class_id === selectedClass) : classes;

  if (loading) {
    return (
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="p-3 lg:justify-between lg:flex lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Pengumpulan Literasi</h1>
            <div className="">
              <Select placeholder="Pilih Kelas" size="md" onChange={handleClassChange}>
                <option value="">Semua Kelas</option>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="py-6 lg:px-3">
            <span className="w-full">
              <label htmlFor="date" className="text-sm font-medium text-Gray-700">
                Tanggal Dibuat
              </label>
              <Input size="md" type="date" name="date" className="mt-3" />
            </span>
          </div>
          <div className="m-3 border rounded-lg shadow-sm ">
            <Table className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Kelas</Th>
                  <Th>Total Submit</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls, index) => (
                    <Tr key={index}>
                      <Td className="font-semibold">{cls.class_name}</Td>
                      <Td>{getTotalSubmit(cls.class_id)}</Td>
                      <Td>
                        <SecondaryButton
                          size="mini"
                          btnClassName="font-semibold"
                          onClick={() =>
                            router.push({
                              pathname: `/guru/tugas/literasi/${cls.class_id}`,
                              query: { classId: cls.class_id }
                            })
                          }
                        >
                          Detail
                        </SecondaryButton>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="4" className="text-center">
                      Tidak ada data kelas yang ditemukan.
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

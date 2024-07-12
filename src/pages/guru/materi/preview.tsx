import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import PrimaryButton from '@/components/PrimaryButton';
import axios from 'axios';

export default function Materi() {
  const router = useRouter();
  const [matters, setMatters] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [participants, setParticipants] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [selectedClass, setSelectedClass] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const classesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClasses(classesResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
    if (selectedClass && selectedSubject) {
      fetchMattersAndParticipants(selectedClass, selectedSubject);
    }
  };

  const handleSubjectChange = async (e) => {
    const selectedSubject = e.target.value;
    setSelectedSubject(selectedSubject);
    if (selectedClass && selectedSubject) {
      fetchMattersAndParticipants(selectedClass, selectedSubject);
    }
  };

  const fetchMattersAndParticipants = async (classId, subjectId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const [mattersResponse, participantsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/${subjectId}/matter`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/${classId}/${subjectId}/student`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setMatters(mattersResponse.data.data || []);
      setParticipants(participantsResponse.data.data || []);
      console.log(participantsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMatters([]);
      setParticipants({});
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMove = () => {
    router.push('/guru/materi/create');
    localStorage.setItem('subjectId', selectedSubject);
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Materi</h1>
            <PrimaryButton btnClassName="w-fit" onClick={handleMove}>
              Tambah Materi
            </PrimaryButton>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="kelas" className="text-sm font-medium text-Gray-700">
                Kelas
              </label>
              <Select placeholder="Kelas" size="md" name="kelas" onChange={handleClassChange}>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
            </span>
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="subject" className="text-sm font-medium text-Gray-700">
                Mata Pelajaran
              </label>
              <Select placeholder="Mata Pelajaran" size="md" name="subject" onChange={handleSubjectChange}>
                {classes
                  .filter((cls) => cls.class_id === selectedClass)
                  .map((cls) => (
                    <option key={cls.subject_id} value={cls.subject_id}>
                      {cls.subject_name}
                    </option>
                  ))}
              </Select>
            </span>
            <span className="flex flex-col justify-end w-full gap-4">
              <label htmlFor="search"></label>
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
            </span>
          </div>
          <div className="m-3 border rounded-lg shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <Spinner size="xl" />
              </div>
            ) : (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nama Materi</Th>
                    <Th>Mata Pelajaran</Th>
                    <Th>Kelas</Th>
                    <Th>Partisipan</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {matters.map((matter, index) => (
                    <Tr key={index}>
                      <Td>{matter.id.slice(0, 4)}</Td>
                      <Td>{matter.title}</Td>
                      <Td>{matter.subject}</Td>
                      <Td>{classes.find((cls) => cls.subject_name === matter.subject)?.class_name || 'N/A'}</Td>
                      <Td>{participants.length || 0}</Td>
                      <Td>
                        <SecondaryButton
                          size="mini"
                          btnClassName="font-semibold"
                          onClick={() =>
                            router.push({
                              pathname: '/guru/materi/edit',
                              query: { matterId: matter.id }
                            })
                          }
                        >
                          Edit
                        </SecondaryButton>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

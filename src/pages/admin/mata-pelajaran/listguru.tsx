import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutAdmin/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Table, Thead, Tbody, Tr, Th, Td, useToast, Skeleton } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import { FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import axios from 'axios';

export default function ListGuru() {
  const router = useRouter();
  const toast = useToast();
  const [subjects, setSubjects] = React.useState([]);
  const [filterMapel, setFilterMapel] = React.useState('');
  const [guru, setGuru] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loadingSubjects, setLoadingSubjects] = React.useState(true);
  const [loadingTeachers, setLoadingTeachers] = React.useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setSubjects(response.data.data || []);
        setLoadingSubjects(false);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data Mapel',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        setLoadingSubjects(false);
      });
  }, [toast]);

  React.useEffect(() => {
    if (filterMapel) {
      setLoadingTeachers(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/${filterMapel}/teachers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          setGuru(response.data.data || []);
          setLoadingTeachers(false);
        })
        .catch((error) => {
          console.error('Error fetching teachers:', error);
          toast({
            title: 'Error',
            description: 'Gagal mengambil data Guru',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
          setLoadingTeachers(false);
        });
    } else {
      setGuru([]); // Reset the guru list when filterMapel is empty
    }
  }, [filterMapel, toast]);

  const handleChangeFilterMapel = (e) => {
    setFilterMapel(e.target.value);
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="List guru" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Guru Mata Pelajaran</h1>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="sort" className="text-sm font-medium text-Gray-700">
                Jenis Mata Pelajaran
              </label>
              <Select placeholder="Pilih Mata Pelajaran" size="md" name="sort" className="" onChange={handleChangeFilterMapel}>
                {loadingSubjects
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <option key={index} value="">
                        <Skeleton height="20px" />
                      </option>
                    ))
                  : subjects.map((subject, index) => (
                      <option key={index} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
              </Select>
            </span>
            <span className="flex flex-col justify-end w-full gap-4">
              <label htmlFor="sort" className="text-sm font-medium text-Gray-700"></label>
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
          <div className="m-3 border rounded-lg shadow-sm ">
            {loadingTeachers ? (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>Nama Guru</Th>
                    <Th>Mata Pelajaran</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
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
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : guru && guru.length > 0 ? (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>Nama Guru</Th>
                    <Th>Mata Pelajaran</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {guru
                    .filter((item) => item.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item, index) => (
                      <Tr key={index}>
                        <Td className="">
                          <div className="flex items-center gap-2">
                            <Image
                              src={`https://ui-avatars.com/api/?name=${item.teacher_name}`}
                              alt="Logo"
                              width={40}
                              height={24}
                              className="rounded-full"
                            />
                            <div className="">
                              <span className="text-sm font-medium text-Gray-900">{item.teacher_name}</span>
                            </div>
                          </div>
                        </Td>
                        <Td>{item.subject_name}</Td>
                        <Td>
                          <SecondaryButton
                            btnClassName="font-semibold w-fit h-fit"
                            onClick={() => router.push(`/materi/literasi/${item.id}`)}
                          >
                            Preview
                          </SecondaryButton>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            ) : (
              <h1 className="text-center text-lg font-semibold text-Gray-600">Data Kosong</h1>
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

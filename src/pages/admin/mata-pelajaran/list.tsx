import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutAdmin/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Table, Thead, Tbody, Tr, Th, Td, Skeleton } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import PrimaryButton from '@/components/PrimaryButton';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';

export default function CreateMataPelajaran() {
  const router = useRouter();
  const [mapel, setMapel] = React.useState([]);
  const [jenisMapelOptions, setJenisMapelOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [jenisMapel, setJenisMapel] = React.useState('');
  const [kelas, setKelas] = React.useState('');
  const [semester, setSemester] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setMapel(response.data.data || []); // Ensure the response data is an array
        setJenisMapelOptions(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMapel = mapel
    .filter((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => (jenisMapel ? item.name === jenisMapel : true))
    .filter((item) => (kelas ? item.kelas === kelas : true))
    .filter((item) => (semester ? item.semester === semester : true));

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Mata Pelajaran</h1>
            <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={() => router.push('/admin/mata-pelajaran/create')}>
              Tambah Mata Pelajaran
            </PrimaryButton>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="jenisMapel" className="text-sm font-medium text-Gray-700">
                Jenis Mata Pelajaran
              </label>
              <Select placeholder="Pilih Jenis" size="md" name="jenisMapel" className="" onChange={(e) => setJenisMapel(e.target.value)}>
                {jenisMapelOptions.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </Select>
            </span>
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="semester" className="text-sm font-medium text-Gray-700">
                Semester
              </label>
              <Select placeholder="Pilih Semester" size="md" name="semester" className="" onChange={(e) => setSemester(e.target.value)}>
                <option value="1 & 2">1 & 2</option>
                <option value="3 & 4">3 & 4</option>
                <option value="5 & 6">5 & 6</option>
              </Select>
            </span>
            <span className="flex flex-col justify-end w-full gap-4">
              <label htmlFor="search" className="text-sm font-medium text-Gray-700"></label>
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
            <Table className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>No</Th>
                  <Th>Nama Mata Pelajaran</Th>
                  <Th>Semester</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
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
                      </Tr>
                    ))
                  : filteredMapel.map((item, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{item.name}</Td>
                        <Td>{item.semester}</Td>
                        <Td>
                          <SecondaryButton
                            size="mini"
                            btnClassName="font-semibold w-fit h-fit"
                            onClick={() =>
                              router.push({
                                pathname: '/admin/mata-pelajaran/edit',
                                query: { item: JSON.stringify(item) }
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
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

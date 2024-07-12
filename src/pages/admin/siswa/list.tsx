import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutAdmin/AuthenticatedLayout';
import Seo from '@/components/Seo';
import {
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Skeleton
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { LuUser } from 'react-icons/lu';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ListSiswa() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [siswa, setSiswa] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    name: '',
    nisn: '',
    address: '',
    birthplace: '',
    birthdate: '',
    gender: '',
    province: '',
    city: '',
    blood_type: '',
    religion: '',
    phone: '',
    parent_phone: '',
    email: ''
  });

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('https://ems-30c1804a223a.herokuapp.com/api/admin/student/all', {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        setSiswa(response.data.data || []); // Ensure `siswa` is an array
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setSiswa([]); // Ensure `siswa` is an array in case of error
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/student/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        toast({
          title: 'Upload Successful',
          description: 'CSV file has been uploaded and processed.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        router.reload();
      } else {
        console.error('Failed to upload CSV');
        toast({
          title: 'Upload Failed',
          description: 'There was an error uploading the CSV file.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading the CSV file.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/student/create`, formData, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        if (response.status === 201) {
          setSiswa((prevSiswa) => [...prevSiswa, response.data.data]);
          toast({
            title: 'Siswa Berhasil Dibuat',
            description: 'Siswa baru telah berhasil dibuat',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          router.reload();
        } else {
          console.error('Failed to create student');
        }
      })
      .catch((error) => {
        console.error('Error creating student:', error);
      });
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="List Siswa" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Akun Siswa</h1>
            <div className="flex gap-3">
              <SecondaryButton size="mini" btnClassName="w-fit h-fit" onClick={() => document.getElementById('csvUpload').click()}>
                Upload CSV
              </SecondaryButton>
              <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={onOpen}>
                Buat Akun
              </PrimaryButton>
              <input type="file" id="csvUpload" style={{ display: 'none' }} accept=".csv" onChange={handleFileChange} />
            </div>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
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
          <div className="m-3 border rounded-lg shadow-sm">
            {loading ? (
              <>
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
              </>
            ) : siswa.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No students found.</p>
              </div>
            ) : (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>Nama Siswa</Th>
                    <Th>Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {siswa
                    .filter((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item, index) => (
                      <Tr key={index}>
                        <Td className="flex items-center gap-2">
                          <Image
                            src={`https://ui-avatars.com/api/?name=${item.name}`}
                            alt="Logo"
                            width={40}
                            height={24}
                            className="rounded-full"
                          />
                          <div className="">
                            <span className="text-sm font-medium text-Gray-900">{item.name}</span>
                          </div>
                        </Td>
                        <Td>{item.email}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            )}
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-full w-[36px] bg-Warning-100">
                <LuUser className="rotate-0 text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Buat Akun Siswa</h1>
              <p className="text-sm font-light text-Gray-600">Buat username dan Password</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 pb-3 mt-3">
                <div className="flex flex-col">
                  <label htmlFor="username" className="text-sm text-Gray-600">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-sm text-Gray-600">
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm text-Gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="nisn" className="text-sm text-Gray-600">
                    NISN
                  </label>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="address" className="text-sm text-Gray-600">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="birthplace" className="text-sm text-Gray-600">
                    Birthplace
                  </label>
                  <input
                    type="text"
                    name="birthplace"
                    value={formData.birthplace}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="birthdate" className="text-sm text-Gray-600">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="gender" className="text-sm text-Gray-600">
                    Gender
                  </label>
                  <Select size={'md'} name="gender" onChange={handleInputChange} value={formData.gender}>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="province" className="text-sm text-Gray-600">
                    Province
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="city" className="text-sm text-Gray-600">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="blood_type" className="text-sm text-Gray-600">
                    Blood Type
                  </label>
                  <Select size={'md'} name="blood_type" onChange={handleInputChange} value={formData.blood_type}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="religion" className="text-sm text-Gray-600">
                    Religion
                  </label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-sm text-Gray-600">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="parent_phone" className="text-sm text-Gray-600">
                    Parent Phone
                  </label>
                  <input
                    type="text"
                    name="parent_phone"
                    value={formData.parent_phone}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm text-Gray-600">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <ModalFooter className="flex justify-center gap-3">
                  <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                    Batal
                  </SecondaryButton>
                  <PrimaryButton type="submit" btnClassName="font-semibold">
                    Konfirmasi
                  </PrimaryButton>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

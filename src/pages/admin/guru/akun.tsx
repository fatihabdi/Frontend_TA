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
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
  useToast
} from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import PrimaryButton from '@/components/PrimaryButton';
import { LuBookOpen } from 'react-icons/lu';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ListGuru() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [guru, setGuru] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    name: '',
    email: ''
  });

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/teacher/all`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        setGuru(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching teachers:', error);
        setGuru([]);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/teacher/create`, formData, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        if (response.status === 201) {
          setGuru((prevGuru) => [...prevGuru, response.data.data]);
          toast({
            title: 'Akun Guru Berhasil Dibuat',
            description: 'Akun guru baru telah berhasil dibuat.',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          onClose();
        } else {
          toast({
            title: 'Error',
            description: 'Gagal membuat akun guru.',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        }
      })
      .catch((error) => {
        console.error('Error creating teacher:', error);
        toast({
          title: 'Error',
          description: 'Gagal membuat akun guru.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/teacher/import`, formData, {
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

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="List guru" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Guru Mata Pelajaran</h1>
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
            ) : (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nama Guru</Th>
                    <Th>Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {guru
                    .filter((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item, index) => (
                      <Tr key={index}>
                        <Td>
                          <Tag colorScheme="blue" borderRadius="full" border={1} size="sm">
                            {item.id.slice(0, 4)}
                          </Tag>
                        </Td>
                        <Td className="">
                          <div className="flex items-center gap-2">
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
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-full w-[36px] bg-Warning-100">
                <LuBookOpen className="rotate-0 text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Buat Akun Guru</h1>
              <p className="text-sm font-light text-Gray-600">Buat Username dan Password</p>
              <form onSubmit={handleCreateTeacher} className="flex flex-col gap-3 pb-3 mt-3">
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
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-sm text-Gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm text-Gray-600">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm text-Gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                    required
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

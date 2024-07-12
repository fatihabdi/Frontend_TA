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
  Skeleton,
  SkeletonText
} from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import PrimaryButton from '@/components/PrimaryButton';
import { LuUser } from 'react-icons/lu';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ListWali() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose } = useDisclosure();
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure();
  const [parent, setParent] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // Add loading state
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    name: '',
    address: '',
    occupation: '',
    phone_number: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/parent/create`, formData, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        if (response.status === 201) {
          toast({
            title: 'Sukses',
            description: 'Berhasil membuat akun wali',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          setFormData({
            username: '',
            password: '',
            name: '',
            address: '',
            occupation: '',
            phone_number: '',
            email: ''
          });
          router.reload();
          onFirstModalClose();
        }
      })
      .catch((error) => {
        console.error('Error creating parent:', error);
        toast({
          title: 'Error',
          description: 'Gagal membuat akun wali',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/parent/all`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        setParent(response.data.data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching parents:', error);
        setLoading(false); // Set loading to false even if there's an error
      });
  }, []);

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/parent/import`, formData, {
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
        <Seo templateTitle="List Wali" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Akun Wali</h1>
            <div className="flex gap-3">
              <SecondaryButton size="mini" btnClassName="w-fit h-fit" onClick={() => document.getElementById('csvUpload').click()}>
                Upload CSV
              </SecondaryButton>
              <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={onFirstModalOpen}>
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
          <div className="m-3 border rounded-lg shadow-sm ">
            {loading ? (
              <>
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
              </>
            ) : parent && parent.length > 0 ? (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>Nama Orang Tua</Th>
                    <Th>Email</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {parent
                    .filter((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item, index) => (
                      <Tr key={index}>
                        <Td className="">
                          <div className="flex items-center gap-2">
                            <Image
                              src={`https://ui-avatars.com/api/?name=${item.name}`}
                              alt="Logo"
                              width={40}
                              height={25}
                              className="rounded-full"
                            />
                            <div className="w-full h-full">
                              <span className="text-sm font-medium text-Gray-900">{item.name}</span>
                            </div>
                          </div>
                        </Td>
                        <Td>{item.email}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            ) : (
              <div className="text-center py-5 text-Gray-600">Tidak ada data orang tua</div>
            )}
          </div>
        </div>
        <Modal isOpen={isFirstModalOpen} onClose={onFirstModalClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-full w-[36px] bg-Warning-100">
                <LuUser className="rotate-0 text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Buat Akun Wali Siswa</h1>
              <p className="text-sm font-light text-Gray-600">Masukkan detail akun</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 pb-3 mt-3">
                <div className="flex flex-col">
                  <label htmlFor="username" className="text-sm text-Gray-600">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
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
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm text-Gray-600">
                    Nama
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="address" className="text-sm text-Gray-600">
                    Alamat
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="occupation" className="text-sm text-Gray-600">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone_number" className="text-sm text-Gray-600">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm text-Gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <ModalFooter className="flex justify-center gap-3">
                  <SecondaryButton onClick={onFirstModalClose} btnClassName="font-semibold">
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
        <Modal isOpen={isSecondModalOpen} onClose={onSecondModalClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-full w-[36px] bg-Warning-100">
                <LuUser className="rotate-0 text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Buat Akun Wali Siswa</h1>
              <p className="text-sm font-light text-Gray-600">Masukkan detail akun</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 pb-3 mt-3">
                <div className="flex flex-col">
                  <label htmlFor="username" className="text-sm text-Gray-600">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
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
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm text-Gray-600">
                    Nama
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="address" className="text-sm text-Gray-600">
                    Alamat
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="occupation" className="text-sm text-Gray-600">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone_number" className="text-sm text-Gray-600">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm text-Gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
                <ModalFooter className="flex justify-center gap-3">
                  <SecondaryButton onClick={onSecondModalClose} btnClassName="font-semibold">
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

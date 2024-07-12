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
import SecondaryButton from '@/components/SecondaryButton';
import { FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import PrimaryButton from '@/components/PrimaryButton';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import { LuBookOpen } from 'react-icons/lu';

export default function ListSiswa() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [students, setStudents] = React.useState([]);
  const [filteredStudents, setFilteredStudents] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [loadingStudents, setLoadingStudents] = React.useState(true);
  const [classes, setClasses] = React.useState([]);
  const [filteredClass, setFilteredClass] = React.useState([]);
  const [searchTerm2, setSearchTerm2] = React.useState('');
  const [selectedClass, setSelectedClass] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/student/all`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
        setLoadingStudents(false);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setLoadingStudents(false);
      });
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/class/all`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        setClasses(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) => student.name.toLowerCase().includes(e.target.value.toLowerCase()));
      setFilteredStudents(filtered);
    }
  };

  React.useEffect(() => {
    // Filter classes based on search term
    if (searchTerm2) {
      const filtered = classes.filter((classItem) => classItem.name.toLowerCase().includes(searchTerm2.toLowerCase()));
      setFilteredClass(filtered);
    } else {
      setFilteredClass([]);
    }
  }, [searchTerm2, classes]);

  const handleSelectClass = (classItem) => {
    if (selectedClass) {
      toast({
        title: 'Error',
        description: 'Hanya dapat memilih 1 kelas. Mohon hapus salah satu kelas',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    setSelectedClass(classItem);
  };

  const handleSearchChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm2(e.target.value);
  };

  const handleRemoveClass = () => {
    setSelectedClass(null);
  };

  const handleAssignClass = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  const handleSubmitAssignment = async () => {
    if (!selectedClass || !selectedStudent) {
      toast({
        title: 'Error',
        description: 'Please select a class and student.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/class/${selectedClass.id}/students`,
        {
          student_id: selectedStudent.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        toast({
          title: 'Assignment Successful',
          description: 'Class has been assigned successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onClose(); // Close the modal
        setSelectedClass(null); // Clear selected class
      } else {
        toast({
          title: 'Error',
          description: 'Failed to assign class.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error posting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign class due to an error.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="List Siswa" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Siswa</h1>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
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
          <div className="m-3 border rounded-lg shadow-sm ">
            {loadingStudents ? (
              <>
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
                <Skeleton height="40px" my="10px" />
              </>
            ) : students && students.length > 0 ? (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>Nama Siswa</Th>
                    <Th>Email</Th>
                    <Th>Kelas</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredStudents
                    .filter((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item, index) => (
                      <Tr key={index}>
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
                        <Td>{item.class_name ? item.class_name : '-'}</Td>
                        <Td>
                          <SecondaryButton size="mini" btnClassName="font-semibold w-fit h-fit" onClick={() => handleAssignClass(item)}>
                            Assign Kelas
                          </SecondaryButton>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            ) : (
              <div className="text-center py-5 text-Gray-600">Tidak ada data siswa</div>
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
              <h1 className="text-lg font-semibold">Assign Kelas</h1>
              <p className="text-sm font-light text-Gray-600">Pilih kelas untuk siswa</p>
              <form action="" className="pb-3 mt-3">
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm2}
                      onChange={handleSearchChange2}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
                      placeholder="Search"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiSearch />
                    </div>
                  </div>
                  <div className="flex flex-col py-3 overflow-y-auto h-fit">
                    {filteredClass.length > 0 ? (
                      filteredClass.map((classItem, index) => (
                        <div
                          className="flex items-center w-full gap-3 px-8 py-4 border-b justify-between border-Gray-200 cursor-pointer"
                          key={index}
                          onClick={() => handleSelectClass(classItem)}
                        >
                          <h1>{classItem.name}</h1>
                        </div>
                      ))
                    ) : (
                      <div className="hidden"></div>
                    )}
                  </div>
                </div>
              </form>
              <div className="flex flex-col py-3 overflow-y-auto h-fit">
                {selectedClass ? (
                  <div className="flex items-center w-full gap-3 px-8 py-4 border-b justify-between border-Gray-200">
                    <h1>{selectedClass.name}</h1>
                    <MdClose className="cursor-pointer text-Gray-500" onClick={handleRemoveClass} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-sm text-Gray-500">Belum ada kelas yang dipilih</span>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleSubmitAssignment} btnClassName="font-semibold">
                Konfirmasi
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

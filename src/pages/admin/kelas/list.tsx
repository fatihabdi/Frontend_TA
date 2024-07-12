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
import { MdClose } from 'react-icons/md';

interface Teacher {
  id: number;
  teacher_name: string;
  email: string;
}

export default function ListKelas() {
  const { isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose } = useDisclosure();
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure();
  const toast = useToast();
  const [filteredTeachers, setFilteredTeachers] = React.useState<Teacher[] | null>(null);
  const [selectedTeachers, setSelectedTeachers] = React.useState<Teacher[]>([]);
  const [kelas, setKelas] = React.useState([]);
  const [searchTerm2, setSearchTerm2] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [newClassName, setNewClassName] = React.useState('');
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = React.useState<string | null>(null);
  const [teachers, setTeachers] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedKelasFilter, setSelectedKelasFilter] = React.useState('');

  React.useEffect(() => {
    const fetchClassesAndStudents = async () => {
      const token = localStorage.getItem('token');
      setLoading(true);

      try {
        const { data: classData } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/class/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch student counts for each class
        const studentCountsPromises = classData.data.map(
          (item) =>
            axios
              .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/class/${item.id}/students`, {
                headers: { Authorization: `Bearer ${token}` }
              })
              .catch((e) => ({ data: { data: [] } })) // Provide an empty array as fallback
        );
        const studentCounts = await Promise.all(studentCountsPromises);

        // Combine class data with student counts
        const classesWithStudents = classData.data.map((item, index) => ({
          ...item,
          jumlahsiswa: studentCounts[index].data.data ? studentCounts[index].data.data.length : 0 // Use conditional checking
        }));

        setKelas(classesWithStudents || []); // Ensure `kelas` is an array
      } catch (error) {
        console.error('Error fetching classes or students:', error);
        setKelas([]); // Ensure `kelas` is an array in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchClassesAndStudents();
  }, []);

  React.useEffect(() => {
    const fetchTeachers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/teacher/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeachers(response.data.data || []); // Ensure `teachers` is an array
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setTeachers([]); // Ensure `teachers` is an array in case of error
      }
    };

    fetchTeachers();
  }, []);

  const handleCreateClass = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:3001/api/admin/class/create',
        { Name: newClassName },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201) {
        toast({
          title: 'Class Created',
          description: 'Class has been created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        setNewClassName('');
        onFirstModalClose();
        // Refresh class list
        const { data: classData } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/class/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setKelas(classData.data || []); // Ensure `kelas` is an array
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create class.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: 'Error',
        description: 'Failed to create class due to an error.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleAssignHomeroomTeacher = async () => {
    const token = localStorage.getItem('token');
    if (!selectedClassId || !selectedTeacherId) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/class/${selectedClassId}/assign-homeroom-teacher`,
        { teacher_id: selectedTeacherId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        toast({
          title: 'Teacher Assigned',
          description: 'Homeroom teacher has been assigned successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onSecondModalClose();
        // Refresh class list
        const { data: classData } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/class/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setKelas(classData.data || []); // Ensure `kelas` is an array
      } else {
        toast({
          title: 'Error',
          description: 'Failed to assign homeroom teacher.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error assigning homeroom teacher:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign homeroom teacher due to an error.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleSelectTeacher = (teacher: Teacher) => {
    setSelectedTeachers((prev) => {
      const isAlreadySelected = prev.find((t) => t.id === teacher.id);
      if (isAlreadySelected) {
        return prev.filter((t) => t.id !== teacher.id); // Remove from selection
      } else {
        return [...prev, teacher]; // Add to selection
      }
    });
    setSearchTerm2(''); // Reset search term after selecting a teacher
    setFilteredTeachers(null); // Reset filtered teachers after selecting a teacher
  };

  const handleSearchChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm2(value);
    if (value) {
      setFilteredTeachers(teachers.filter((teacher) => teacher.name.toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilteredTeachers(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKelasFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKelasFilter(e.target.value);
  };

  const filteredKelas = kelas
    .filter((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => (selectedKelasFilter ? item.name === selectedKelasFilter : true));

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="List Kelas" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Kelas</h1>
            <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={onFirstModalOpen}>
              Buat Kelas
            </PrimaryButton>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="sort" className="text-sm font-medium text-Gray-700">
                Kelas
              </label>
              <Select placeholder="Kelas" size="md" name="sort" className="" onChange={handleKelasFilterChange}>
                {kelas.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
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
            {loading ? (
              <Skeleton height="20px" count={5} />
            ) : (
              <Table className="mt-4">
                <Thead>
                  <Tr>
                    <Th>Nama Kelas</Th>
                    <Th>Jumlah Siswa</Th>
                    <Th>Wali Kelas</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredKelas.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.name}</Td>
                      <Td>{item.jumlahsiswa}</Td>
                      <Td>
                        {item.homeRoomTeacher ? (
                          <div className="flex items-center gap-2">
                            <Image
                              src={`https://ui-avatars.com/api/?name=${item.homeRoomTeacher}&size=35&background=random&color=fff`}
                              alt="Guru"
                              width={35}
                              height={35}
                              className="rounded-full"
                            />
                            <span>{item.homeRoomTeacher}</span>
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </Td>
                      <Td>
                        <SecondaryButton
                          size="mini"
                          onClick={() => {
                            setSelectedClassId(item.id);
                            onSecondModalOpen();
                          }}
                          btnClassName="w-fit h-fit text-sm py-2"
                        >
                          Assign Guru
                        </SecondaryButton>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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
              <h1 className="text-lg font-semibold">Buat Kelas</h1>
              <p className="text-sm font-light text-Gray-600">Buat Nama Kelas disini</p>
              <form action="" className="flex flex-col gap-3 pb-3 mt-3">
                <div className="flex flex-col">
                  <label htmlFor="class-name" className="text-sm text-Gray-600">
                    Nama Kelas
                  </label>
                  <input
                    type="text"
                    name="class-name"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onFirstModalClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleCreateClass} btnClassName="font-semibold">
                Konfirmasi
              </PrimaryButton>
            </ModalFooter>
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
              <h1 className="text-lg font-semibold">Assign Wali Kelas</h1>
              <p className="text-sm font-light text-Gray-600">Assign Wali Kelas disini</p>
              <form action="" className="flex flex-col gap-3 pb-3 mt-3">
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
                    {filteredTeachers && filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher, index) => (
                        <div
                          className="flex items-center w-full gap-3 px-8 py-4 border-b justify-between border-Gray-200 cursor-pointer"
                          key={index}
                          onClick={() => handleSelectTeacher(teacher)}
                        >
                          <div className="flex items-center w-full gap-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${teacher.name}&background=random`}
                              alt="Profile"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-Gray-900">{teacher.name}</span>
                              <span className="text-xs text-Gray-500">{teacher.email}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="hidden"></div>
                    )}
                  </div>
                </div>
              </form>
              <div className="flex flex-col py-3 overflow-y-auto h-fit">
                {selectedTeachers.length > 0 ? (
                  selectedTeachers.map((teacher, index) => (
                    <div className="flex items-center w-full gap-3 px-8 py-4 border-b justify-between border-Gray-200" key={index}>
                      <div className="flex items-center w-full gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${teacher.name}&background=random`}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-Gray-900">{teacher.name}</span>
                          <span className="text-xs text-Gray-500">{teacher.email}</span>
                        </div>
                      </div>
                      <MdClose className="cursor-pointer text-Gray-500" onClick={() => handleSelectTeacher(teacher)} />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-sm text-Gray-500">Belum ada guru yang dipilih</span>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onSecondModalClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleAssignHomeroomTeacher} btnClassName="font-semibold">
                Konfirmasi
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

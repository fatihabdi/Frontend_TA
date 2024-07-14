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
  Avatar,
  AvatarGroup,
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
import PrimaryButton from '@/components/PrimaryButton';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import { LuBookOpen } from 'react-icons/lu';

interface Teacher {
  id: number;
  teacher_name: string;
  email: string;
}

interface Subject {
  id: number;
  name: string;
  semester: number;
  jenis_mapel: string;
  teachers?: Teacher[];
}

export default function AssignGuruPengajar() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();
  const [mapel, setMapel] = React.useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchTerm2, setSearchTerm2] = React.useState('');
  const [guruAll, setGuruAll] = React.useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = React.useState<Teacher[] | null>(null);
  const [selectedTeachers, setSelectedTeachers] = React.useState<Teacher[]>([]);
  const [currentSubjectId, setCurrentSubjectId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingTeachers, setLoadingTeachers] = React.useState<Record<number, boolean>>({});
  const [jenisMapelOptions, setJenisMapelOptions] = React.useState<string[]>([]);
  const [selectedJenisMapel, setSelectedJenisMapel] = React.useState('');
  const [selectedSemester, setSelectedSemester] = React.useState('');
  const [currentSubjectTeachers, setCurrentSubjectTeachers] = React.useState<Teacher[]>([]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/teacher/all`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        setGuruAll(response.data.data || []);
      })
      .catch((error) => {
        console.error('Error fetching teachers:', error);
      });
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/all`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(async (response) => {
        const subjects: Subject[] = response.data.data || [];
        setMapel(subjects);

        setJenisMapelOptions(subjects.map((subject) => subject.name));
        setLoading(false);

        // Fetch teachers for each subject
        subjects.forEach((subject) => {
          fetchTeachersForSubject(subject.id);
        });
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      });
  }, []);

  const fetchTeachersForSubject = async (subjectId: number) => {
    const token = localStorage.getItem('token');
    setLoadingTeachers((prev) => ({ ...prev, [subjectId]: true }));
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/${subjectId}/teachers`, {
        headers: {
          Authorization: `${token}`
        }
      });
      const teachers = response.data.data || [];
      setMapel((prevMapel) => prevMapel.map((subject) => (subject.id === subjectId ? { ...subject, teachers } : subject)));
      setLoadingTeachers((prev) => ({ ...prev, [subjectId]: false }));
    } catch (error) {
      console.error(`Error fetching teachers for subject ${subjectId}:`, error);
      setLoadingTeachers((prev) => ({ ...prev, [subjectId]: false }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm2(value);
    if (value) {
      setFilteredTeachers(guruAll.filter((teacher) => teacher.name?.toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilteredTeachers(null);
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

  const handleSubmit = async () => {
    const teacherIds = selectedTeachers.map((teacher) => teacher.id);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/${currentSubjectId}/assign-teacher`,
        {
          teacher_id: teacherIds
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        toast({
          title: 'Assignment Successful',
          description: 'Teachers have been assigned successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onClose(); // Close the modal
        setSelectedTeachers([]); // Clear selected teachers
        fetchTeachersForSubject(currentSubjectId); // Refresh the list of teachers for the subject
      } else {
        toast({
          title: 'Error',
          description: 'Failed to assign teachers.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error posting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign teachers due to an error.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleOpenRemoveModal = (subjectId: number) => {
    const subject = mapel.find((item) => item.id === subjectId);
    if (subject && subject.teachers) {
      setCurrentSubjectTeachers(subject.teachers);
    } else {
      setCurrentSubjectTeachers([]);
    }
    setCurrentSubjectId(subjectId);
    onRemoveOpen();
  };

  const handleRemoveTeacher = async (teacherId: number) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/teacher/${teacherId}/${currentSubjectId}/remove-teacher`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        toast({
          title: 'Removal Successful',
          description: 'Teacher has been removed successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        fetchTeachersForSubject(currentSubjectId); // Refresh the list of teachers for the subject
        onRemoveClose(); // Close the modal
      } else {
        toast({
          title: 'Error',
          description: 'Failed to remove teacher.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error removing teacher:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove teacher due to an error.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const filteredMapel = mapel
    .filter((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => (selectedJenisMapel ? item.name === selectedJenisMapel : true))
    .filter((item) => (selectedSemester ? item.semester === parseInt(selectedSemester) : true));

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Assign Guru Pengajar</h1>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="jenisMapel" className="text-sm font-medium text-Gray-700">
                Jenis Mata Pelajaran
              </label>
              <Select
                placeholder="Pilih Jenis"
                size="md"
                name="jenisMapel"
                className=""
                onChange={(e) => setSelectedJenisMapel(e.target.value)}
              >
                {jenisMapelOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </span>

            <span className="flex flex-col w-full gap-4">
              <label htmlFor="semester" className="text-sm font-medium text-Gray-700">
                Semester
              </label>
              <Select
                placeholder="Pilih Semester"
                size="md"
                name="semester"
                className=""
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
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
                  <Th>Guru Pengajar</Th>
                  <Th></Th>
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
                          {loadingTeachers[item.id] ? (
                            <Skeleton height="20px" width="100px" />
                          ) : item.teachers && item.teachers.length > 0 ? (
                            <AvatarGroup size="sm" max={5} className="hidden md:block">
                              {item.teachers.map((teacher, index) => (
                                <Avatar
                                  key={index}
                                  name={teacher.teacher_name}
                                  src={`https://ui-avatars.com/api/?name=${teacher.teacher_name}&background=random`}
                                />
                              ))}
                            </AvatarGroup>
                          ) : (
                            '-'
                          )}
                        </Td>
                        <Td>
                          <SecondaryButton
                            onClick={() => {
                              setCurrentSubjectId(item.id); // Set the current subject ID
                              onOpen(); // Open the modal
                            }}
                            btnClassName="font-semibold w-fit h-fit text-sm py-2 border rounded-md"
                          >
                            Assign Guru
                          </SecondaryButton>
                        </Td>
                        <Td>
                          <SecondaryButton
                            onClick={() => handleOpenRemoveModal(item.id)}
                            btnClassName="font-semibold w-fit h-fit text-sm py-2 border rounded-md"
                          >
                            Remove Guru
                          </SecondaryButton>
                        </Td>
                      </Tr>
                    ))}
              </Tbody>
            </Table>
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
              <h1 className="text-lg font-semibold">Assign Guru Pengajar</h1>
              <p className="text-sm font-light text-Gray-600">Pilih dari search atau list dari daftar guru pengajar</p>
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
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleSubmit} btnClassName="font-semibold">
                Konfirmasi
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isRemoveOpen} onClose={onRemoveClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-full w-[36px] bg-Warning-100">
                <LuBookOpen className="rotate-0 text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Remove Guru Pengajar</h1>
              <p className="text-sm font-light text-Gray-600">Pilih guru pengajar yang ingin dihapus</p>
              <div className="flex flex-col py-3 overflow-y-auto h-fit">
                {currentSubjectTeachers.length > 0 ? (
                  currentSubjectTeachers.map((teacher, index) => (
                    <div className="flex items-center w-full gap-3 px-8 py-4 border-b justify-between border-Gray-200" key={index}>
                      <div className="flex items-center w-full gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${teacher.teacher_name}&background=random`}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-Gray-900">{teacher.teacher_name}</span>
                          <span className="text-xs text-Gray-500">{teacher.email}</span>
                        </div>
                      </div>
                      <MdClose className="cursor-pointer text-Gray-500" onClick={() => handleRemoveTeacher(teacher.id)} />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-sm text-Gray-500">Tidak ada guru untuk dihapus</span>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onRemoveClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

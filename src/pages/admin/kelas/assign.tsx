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
import PrimaryButton from '@/components/PrimaryButton';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import { LuBookOpen } from 'react-icons/lu';
import Image from 'next/image';
import debounce from 'lodash/debounce';

export default function AssignGuruPengajar() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mapel, setMapel] = React.useState([]);
  const [allSubjects, setAllSubjects] = React.useState([]);
  const [allClasses, setAllClasses] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchTerm2, setSearchTerm2] = React.useState('');
  const [guruAll, setGuruAll] = React.useState([]);
  const [filteredTeachers, setFilteredTeachers] = React.useState([]);
  const [selectedTeachers, setSelectedTeachers] = React.useState([]);
  const [currentClassId, setCurrentClassId] = React.useState<string | null>(null);
  const [selectedClass, setSelectedClass] = React.useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = React.useState<string | null>(null);
  const [selectedSubject2, setSelectedSubject2] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [classPrefix, setClassPrefix] = React.useState<string>('VII'); // Initial class prefix

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  });

  React.useEffect(() => {
    // Filter teachers based on search term
    if (searchTerm2) {
      const filtered = guruAll.filter((guru) => guru.name.toLowerCase().includes(searchTerm2.toLowerCase()));
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers([]);
    }
  }, [searchTerm2, guruAll]);

  const handleSelectTeacher = (teacher) => {
    setSelectedTeachers((prev) => {
      const isAlreadySelected = prev.find((t) => t.id === teacher.id);
      if (isAlreadySelected) {
        return prev.filter((t) => t.id !== teacher.id); // Remove from selection
      } else {
        return [...prev, teacher]; // Add to selection
      }
    });
  };

  const handleSearchChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm2(e.target.value);
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/teacher/all`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        setGuruAll(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching teachers:', error);
      });
  }, []);

  React.useEffect(() => {
    const fetchAllSubjects = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/all`, {
          headers: {
            Authorization: `${token}`
          }
        });
        setAllSubjects(response.data.data);
      } catch (error) {
        console.error('Error fetching all subjects:', error);
      }
    };

    const fetchAllClasses = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/class/all`, {
          headers: {
            Authorization: `${token}`
          }
        });
        setAllClasses(response.data.data);
      } catch (error) {
        console.error('Error fetching all classes:', error);
      }
    };

    fetchAllSubjects();
    fetchAllClasses();
  }, []);

  React.useEffect(() => {
    fetchSubjects();
  }, [selectedSubject, classPrefix]);

  const fetchSubjects = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);

    let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/?classPrefix=${classPrefix}`;
    if (selectedSubject) {
      url += `&subjectID=${selectedSubject}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`
        }
      });

      const subjects = response.data.data;
      const subjectsWithTeachers = await Promise.all(
        subjects.map(async (subject) => {
          const teachersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/${subject.subject_id}/teachers`, {
            headers: {
              Authorization: `${token}`
            }
          });
          subject.teachers = teachersResponse.data.data;
          return subject;
        })
      );

      setMapel(subjectsWithTeachers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subjects and teachers:', error);
      setLoading(false);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const handleSubjectChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject2(e.target.value);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  const handleClassPrefixChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassPrefix(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject2 || selectedTeachers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select a class, subject, and at least one teacher.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    const teacherIds = selectedTeachers.map((teacher) => teacher.id);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/class/${selectedClass}/assign-subject`,
        {
          subject_id: selectedSubject2,
          teacher_id: teacherIds[0]
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

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Assign Guru Pengajar</h1>
            <PrimaryButton onClick={onOpen} btnClassName="font-semibold w-fit h-fit" size="mini">
              Assign Mata Pelajaran
            </PrimaryButton>
          </div>
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:justify-between lg:px-3">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="classPrefix" className="text-sm font-medium text-Gray-700">
                Kelas
              </label>
              <Select
                placeholder="Pilih Kelas"
                size="md"
                name="classPrefix"
                className=""
                onChange={handleClassPrefixChange}
                value={classPrefix}
              >
                <option value="VII">VII</option>
                <option value="VIII">VIII</option>
                <option value="IX">IX</option>
              </Select>
            </span>
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="subject" className="text-sm font-medium text-Gray-700">
                Mata Pelajaran
              </label>
              <Select placeholder="Semua" size="md" name="subject" className="" onChange={handleSubjectChange}>
                {allSubjects.map((subject, index) => (
                  <option key={index} value={subject.id}>
                    {subject.name}
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
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                  <Th>Kelas</Th>
                  <Th>Nama Mata Pelajaran</Th>
                  <Th>Guru Pengajar</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
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
                ) : (
                  mapel
                    .filter((item) => item.subject.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.class_name}</Td>
                        <Td>{item.subject}</Td>
                        <Td>
                          {item.teacher && item.teacher.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <Image
                                src={`https://ui-avatars.com/api/?name=${item.teacher}&size=35&background=random&color=fff`}
                                alt="Guru"
                                width={35}
                                height={35}
                                className="rounded-full"
                              />
                              <span>{item.teacher}</span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </Td>
                      </Tr>
                    ))
                )}
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
              <form action="" className="pb-3 flex flex-col gap-3 mt-3">
                <div className="flex flex-col gap-3">
                  <label htmlFor="search" className="text-sm font-medium text-Gray-700">
                    Pilih Kelas
                  </label>
                  <Select placeholder="Pilih Kelas" size="md" className="" onChange={handleClassChange}>
                    {allClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="search" className="text-sm font-medium text-Gray-700">
                    Pilih Mata Pelajaran
                  </label>
                  <Select placeholder="Pilih Mata Pelajaran" size="md" className="" onChange={handleSubjectChange2}>
                    {allSubjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="search" className="text-sm font-medium text-Gray-700">
                    Pilih Guru Pengajar
                  </label>
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
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher) => (
                        <div
                          key={teacher.id}
                          className="flex items-center w-full gap-3 px-8 py-4 border-b justify-between border-Gray-200 cursor-pointer"
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
                  selectedTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center w-full gap-3 px-8 py-4 border-b justify-between border-Gray-200">
                      <div className="flex items-center w-full gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${teacher.name}&background=random`}
                          alt=" Profile"
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
      </AuthenticatedLayout>
    </div>
  );
}

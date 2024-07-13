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
import { useRouter } from 'next/router';

export default function ListWali() {
  const toast = useToast();
  const router = useRouter();
  const { isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose } = useDisclosure();
  const [parent, setParent] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [filteredStudents, setFilteredStudents] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchTermModal, setSearchTermModal] = React.useState('');
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [selectedParent, setSelectedParent] = React.useState(null);
  const [loadingParents, setLoadingParents] = React.useState(true);
  const [loadingStudents, setLoadingStudents] = React.useState(true);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/student/all`, {
        headers: {
          Authorization: localStorage.getItem('token')
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
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/parent/all`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        setParent(response.data.data);
        setLoadingParents(false);
      })
      .catch((error) => {
        console.error('Error fetching parents:', error);
        setLoadingParents(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchChangeModal = (e) => {
    setSearchTermModal(e.target.value);
    if (e.target.value === '') {
      setFilteredStudents([]);
    } else {
      const filtered = students.filter((student) => student.name.toLowerCase().includes(e.target.value.toLowerCase()));
      setFilteredStudents(filtered);
    }
  };

  const handleAssignStudent = (parent) => {
    setSelectedParent(parent);
    onFirstModalOpen();
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

  const handleRemoveStudent = (parent, student) => {
    if (!parent || !student) {
      console.error('Parent or student is null or undefined');
      return;
    }

    const token = localStorage.getItem('token');
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/parent/${parent}/${student}/remove-student`, {
        headers: {
          Authorization: token
        }
      })
      .then(() => {
        toast({
          title: 'Siswa berhasil dihapus dari wali',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        router.reload();
      })
      .catch((error) => {
        console.error('Error removing student:', error);
        toast({
          title: 'Gagal menghapus siswa dari wali',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      });
  };

  const handleSubmitAssignment = () => {
    if (!selectedParent || !selectedStudent) {
      console.error('Selected parent or student is null or undefined');
      return;
    }

    const token = localStorage.getItem('token');
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/parent/assign-student`,
        {
          parent_id: selectedParent.id,
          student_id: selectedStudent.id
        },
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then((response) => {
        console.log(response);
        toast({
          title: 'Siswa berhasil diassign',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        onFirstModalClose();
      })
      .catch((error) => {
        console.error('Error assigning student:', error);
        toast({
          title: 'Gagal mengassign siswa',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      });
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="List Wali" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex items-center justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Akun Wali</h1>
            <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={() => onFirstModalOpen()}>
              Buat Akun
            </PrimaryButton>
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
            {loadingParents ? (
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
                    <Th>Nama Siswa</Th>
                    <Th></Th>
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
                              height={24}
                              className="rounded-full"
                            />
                            <div className="">
                              <span className="text-sm font-medium text-Gray-900">{item.name}</span>
                            </div>
                          </div>
                        </Td>
                        <Td>{item.email}</Td>
                        <Td>{item.student_name ? item.student_name : '-'}</Td>
                        <Td>
                          <SecondaryButton size="mini" btnClassName="font-semibold w-fit h-fit" onClick={() => handleAssignStudent(item)}>
                            Assign Siswa
                          </SecondaryButton>
                        </Td>
                        <Td>
                          <SecondaryButton
                            size="mini"
                            btnClassName="font-semibold w-fit h-fit"
                            onClick={() => handleRemoveStudent(item.id, item.student_id)}
                          >
                            Remove Siswa
                          </SecondaryButton>
                        </Td>
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
                <LuBookOpen className="rotate-0 text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Assign Siswa</h1>
              <p className="text-sm font-light text-Gray-600">Pilih dari search atau list dari daftar siswa</p>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchTermModal}
                  onChange={handleSearchChangeModal}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
                  placeholder="Search"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiSearch />
                </div>
              </div>
              <div className="flex flex-col py-3 overflow-y-auto max-h-48">
                {loadingStudents ? (
                  <>
                    <Skeleton height="40px" my="10px" />
                    <Skeleton height="40px" my="10px" />
                    <Skeleton height="40px" my="10px" />
                    <Skeleton height="40px" my="10px" />
                    <Skeleton height="40px" my="10px" />
                  </>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center w-full gap-3 px-8 py-4 border-b justify-between border-Gray-200 cursor-pointer ${
                        selectedStudent && selectedStudent.id === item.id ? 'bg-Gray-100' : ''
                      }`}
                      onClick={() => handleSelectStudent(item)}
                    >
                      <div className="flex items-center w-full gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${item.name}&background=random`}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-Gray-900">{item.name}</span>
                          <span className="text-xs text-Gray-500">{item.email}</span>
                        </div>
                      </div>
                      {selectedStudent && selectedStudent.id === item.id && (
                        <MdClose className="cursor-pointer text-Gray-500" onClick={() => handleSelectStudent(null)} />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-Gray-500">Tidak ada data siswa</div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onFirstModalClose} btnClassName="font-semibold">
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

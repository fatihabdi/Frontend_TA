import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import {
  Select,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Input
} from '@chakra-ui/react';
import { FiSearch, FiEdit, FiDownloadCloud, FiUploadCloud } from 'react-icons/fi';
import { PiFlagBannerBold, PiEye } from 'react-icons/pi';
import { useRouter } from 'next/router';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import axios from 'axios';

export default function List() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [kuis, setKuis] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [selectedClassForImport, setSelectedClassForImport] = React.useState('');
  const [file, setFile] = React.useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    judul: '',
    deskripsi: '',
    type: '',
    deadline: '',
    subject: '',
    class: ''
  });

  const [editingQuiz, setEditingQuiz] = React.useState(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const newQuiz = {
      id: new Date().getTime().toString(),
      title: formData.judul,
      type_of_quiz: formData.type,
      description: formData.deskripsi,
      deadline: `${formData.deadline}T23:59:59Z`,
      subject: formData.subject,
      class: formData.class,
      questions: []
    };
    localStorage.setItem('class_id', formData.class);
    localStorage.setItem('subject_id', formData.subject);
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    quizzes.push(newQuiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));

    toast({
      title: 'Success',
      description: 'Quiz created successfully',
      status: 'success',
      duration: 5000,
      isClosable: true
    });
    onClose();
    setFormData({
      judul: '',
      deskripsi: '',
      type: '',
      deadline: '',
      subject: '',
      class: ''
    });

    router.push('/guru/kuis/create');
  };

  const handleEdit = (quiz) => {
    setFormData({
      judul: quiz.title,
      deskripsi: quiz.description,
      type: quiz.type_of_quiz,
      deadline: quiz.deadline.split('T')[0],
      subject: quiz.subject,
      class: quiz.class_id
    });
    setEditingQuiz(quiz);
    onEditOpen();
  };

  const handleUpdate = async () => {
    const updatedQuiz = {
      title: formData.judul,
      type_of_quiz: formData.type,
      description: formData.deskripsi,
      deadline: `${formData.deadline}T23:59:59Z`,
      subject: formData.subject,
      class: formData.class
    };

    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${editingQuiz.id}/update`, updatedQuiz, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Quiz updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onEditClose();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update quiz',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quiz',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleDownload = async (quizId: string, quizTitle: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${quizId}/export`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${quizId}_${quizTitle}.json`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Success',
          description: 'Quiz downloaded successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to download quiz',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download quiz',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = async () => {
    if (!file || !selectedClassForImport) {
      toast({
        title: 'Error',
        description: 'Please select a class and a file to import',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${selectedClassForImport}/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        toast({
          title: 'Success',
          description: 'Quiz imported successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onImportClose();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to import quiz',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import quiz',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setKuis(response.data.data);
        } else {
          setKuis([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });

    // Fetch class and subject data
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          const classData = response.data.data;
          setClasses(classData);

          const uniqueSubjects = [];
          classData.forEach((cls) => {
            if (!uniqueSubjects.some((sub) => sub.subject_id === cls.subject_id)) {
              uniqueSubjects.push({ subject_id: cls.subject_id, subject_name: cls.subject_name });
            }
          });
          setSubjects(uniqueSubjects);
        } else {
          setClasses([]);
          setSubjects([]);
        }
      })
      .catch((error) => {
        setClasses([]);
        setSubjects([]);
      });
  }, []);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  // Filter quizzes based on search term, selected class, and selected subject
  const filteredKuis = kuis
    .filter((quiz) => quiz.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((quiz) => !selectedClass || quiz.class_id === selectedClass)
    .filter((quiz) => !selectedSubject || quiz.subject_id === selectedSubject);

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="List Kuis" />
        <div className="w-full rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-5 lg:flex-row lg:items-center">
            <h1 className="font-semibold">List Kuis</h1>
            <div className="flex items-center justify-between gap-5">
              <div className="relative w-full">
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
              <Select placeholder="Kelas" size="md" className="w-fit" onChange={handleClassChange}>
                {classes.map((cls, index) => (
                  <option key={index} value={cls.class_name}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
              <Select placeholder="Mata Pelajaran" size="md" className="w-fit" onChange={handleSubjectChange}>
                {subjects.map((sub, index) => (
                  <option key={index} value={sub.subject_name}>
                    {sub.subject_name}
                  </option>
                ))}
              </Select>
              <SecondaryButton size="mini" leftIcon={<FiUploadCloud />} onClick={onImportOpen} btnClassName="w-fit text-sm h-fit">
                Import
              </SecondaryButton>
              <PrimaryButton size="mini" btnClassName="w-fit text-sm h-fit" onClick={onOpen}>
                Buat Kuis
              </PrimaryButton>
            </div>
          </div>

          <TableContainer className="p-5">
            <Table variant="simple" className="border">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Assign Kelas</Th>
                  <Th>Nama Materi</Th>
                  <Th>Mata Pelajaran</Th>
                  <Th>Deadline</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center">
                      <Spinner size="xl" />
                    </Td>
                  </Tr>
                ) : filteredKuis.length > 0 ? (
                  filteredKuis.map((quiz) => (
                    <Tr key={quiz.id}>
                      <Td>{quiz.id.slice(0, 4)}</Td>
                      <Td>{quiz.class_id}</Td>
                      <Td>{quiz.title}</Td>
                      <Td>{quiz.subject_id}</Td>
                      <Td>{new Date(quiz.deadline).toLocaleDateString()}</Td>
                      <Td>
                        <IconButton
                          aria-label="Download"
                          icon={<FiDownloadCloud />}
                          onClick={() => handleDownload(quiz.id, quiz.title)}
                          variant="ghost"
                        />
                        <IconButton
                          aria-label="Preview"
                          icon={<PiEye />}
                          onClick={() => router.push(`/guru/kuis/edit/${quiz.id}`)}
                          variant="ghost"
                        />
                        <IconButton aria-label="Edit" icon={<FiEdit />} onClick={() => handleEdit(quiz)} variant="ghost" />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center">
                      Tidak ada kuis ditemukan
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
                <PiFlagBannerBold className="rotate-0" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Buat Kuis</h1>
              <p className="text-sm font-light text-Gray-600">Sesuaikan dengan mata pelajaran dan topik yang akan dibahas</p>
              <form className="mt-3">
                <label htmlFor="subject" className="text-sm text-Gray-600">
                  Pilih Spesifik Mata Pelajaran
                </label>
                <Select
                  id="subject"
                  name="subject"
                  placeholder="Pilih Mata Pelajaran"
                  size="md"
                  className="w-fit mt-2 mb-2"
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  {subjects.map((sub, index) => (
                    <option key={index} value={sub.subject_id}>
                      {sub.subject_name}
                    </option>
                  ))}
                </Select>
                <label htmlFor="judul" className="text-sm text-Gray-600">
                  Judul
                </label>
                <input
                  type="text"
                  id="judul"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <label htmlFor="deskripsi" className="text-sm text-Gray-600">
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="cth. Buat artikel mengenai keluarga dalam bahasa inggris..."
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <div className="flex flex-col mt-2 mb-2">
                  <label htmlFor="type" className="text-sm text-Gray-600">
                    Tipe Kuis
                  </label>
                  <Select id="type" name="type" placeholder="Pilih Tipe" size="md" value={formData.type} onChange={handleInputChange}>
                    <option value="Multiple Choice">Pilihan Ganda</option>
                    <option value="Essay">Essay</option>
                  </Select>
                </div>
                <label htmlFor="deadline" className="text-sm text-Gray-600">
                  Set Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                />
                <label htmlFor="class" className="text-sm text-Gray-600">
                  Pilih Spesifik Kelas
                </label>
                <Select
                  id="class"
                  name="class"
                  placeholder="Pilih Kelas"
                  size="md"
                  className="w-fit mt-2 mb-2"
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                >
                  {classes.map((cls, index) => (
                    <option key={index} value={cls.class_id}>
                      {cls.class_name}
                    </option>
                  ))}
                </Select>
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleSubmit} btnClassName="font-semibold">
                Buat Kuis
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
                <PiFlagBannerBold className="rotate-0" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Edit Kuis</h1>
              <p className="text-sm font-light text-Gray-600">Sesuaikan dengan mata pelajaran dan topik yang akan dibahas</p>
              <form className="mt-3">
                <label htmlFor="subject" className="text-sm text-Gray-600">
                  Pilih Spesifik Mata Pelajaran
                </label>
                <Select
                  id="subject"
                  name="subject"
                  placeholder="Pilih Mata Pelajaran"
                  size="md"
                  className="w-fit mt-2 mb-2"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  {subjects.map((sub, index) => (
                    <option key={index} value={sub.subject_id}>
                      {sub.subject_name}
                    </option>
                  ))}
                </Select>
                <label htmlFor="judul" className="text-sm text-Gray-600">
                  Judul
                </label>
                <input
                  type="text"
                  id="judul"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <label htmlFor="deskripsi" className="text-sm text-Gray-600">
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="cth. Buat artikel mengenai keluarga dalam bahasa inggris..."
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <div className="flex flex-col mt-2 mb-2">
                  <label htmlFor="type" className="text-sm text-Gray-600">
                    Tipe Kuis
                  </label>
                  <Select id="type" name="type" placeholder="Pilih Tipe" size="md" value={formData.type} onChange={handleInputChange}>
                    <option value="Multiple Choice">Pilihan Ganda</option>
                    <option value="Essay">Essay</option>
                  </Select>
                </div>
                <label htmlFor="deadline" className="text-sm text-Gray-600">
                  Set Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-200"
                />
                <label htmlFor="class" className="text-sm text-Gray-600">
                  Pilih Spesifik Kelas
                </label>
                <Select
                  id="class"
                  name="class"
                  placeholder="Pilih Kelas"
                  size="md"
                  className="w-fit mt-2 mb-2"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                >
                  {classes.map((cls, index) => (
                    <option key={index} value={cls.class_id}>
                      {cls.class_name}
                    </option>
                  ))}
                </Select>
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onEditClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleUpdate} btnClassName="font-semibold">
                Update Kuis
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isImportOpen} onClose={onImportClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
                <PiFlagBannerBold className="rotate-0" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Import Kuis</h1>
              <p className="text-sm font-light text-Gray-600">Pilih kelas dan file untuk diimport</p>
              <form className="mt-3">
                <label htmlFor="kelas" className="text-sm text-Gray-600">
                  Pilih Kelas
                </label>
                <Select
                  placeholder="Kelas"
                  size="md"
                  className="w-fit mt-2 mb-2"
                  onChange={(e) => setSelectedClassForImport(e.target.value)}
                >
                  {classes.map((cls, index) => (
                    <option key={index} value={cls.class_id}>
                      {cls.class_name}
                    </option>
                  ))}
                </Select>
                <label htmlFor="file" className="text-sm text-Gray-600 mt-2 mb-2">
                  Pilih File
                </label>
                <Input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="w-full mt-2 mb-2 p-1 border-2 rounded-md border-Gray-300"
                />
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onImportClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleImportSubmit} btnClassName="font-semibold">
                Import
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

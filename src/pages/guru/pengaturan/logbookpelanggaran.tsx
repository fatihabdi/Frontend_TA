import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import {
  Select,
  Table,
  Thead,
  Tr,
  Tbody,
  Th,
  Td,
  Tag,
  TagLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Button,
  Spinner
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import SecondaryButton from '@/components/SecondaryButton';
import PrimaryButton from '@/components/PrimaryButton';
import { FaFilePdf } from 'react-icons/fa';
import { PiFlagBannerBold } from 'react-icons/pi';
import { FiInfo } from 'react-icons/fi';

export default function Pelanggaran() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [violations, setViolations] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    student_id: '',
    sk: '',
    start_punishment: '',
    end_punishment: '',
    documents: '',
    reason: ''
  });

  React.useEffect(() => {
    const fetchClassesAndViolations = async () => {
      const token = localStorage.getItem('token');
      try {
        const [classesResponse, violationsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/violation/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const uniqueClasses = classesResponse.data.data.filter(
          (cls, index, self) => self.findIndex((c) => c.class_name === cls.class_name) === index
        );

        setClasses(uniqueClasses || []);
        setViolations(violationsResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching classes and violations:', error);
      }
    };

    fetchClassesAndViolations();
  }, []);

  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
    setLoading(true);

    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/students/${selectedClass}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/teacher/violation/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose();
    } catch (error) {
      console.error('Error creating violation:', error);
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Pelanggaran" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Daftar Pelanggaran Siswa</h1>
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <Select placeholder="Kelas" size="md" onChange={handleClassChange}>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
              <PrimaryButton onClick={onOpen} btnClassName="font-semibold w-full lg:w-fit h-fit">
                Buat Baru
              </PrimaryButton>
            </div>
          </div>
          <div className="m-3 border rounded-lg shadow-sm ">
            <Table className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Nama Siswa</Th>
                  <Th>NIS</Th>
                  <Th>SK Pelanggaran</Th>
                  <Th>Mulai Hukuman</Th>
                  <Th>Selesai Hukuman</Th>
                  <Th>Surat Keputusan</Th>
                  <Th>Alasan</Th>
                </Tr>
              </Thead>
              <Tbody>
                {violations.map((violation, index) => (
                  <Tr key={index}>
                    <Td className="">
                      <div className="flex items-center gap-2">
                        <Image
                          src={`https://ui-avatars.com/api/?name=${violation.student}`}
                          alt="Logo"
                          width={40}
                          height={24}
                          className="rounded-full"
                        />
                        <div className="">
                          <span className="text-sm font-medium text-Gray-900">{violation.student}</span>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-sm text-Gray-900">{violation.student_id}</Td>
                    <Td className="text-sm text-Primary-500">
                      <a href={violation.documents} className="hover:underline">
                        {violation.sk}
                      </a>
                    </Td>
                    <Td className="text-sm text-Gray-900">{violation.start_punishment}</Td>
                    <Td className="text-sm text-Gray-900">{violation.end_punishment}</Td>
                    <Td className="text-sm text-Gray-900">
                      <div className="flex items-center gap-2">
                        <FaFilePdf className="text-2xl text-Error-500" />
                        <div className="text-xs text-Gray-500">
                          <h1>{violation.documents}</h1>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-sm text-Gray-900">{violation.reason}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
                <PiFlagBannerBold className="rotate-0" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Tambah Pelanggaran Siswa</h1>
              <p className="text-sm font-light text-Gray-600">Isi kolom berikut untuk menambah atau mengedit pelanggaran siswa</p>
              <form action="" className="mt-3">
                <div className="flex flex-col mt-2 mb-2">
                  <label htmlFor="student_id" className="text-sm text-Gray-600">
                    Assign Nama Siswa
                  </label>
                  <Select placeholder="Pilih Siswa" size="md" name="student_id" className="w-full" onChange={handleInputChange}>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col mt-2 mb-2">
                  <label htmlFor="sk" className="text-sm text-Gray-600">
                    SK
                  </label>
                  <Input type="text" name="sk" id="sk" onChange={handleInputChange} />
                </div>
                <div className="flex justify-between gap-3">
                  <div className="flex flex-col w-full mt-2 mb-2">
                    <label htmlFor="start_punishment" className="text-sm text-Gray-600">
                      Tanggal Mulai Hukuman
                    </label>
                    <Input type="date" name="start_punishment" id="start_punishment" onChange={handleInputChange} />
                  </div>
                  <div className="flex flex-col w-full mt-2 mb-2">
                    <label htmlFor="end_punishment" className="text-sm text-Gray-600">
                      Tanggal Selesai Hukuman
                    </label>
                    <Input type="date" name="end_punishment" id="end_punishment" onChange={handleInputChange} />
                  </div>
                </div>
                <div className="flex flex-col mt-2 mb-2">
                  <label htmlFor="documents" className="text-sm text-Gray-600">
                    Dokumen Pendukung
                  </label>
                  <Input type="text" name="documents" id="documents" onChange={handleInputChange} />
                </div>
                <div className="flex flex-col mt-2 mb-2">
                  <label htmlFor="reason" className="text-sm text-Gray-600">
                    Alasan Pelanggaran
                  </label>
                  <Input type="text" name="reason" id="reason" onChange={handleInputChange} />
                </div>
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleSubmit} btnClassName="font-semibold">
                Tambah Pelanggaran
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

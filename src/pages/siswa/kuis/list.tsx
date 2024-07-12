import Seo from '@/components/Seo';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import * as React from 'react';
import {
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Skeleton,
  useToast
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { LuBookOpen } from 'react-icons/lu';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function List() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [kuis, setKuis] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedQuizId, setSelectedQuizId] = React.useState(null);
  const router = useRouter();
  const toast = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKonfirmasiClick = (id) => {
    setSelectedQuizId(id);
    onOpen();
  };

  const handleConfirmQuiz = () => {
    router.push(`/siswa/kuis/${selectedQuizId}`);
  };

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/student/quiz`, {
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
        console.error('Error fetching quizzes:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch quizzes',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="List Kuis" />
        <div className="w-full pb-5 rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-5 lg:flex-row lg:items-center">
            <h1 className="font-semibold ">List Kuis</h1>
            <div className="flex justify-between gap-5">
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
            </div>
          </div>
          {loading ? (
            <Skeleton height="40px" my="10px" />
          ) : kuis.length > 0 ? (
            kuis.map((item, index) => (
              <div className="flex items-center justify-between w-full p-5 border-b h-fit bg-Gray-50 border-Gray-200" key={index}>
                <div className="flex flex-col gap-3">
                  <h1 className="font-semibold text-md text-Gray-900">{item.title}</h1>
                  <p className="text-sm font-medium text-Gray-600">{item.description}</p>
                  <span className="flex gap-3 text-xs font-medium text-Gray-500">
                    <h1>Deadline : {new Date(item.deadline).toLocaleDateString()}</h1>
                    <h1>Tipe Kuis : {item.type_of_quiz}</h1>
                    <h1>Kelas : {item.class_id}</h1>
                  </span>
                </div>
                <PrimaryButton btnClassName="w-fit h-fit" onClick={() => handleKonfirmasiClick(item.id)}>
                  Kerjakan
                </PrimaryButton>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-Gray-600">Tidak ada kuis ditemukan</div>
          )}
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay backdropBlur="10px" />
          <ModalContent>
            <ModalHeader className="mt-3">
              <div className="p-2 w-[36px] rounded-full bg-Warning-100">
                <LuBookOpen className="text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton className="mt-4" />
            <ModalBody>
              <h1 className="text-lg font-semibold">Mulai Kuis</h1>
              <p className="text-sm">Apakah kamu ingin memulai kuis?</p>
            </ModalBody>

            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleConfirmQuiz} btnClassName="font-semibold">
                Konfirmasi
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

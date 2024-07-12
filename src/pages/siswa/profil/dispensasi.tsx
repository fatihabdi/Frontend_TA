import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import {
  Table,
  Thead,
  Tr,
  Tbody,
  Th,
  Td,
  Tag,
  TagLabel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Skeleton,
  Box,
  Text,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SecondaryButton from '@/components/SecondaryButton';
import { FiInfo } from 'react-icons/fi';
import { PiFlagBannerBold } from 'react-icons/pi';
import { FaFilePdf } from 'react-icons/fa';
import PrimaryButton from '@/components/PrimaryButton';
import axios from 'axios';

interface Dispensation {
  id: number;
  student: string;
  reason: string;
  start_at: string;
  end_at: string;
  document: string;
  status: string;
}

const Dispensasi: React.FC = () => {
  const router = useRouter();
  const { isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose } = useDisclosure();
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure();
  const toast = useToast();
  const [dispensations, setDispensations] = React.useState<Dispensation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [reason, setReason] = React.useState('');
  const [startAt, setStartAt] = React.useState('');
  const [endAt, setEndAt] = React.useState('');
  const [document, setDocument] = React.useState('');
  const [selectedDispensation, setSelectedDispensation] = React.useState<Dispensation | null>(null);
  const [loadingDetail, setLoadingDetail] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching dispensations...');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/dispensation`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Fetched dispensations:', response.data.data);
        setDispensations(response.data.data);
      } catch (error) {
        console.error('Error fetching dispensations:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch dispensations.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleDetailClick = async (id: number) => {
    setLoadingDetail(true);
    try {
      console.log(`Fetching details for dispensation ID ${id}...`);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/dispensation/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(`Fetched details for dispensation ID ${id}:`, response.data.data);
      setSelectedDispensation(response.data.data);
      onSecondModalOpen();
    } catch (error) {
      console.error('Error fetching dispensation details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dispensation details.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      reason,
      start_at: startAt,
      end_at: endAt,
      document
    };

    try {
      console.log('Submitting new dispensation:', data);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/student/dispensation/create`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        console.log('Dispensation submitted successfully:', response.data);
        toast({
          title: 'Success',
          description: 'Dispensation has been successfully submitted.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onFirstModalClose();
        // Fetch updated dispensations
        const updatedResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/dispensation`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDispensations(updatedResponse.data.data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit dispensation.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error submitting dispensation:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit dispensation due to an error.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Dispensasi" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Daftar Dispensasi</h1>
            <div className="flex items-center gap-2">
              <PrimaryButton btnClassName="w-fit h-fit py-2" size="mini" onClick={onFirstModalOpen}>
                Ajukan Dispensasi
              </PrimaryButton>
            </div>
          </div>
          <div className="m-3 border rounded-lg shadow-sm">
            <Table className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>Nama Siswa</Th>
                  <Th>Keterangan Dispensasi</Th>
                  <Th>Tanggal Mulai</Th>
                  <Th>Tanggal Akhir</Th>
                  <Th>Dokumen Pendukung</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <>
                    {Array.from({ length: 4 }).map((_, index) => (
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
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                      </Tr>
                    ))}
                  </>
                ) : dispensations === null ? (
                  <Tr>
                    <Td colSpan={7}>
                      <Box textAlign="center" py={10}>
                        <Text fontSize="lg" color="gray.500">
                          Data Kosong
                        </Text>
                      </Box>
                    </Td>
                  </Tr>
                ) : (
                  dispensations.map((item) => (
                    <Tr key={item.id}>
                      <Td className="">
                        <div className="flex items-center gap-2">
                          <Image
                            src={`https://ui-avatars.com/api/?name=${item.student}`}
                            alt="Logo"
                            width={40}
                            height={24}
                            className="rounded-full"
                          />
                          <div className="">
                            <span className="text-sm font-medium text-Gray-900">{item.student}</span>
                          </div>
                        </div>
                      </Td>
                      <Td className="text-sm text-Gray-900">{item.reason}</Td>
                      <Td className="text-sm text-Gray-900">{item.start_at}</Td>
                      <Td className="text-sm text-Gray-900">{item.end_at}</Td>
                      <Td className="">
                        <div className="flex items-center gap-2 text-sm text-Gray-900">
                          <FaFilePdf className="text-2xl text-Error-500" />
                          <div className="text-xs text-Gray-500">
                            <h1>{item.document.slice(0, 12) + '...'}</h1>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        {item.status === 'pending' ? (
                          <Tag colorScheme="blue" borderRadius="full" size="sm">
                            <TagLabel>Wait Approval</TagLabel>
                          </Tag>
                        ) : item.status === 'accepted' ? (
                          <Tag colorScheme="green" borderRadius="full" size="sm">
                            <TagLabel>Success</TagLabel>
                          </Tag>
                        ) : (
                          <Tag colorScheme="red" borderRadius="full" size="sm">
                            <TagLabel>Declined</TagLabel>
                          </Tag>
                        )}
                      </Td>
                      <Td>
                        <SecondaryButton btnClassName="font-semibold w-fit h-fit" onClick={() => handleDetailClick(item.id)}>
                          Details
                        </SecondaryButton>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </div>
        </div>
        <Modal isOpen={isFirstModalOpen} onClose={onFirstModalClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
                <PiFlagBannerBold className="rotate-0" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Ajukan Dispensasi</h1>
              <p className="text-sm font-light text-Gray-600">Isi data berikut sebelum melakukan dispensasi</p>
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="flex flex-col gap-3 mt-2 mb-2">
                  <label htmlFor="reason" className="text-sm text-Gray-600">
                    Keterangan Dispensasi
                  </label>
                  <input
                    type="text"
                    id="reason"
                    className="w-full p-2 border-2 rounded-md border-Gray-300"
                    placeholder="Masukkan keterangan dispensasi"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <h1 className="font-semibold text-md text-Gray-900">Tanggal Dispensasi</h1>
                <div className="flex flex-col gap-3">
                  <label htmlFor="startAt" className="text-sm text-Gray-600">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    id="startAt"
                    className="w-full p-2 border-2 rounded-md border-Gray-300"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                  />
                  <label htmlFor="endAt" className="text-sm text-Gray-600">
                    Tanggal Berakhir
                  </label>
                  <input
                    type="date"
                    id="endAt"
                    className="w-full p-2 border-2 rounded-md border-Gray-300"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                  />
                  <label htmlFor="document" className="text-sm text-Gray-600">
                    Dokumen Pendukung
                  </label>
                  <div className="relative flex items-center mb-2 border-2 rounded-md border-Gray-300">
                    <span className="px-3 border-r text-Gray-600">https://</span>
                    <input
                      type="text"
                      id="document"
                      className="w-full p-2 border-0 rounded-r-md focus:outline-none"
                      placeholder="Link to document (e.g., www.example.com)"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full gap-2 text-Gray-600">
                    <FiInfo className="text-md" />
                    <p className="text-sm">Dapat diisi dengan link pendukung seperti Google Drive</p>
                  </div>
                </div>
                <ModalFooter className="flex justify-center gap-3">
                  <SecondaryButton onClick={onFirstModalClose} btnClassName="font-semibold">
                    Batal
                  </SecondaryButton>
                  <PrimaryButton type="submit" btnClassName="font-semibold">
                    Ajukan Dispensasi
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
              <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
                <PiFlagBannerBold className="rotate-0" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {loadingDetail ? (
                <>
                  <Skeleton height="20px" my="10px" />
                  <Skeleton height="20px" my="10px" />
                  <Skeleton height="20px" my="10px" />
                  <Skeleton height="20px" my="10px" />
                </>
              ) : selectedDispensation ? (
                <div className="mt-3 pb-3">
                  <h1 className="text-lg font-semibold">Detail Dispensasi</h1>
                  <p className="text-sm font-light text-Gray-600">Periksa Status dispensasi kamu disini</p>
                  <div className="flex flex-col gap-3 mt-2 mb-2">
                    <label htmlFor="reason" className="text-sm text-Gray-600">
                      Keterangan Dispensasi
                    </label>
                    <input
                      type="text"
                      id="reason"
                      className="w-full p-2 border-2 rounded-md border-Gray-300"
                      value={selectedDispensation.reason}
                      readOnly
                    />
                  </div>
                  <h1 className="font-semibold text-md text-Gray-900">Tanggal Dispensasi</h1>
                  <div className="flex flex-col gap-3">
                    <label htmlFor="startAt" className="text-sm text-Gray-600">
                      Tanggal Mulai
                    </label>
                    <input
                      type="text"
                      id="startAt"
                      className="w-full p-2 border-2 rounded-md border-Gray-300"
                      value={selectedDispensation.start_at}
                      readOnly
                    />
                    <label htmlFor="endAt" className="text-sm text-Gray-600">
                      Tanggal Berakhir
                    </label>
                    <input
                      type="text"
                      id="endAt"
                      className="w-full p-2 border-2 rounded-md border-Gray-300"
                      value={selectedDispensation.end_at}
                      readOnly
                    />
                    <label htmlFor="document" className="text-sm text-Gray-600">
                      Dokumen Pendukung
                    </label>
                    <div className="relative flex items-center mb-2 border-2 rounded-md border-Gray-300">
                      <span className="px-3 border-r text-Gray-600">https://</span>
                      <input
                        type="text"
                        id="document"
                        className="w-full p-2 border-0 rounded-r-md focus:outline-none"
                        value={selectedDispensation.document}
                        readOnly
                      />
                    </div>
                    <label htmlFor="endAt" className="text-sm text-Gray-600">
                      Status/Catatan
                    </label>
                    <input
                      type="text"
                      id="endAt"
                      className="w-full p-2 border-2 rounded-md border-Gray-300"
                      value={selectedDispensation.status}
                      readOnly
                    />
                  </div>
                </div>
              ) : (
                <Text fontSize="lg" color="gray.500">
                  Data Kosong
                </Text>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
};

export default Dispensasi;

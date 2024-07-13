import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutWali/AuthenticatedLayout';
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
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import SecondaryButton from '@/components/SecondaryButton';
import { FaFilePdf } from 'react-icons/fa';

export default function Pelanggaran() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [violations, setViolations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedViolation, setSelectedViolation] = React.useState(null);

  React.useEffect(() => {
    const fetchViolations = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parent/violation`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setViolations(response.data.data || []);
      } catch (error) {
        console.error('Error fetching violations:', error);
        setViolations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  const handleDetailsClick = async (violationId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parent/violation/${violationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedViolation(response.data.data);
      onOpen();
    } catch (error) {
      console.error('Error fetching violation details:', error);
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Pelanggaran" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Daftar Pelanggaran Siswa</h1>
          </div>
          <div className="m-3 border rounded-lg shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center">
                <Spinner size="xl" />
              </div>
            ) : violations.length === 0 ? (
              <div className="flex justify-center items-center py-6">
                <p className="text-gray-500">Tidak ada pelanggaran yang ditemukan</p>
              </div>
            ) : (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>SK Pelanggaran</Th>
                    <Th>Mulai Hukuman</Th>
                    <Th>Selesai Hukuman</Th>
                    <Th>Surat Keputusan</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {violations.map((violation, index) => (
                    <Tr key={index}>
                      <Td className="text-sm text-Primary-500">
                        <a href={violation.documents} className="hover:underline" target="_blank" rel="noopener noreferrer">
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
                      <Td>
                        <SecondaryButton size="mini" btnClassName="font-semibold" onClick={() => handleDetailsClick(violation.id)}>
                          Details
                        </SecondaryButton>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detail Pelanggaran</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedViolation ? (
                <div>
                  <p>
                    <strong>SK:</strong> {selectedViolation.sk}
                  </p>
                  <p>
                    <strong>Mulai Hukuman:</strong> {selectedViolation.start_punishment}
                  </p>
                  <p>
                    <strong>Selesai Hukuman:</strong> {selectedViolation.end_punishment}
                  </p>
                  <p>
                    <strong>Dokumen:</strong>{' '}
                    <a
                      href={selectedViolation.documents}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedViolation.documents}
                    </a>
                  </p>
                  <p>
                    <strong>Alasan:</strong> {selectedViolation.reason}
                  </p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Tutup
              </SecondaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

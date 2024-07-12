import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { PiFlagBannerBold } from 'react-icons/pi';
import {
  Tag,
  TagLabel,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useToast,
  ModalFooter,
  Box,
  Text,
  Skeleton
} from '@chakra-ui/react';
import PrimaryButton from '@/components/PrimaryButton';
import { CgCloseO } from 'react-icons/cg';
import SecondaryButton from '@/components/SecondaryButton';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function DetailDispensasi() {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dispensation, setDispensation] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/dispensation/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          setDispensation(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching dispensation:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch dispensation details.',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
          setLoading(false);
        });
    }
  }, [id]);

  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/dispensation/${id}/update`,
        {
          status: 'accepted'
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Dispensation has been successfully approved.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        router.push('/guru/pengaturan/dispensasi');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve dispensation.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      console.error('Error approving dispensation:', error);
    }
  };

  const handleDecline = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/dispensation/${id}/update`,
        {
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Dispensation has been successfully declined.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onClose();
        router.push('/guru/pengaturan/dispensasi');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to decline dispensation.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      console.error('Error declining dispensation:', error);
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Dispensasi Detail" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Detail Dispensasi</h1>
          </div>
          <div className="flex flex-col gap-5 p-3">
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} height="20px" />
                ))}
              </>
            ) : dispensation ? (
              <>
                <div className="flex flex-col gap-3">
                  <label htmlFor="reason" className="text-sm font-medium text-Gray-700">
                    Keterangan Dispensasi
                  </label>
                  <input
                    name="reason"
                    id="reason"
                    className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                    value={dispensation.reason}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="start_at" className="text-sm font-medium text-Gray-700">
                    Tanggal Mulai
                  </label>
                  <input
                    name="start_at"
                    id="start_at"
                    className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                    value={dispensation.start_at}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="end_at" className="text-sm font-medium text-Gray-700">
                    Tanggal Berakhir
                  </label>
                  <input
                    name="end_at"
                    id="end_at"
                    className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                    value={dispensation.end_at}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="document" className="text-sm font-medium text-Gray-700">
                    Dokumen Pendukung
                  </label>
                  <input
                    name="document"
                    id="document"
                    className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                    value={dispensation.document}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="status">Status</label>
                  {dispensation.status === 'pending' ? (
                    <Tag colorScheme="blue" borderRadius="full" size="sm" className="w-fit">
                      <TagLabel>Wait Approval</TagLabel>
                    </Tag>
                  ) : dispensation.status === 'accepted' ? (
                    <Tag colorScheme="green" borderRadius="full" size="sm" className="w-fit">
                      <TagLabel>Success</TagLabel>
                    </Tag>
                  ) : (
                    <Tag colorScheme="red" borderRadius="full" size="sm" className="w-fit">
                      <TagLabel>Declined</TagLabel>
                    </Tag>
                  )}
                </div>
                {dispensation.status === 'pending' && (
                  <div className="flex items-center justify-end gap-3">
                    <Button leftIcon={<CgCloseO />} onClick={onOpen} variant="outline">
                      Decline
                    </Button>
                    <PrimaryButton onClick={handleApprove} btnClassName="w-fit h-fit py-2 rounded-md">
                      Approve
                    </PrimaryButton>
                  </div>
                )}
              </>
            ) : (
              <Box textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.500">
                  Data tidak ditemukan.
                </Text>
              </Box>
            )}
          </div>
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
              <h1 className="text-lg font-semibold">Anda Yakin Ingin Menolak Dispensasi Ini?</h1>
              <form action="" className="mt-3">
                <div className="flex flex-col mt-2 mb-2">
                  <label htmlFor="tujuan" className="text-sm text-Gray-600">
                    Masukkan catatan mengapa anda menolak
                  </label>
                  <textarea
                    name="tujuan"
                    id="tujuan"
                    className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                    placeholder="cth : dokumen salah input dan lainnya"
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleDecline} btnClassName="font-semibold">
                Tolak Dispensasi
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { PiFlagBannerBold } from 'react-icons/pi';
import {
  Select,
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
  ModalFooter
} from '@chakra-ui/react';
import PrimaryButton from '@/components/PrimaryButton';
import { CgCloseO } from 'react-icons/cg';
import SecondaryButton from '@/components/SecondaryButton';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function DetailPrestasi() {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [item, setItem] = React.useState({});
  const [rejectionNote, setRejectionNote] = React.useState('');

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/achivement/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setItem(response.data.data);
      });
  }, [id]);

  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/achivement/${id}/update`,
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
          description: 'Achievement has been successfully approved.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        router.push('/guru/prestasi/list');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve achievement.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      console.error('Error approving achievement:', error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/achivement/${id}/update`,
        {
          status: `rejected: ${rejectionNote}`
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
          description: 'Achievement has been successfully rejected.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onClose();
        router.push('/guru/prestasi/list');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject achievement.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      console.error('Error rejecting achievement:', error);
    }
  };

  const handleRejectionNoteChange = (e) => {
    setRejectionNote(e.target.value);
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Prestasi" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Detail Prestasi</h1>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div className="flex flex-col gap-3">
              <label htmlFor="title" className="text-sm font-medium text-Gray-700">
                Nama dan Judul Kegiatan
              </label>
              <input
                name="title"
                id="title"
                className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                placeholder="Tuliskan judul kegiatan disini"
                value={item.title}
                disabled
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="type_of_achivement" className="text-sm font-medium text-Gray-700">
                Jenis Prestasi
              </label>
              <input
                name="type_of_achivement"
                id="type_of_achivement"
                className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                value={item.type_of_achivement}
                disabled
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="participation" className="text-sm font-medium text-Gray-700">
                Jenis Partisipasi
              </label>
              <input
                name="participation"
                id="participation"
                className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                value={item.participation}
                disabled
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="level" className="text-sm font-medium text-Gray-700">
                Jenis Tingkat
              </label>
              <input name="level" id="level" className="w-full p-2 border rounded-lg border-Gray-200 h-fit" value={item.level} disabled />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="evidence" className="text-sm text-Gray-700">
                Upload Bukti
              </label>
              <div className="relative flex items-center border rounded-md border-Gray-200">
                <span className="px-3 border-r text-Gray-600">https://</span>
                <input
                  type="text"
                  id="evidence"
                  className="w-full p-2 border-0 rounded-r-md focus:outline-none"
                  placeholder="www.example.com"
                  value={item.evidence}
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="status" className="text-sm text-Gray-700">
                Status
              </label>
              {item.status === 'pending' ? (
                <Tag colorScheme="blue" borderRadius="full" size="sm" className="w-fit">
                  <TagLabel>Wait Approval</TagLabel>
                </Tag>
              ) : item.status === 'accepted' ? (
                <Tag colorScheme="green" borderRadius="full" size="sm" className="w-fit">
                  <TagLabel>Success</TagLabel>
                </Tag>
              ) : (
                <Tag colorScheme="red" borderRadius="full" size="sm" className="w-fit">
                  <TagLabel>Declined</TagLabel>
                </Tag>
              )}
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button leftIcon={<CgCloseO />} onClick={onOpen} variant="outline">
                Decline
              </Button>
              <PrimaryButton onClick={handleApprove} btnClassName="w-fit h-fit py-2 rounded-md">
                Approve
              </PrimaryButton>
            </div>
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
              <h1 className="text-lg font-semibold">Anda Yakin Ingin Menolak Pelaporan Prestasi Siswa?</h1>
              <form className="mt-3">
                <div className="flex flex-col mt-2 mb-2">
                  <label htmlFor="rejectionNote" className="text-sm text-Gray-600">
                    Masukkan catatan mengapa anda menolak
                  </label>
                  <textarea
                    name="rejectionNote"
                    id="rejectionNote"
                    className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                    placeholder="cth: dokumen salah input dan lainnya"
                    value={rejectionNote}
                    onChange={handleRejectionNoteChange}
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleReject} btnClassName="font-semibold">
                Tolak Pelaporan
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

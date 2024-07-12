import * as React from 'react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/components/layout/layoutAdmin/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import CardPengaduan from '@/components/pengaduan/CardPengaduan';
import { PiFlagBannerBold } from 'react-icons/pi';
import {
  Modal,
  useToast,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Skeleton,
  Box,
  Text
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import SecondaryButton from '@/components/SecondaryButton';
import axios from 'axios';

const initialFormData = {
  title: '',
  information: ''
};

export default function Pengaduan() {
  const toast = useToast();
  const router = useRouter();
  const { isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose } = useDisclosure();
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure();
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [annoucementById, setAnnoucementById] = useState(initialFormData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/announcement`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setAnnouncements(response.data.data || []); // Ensure the response data is an array
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAnnoucementById((prevAnnoucementById) => ({
      ...prevAnnoucementById,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/announcement/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.status === 201) {
          setAnnouncements((prevAnnouncements) => [...prevAnnouncements, response.data.data]);
          toast({
            title: 'Pengumuman berhasil diposting',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          setFormData(initialFormData);
          onFirstModalClose();
        } else {
          console.error('Failed to create announcement');
        }
      })
      .catch((error) => {
        console.error('Error creating announcement:', error);
      });
  };

  const handleEditAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/announcement/${annoucementById.id}/update`, annoucementById, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setAnnouncements((prevAnnouncements) =>
            prevAnnouncements.map((announcement) => {
              if (announcement.id === annoucementById.id) {
                return response.data.data;
              }
              return announcement;
            })
          );
          toast({
            title: 'Pengumuman berhasil diubah',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          onSecondModalClose();
        } else {
          console.error('Failed to update announcement');
          toast({
            title: 'Gagal mengubah pengumuman',
            status: 'error',
            duration: 3000,
            isClosable: true
          });
        }
      })
      .catch((error) => {
        console.error('Error updating announcement:', error);
        toast({
          title: 'Gagal mengubah pengumuman',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      });
  };

  const handleGetAnnoucementsById = (id: number) => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/announcement/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setAnnoucementById(response.data.data || initialFormData); // Ensure the response data is valid
      })
      .catch((error) => {
        console.error('Error fetching announcement:', error);
      });
  };

  const handleDeletePengaduan = (id: number) => {
    const token = localStorage.getItem('token');
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/announcement/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setAnnouncements((prevAnnouncements) => prevAnnouncements.filter((announcement) => announcement.id !== id));
          toast({
            title: 'Pengumuman berhasil dihapus',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
        } else {
          console.error('Failed to delete announcement');
          toast({
            title: 'Gagal menghapus pengumuman',
            status: 'error',
            duration: 3000,
            isClosable: true
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting announcement:', error);
        toast({
          title: 'Gagal menghapus pengumuman',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      });
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Pengaduan" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Pengumuman</h1>
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <PrimaryButton btnClassName="font-semibold w-full lg:w-fit h-fit" onClick={onFirstModalOpen}>
                Posting Pengumuman
              </PrimaryButton>
            </div>
          </div>
          <div className="p-3 space-y-4">
            {loading ? (
              <>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </>
            ) : announcements.length === 0 ? (
              <Box textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.500">
                  Data Kosong
                </Text>
              </Box>
            ) : (
              announcements.map((announcement) => {
                return (
                  <CardPengaduan
                    key={announcement.id}
                    nama="Admin"
                    judul={announcement.title}
                    waktu={announcement.updated_at}
                    isiPengaduan={announcement.information}
                    onEdit={() => {
                      handleGetAnnoucementsById(announcement.id);
                      onSecondModalOpen();
                    }}
                    onDelete={() => handleDeletePengaduan(announcement.id)}
                  />
                );
              })
            )}
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
              <h1 className="text-lg font-semibold">Buat Pengumuman</h1>
              <p className="text-sm font-light text-Gray-600">Tulis pengumuman yang ingin diposting</p>
              <form onSubmit={handleSubmit} className="mt-3">
                <label htmlFor="title" className="text-sm text-Gray-600">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <label htmlFor="information" className="text-sm text-Gray-600">
                  Isi Pengumuman
                </label>
                <textarea
                  id="information"
                  value={formData.information}
                  onChange={handleInputChange}
                  placeholder="cth : Tujuan diadakan acara ini adalah..."
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <ModalFooter className="flex justify-center gap-3">
                  <SecondaryButton onClick={onFirstModalClose} btnClassName="font-semibold">
                    Batal
                  </SecondaryButton>
                  <PrimaryButton type="submit" btnClassName="font-semibold">
                    Posting Pengumuman
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
              <h1 className="text-lg font-semibold">Edit Pengumuman</h1>
              <p className="text-sm font-light text-Gray-600">Ubah pengumuman yang ingin diposting</p>
              <form onSubmit={handleEditAnnouncement} className="mt-3">
                <label htmlFor="title" className="text-sm text-Gray-600">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  id="title"
                  value={annoucementById.title}
                  onChange={handleEditInputChange}
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <label htmlFor="information" className="text-sm text-Gray-600">
                  Isi Pengumuman
                </label>
                <textarea
                  id="information"
                  value={annoucementById.information}
                  onChange={handleEditInputChange}
                  placeholder="cth : Tujuan diadakan acara ini adalah..."
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <ModalFooter className="flex justify-center gap-3">
                  <SecondaryButton onClick={onSecondModalClose} btnClassName="font-semibold">
                    Batal
                  </SecondaryButton>
                  <PrimaryButton type="submit" btnClassName="font-semibold">
                    Simpan Perubahan
                  </PrimaryButton>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

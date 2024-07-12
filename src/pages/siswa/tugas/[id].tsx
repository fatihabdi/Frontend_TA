import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import {
  Tag,
  TagLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { PiFlagBannerBold } from 'react-icons/pi';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Tugas() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const { id, title } = router.query;
  const [submission, setSubmission] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!id || !title) {
      router.push(`/siswa/tugas`);
    }
  }, [id, title]);

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleSubmit = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/student/task/${id}/assignment`,
        { submission },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      .then(() => {
        setIsSubmitted(true);
        toast({
          title: 'Success',
          description: 'Task submitted successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting task:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit task',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  return (
    <AuthenticatedLayout>
      <Seo templateTitle="Tugas" />
      <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
        <div className="flex flex-col justify-between gap-5 p-3 lg:border-b lg:items-center lg:flex-row lg:border-Gray-200">
          <h1 className="font-semibold ">{title}</h1>
          {isSubmitted ? (
            <PrimaryButton btnClassName="w-fit h-fit">Edit Tugas</PrimaryButton>
          ) : (
            <PrimaryButton btnClassName="w-fit h-fit" onClick={onOpen}>
              Submit Tugas
            </PrimaryButton>
          )}
        </div>
        <div className="p-3">
          <h2 className="text-lg font-medium">Status Pengumpulan</h2>
          <div className="flex flex-col gap-3 py-5 lg:gap-9 lg:items-center lg:flex-row">
            <h2 className="text-sm font-semibold">Status Pengumpulan</h2>
            <div className="">
              <span className="">
                {isSubmitted ? (
                  <Tag className="" variant="outline" colorScheme="green" borderRadius="full">
                    <TagLabel>Sudah Mengumpulkan</TagLabel>
                  </Tag>
                ) : (
                  <Tag className="" variant="outline" colorScheme="gray" borderRadius="full">
                    <TagLabel>Belum Mengumpulkan</TagLabel>
                  </Tag>
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
            <h3 className="text-sm font-semibold">Status Penilaian</h3>
            <p className="text-Gray-500">{isSubmitted ? 'Belum Dinilai' : 'Belum Dinilai'}</p>
          </div>
          <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
            <h3 className="text-sm font-semibold">Deadline Tugas</h3>
            <p className="text-Gray-500">October 20, 2022</p>
          </div>
          <div className="py-5">
            <h3 className="text-sm font-semibold">Tambah Komentar</h3>
            <textarea className="w-full p-2 mt-2 border border-gray-300 rounded-md" rows={4} placeholder="Tambahkan komentar" />
          </div>
        </div>
        {isSubmitted && (
          <div className="p-3 border-t border-gray-200">
            <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="text-Gray-500">
                {username} - {title}
              </p>
            </div>
            <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
              <h3 className="text-sm font-medium">Link Pengumpulan</h3>
              <a
                href="https://docs.google.com/document/d/1pzgKrXc05fyH3H9OuwcNPDJED0vIK2oJ8NhvJCW3xKo/edit?usp=drive_link"
                className="text-blue-500 underline"
              >
                https://docs.google.com/document/d/1pzgKrXc05fyH3H9OuwcNPDJED0vIK2oJ8NhvJCW3xKo/edit?usp=drive_link
              </a>
            </div>
          </div>
        )}
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
            <h1 className="text-lg font-semibold">Tugas</h1>
            <p className="text-sm font-light text-Gray-600">Isi kolom berikut untuk menambah atau mengedit tugas</p>
            <form action="" className="mt-3">
              <label htmlFor="submission" className="text-sm text-Gray-600">
                Submission
              </label>
              <textarea
                id="submission"
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
              />
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-3">
            <SecondaryButton onClick={onClose} btnClassName="font-semibold">
              Batal
            </SecondaryButton>
            <PrimaryButton onClick={handleSubmit} btnClassName="font-semibold">
              Submit Tugas
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AuthenticatedLayout>
  );
}

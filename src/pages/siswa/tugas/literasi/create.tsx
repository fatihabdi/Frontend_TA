import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Button, useToast } from '@chakra-ui/react';
import PrimaryButton from '@/components/PrimaryButton';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function CreateLiterasi() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [documentLink, setDocumentLink] = React.useState('');
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = () => {
    const data = {
      title,
      description,
      documents: documentLink
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/student/literation/create`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(() => {
        toast({
          title: 'Success',
          description: 'Literation created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        router.push('/siswa/tugas/literasi');
      })
      .catch((error) => {
        console.error('Error creating literation:', error);
        toast({
          title: 'Error',
          description: 'Failed to create literation',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Literasi" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Tambah Literasi</h1>
            <div className="flex items-center justify-between gap-8">
              <PrimaryButton btnClassName="w-fit h-fit" onClick={handleSubmit}>
                Submit Literasi
              </PrimaryButton>
            </div>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div className="flex flex-col gap-3">
              <label htmlFor="judul" className="text-sm font-medium text-Gray-700">
                Judul Materi
              </label>
              <input
                type="text"
                name="judul"
                id="judul"
                className="w-full p-2 border rounded-lg border-Gray-200"
                placeholder="Tuliskan judul literasi kamu disini"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="hasil" className="text-sm font-medium text-Gray-700">
                Masukkan Hasil
              </label>
              <textarea
                name="hasil"
                id="hasil"
                className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                placeholder="Tuliskan hasil kamu disini"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="documentLink" className="text-sm font-medium text-Gray-700">
                Link Dokumen Pendukung
              </label>
              <input
                type="text"
                name="documentLink"
                id="documentLink"
                className="w-full p-2 border rounded-lg border-Gray-200"
                placeholder="Masukkan link dokumen pendukung"
                value={documentLink}
                onChange={(e) => setDocumentLink(e.target.value)}
              />
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

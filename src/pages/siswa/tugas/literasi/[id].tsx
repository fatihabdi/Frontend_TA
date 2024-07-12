import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

export default function DetailLiterasi() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [documentLink, setDocumentLink] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/student/literation/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          const data = response.data.data;
          setTitle(data.title);
          setDescription(data.description);
          setDocumentLink(data.documents);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching literation details:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch literation details',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
          setLoading(false);
        });
    }
  }, [id, toast]);

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Literasi" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Detail Literasi</h1>
            <div className="flex items-center justify-between gap-8"></div>
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

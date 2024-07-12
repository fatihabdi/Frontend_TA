import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Button, useToast } from '@chakra-ui/react';
import DetailMateri from '@/components/materi/DetailMateri';
import KontenMateri from '@/components/materi/KontenMateri';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function CreateMateri() {
  const toast = useToast();
  const Router = useRouter();
  const [showKonten, setShowKonten] = React.useState('detailmateri');
  const [detailMateri, setDetailMateri] = React.useState({ title: '', description: '' });
  const [kontenMateri, setKontenMateri] = React.useState([{ title: 'Sesi 1', description: '', link: '' }]);

  const handleDetailMateri = (value) => {
    setShowKonten(value);
  };

  const handleSave = async () => {
    const subjectId = localStorage.getItem('subjectId'); // Ensure subjectId is stored in local storage
    const data = {
      title: detailMateri.title,
      description: detailMateri.description,
      content: kontenMateri
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/${subjectId}/matter`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast({
        title: 'Berhasil',
        description: `${response.data.message}`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      localStorage.removeItem('subjectId');
      Router.push('/guru/materi/preview');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Gagal menyimpan materi: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <Seo templateTitle="Tambah Materi" />
      <div className="flex flex-col justify-between w-full p-5 rounded-md lg:items-center lg:flex-row h-fit bg-Base-white">
        <div>
          <Button
            className={`font-semibold ${showKonten === 'detailmateri' ? 'bg-Primary-50 text-Primary-700' : ''}`}
            variant="ghost"
            colorScheme="blue"
            onClick={() => handleDetailMateri('detailmateri')}
          >
            Detail Materi
          </Button>
          <Button
            className={`font-semibold ${showKonten === 'kontenmateri' ? 'bg-Primary-50 text-Primary-700' : ''}`}
            variant="ghost"
            colorScheme="blue"
            onClick={() => handleDetailMateri('kontenmateri')}
          >
            Konten Materi
          </Button>
        </div>
      </div>
      {showKonten === 'detailmateri' && (
        <DetailMateri detailMateri={detailMateri} setDetailMateri={setDetailMateri} handleSave={handleSave} />
      )}
      {showKonten === 'kontenmateri' && <KontenMateri kontenMateri={kontenMateri} setKontenMateri={setKontenMateri} />}
    </AuthenticatedLayout>
  );
}

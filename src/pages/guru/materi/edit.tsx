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
  const router = useRouter();
  const { matterId } = router.query;
  const [showKonten, setShowKonten] = React.useState('detailmateri');
  const [detailMateri, setDetailMateri] = React.useState({ title: '', description: '' });
  const [kontenMateri, setKontenMateri] = React.useState([{ title: 'Sesi 1', description: '', link: '' }]);

  React.useEffect(() => {
    if (matterId) {
      fetchMatterDetail(matterId);
    }
  }, [matterId]);

  const fetchMatterDetail = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/matter/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDetailMateri({ title: response.data.data.title, description: response.data.data.description });
      setKontenMateri(response.data.data.content || []);
    } catch (error) {
      console.error('Error fetching matter details:', error);
    }
  };

  const handleDetailMateri = (value) => {
    setShowKonten(value);
  };

  const handleSave = async () => {
    const data = {
      title: detailMateri.title,
      description: detailMateri.description,
      content: kontenMateri
    };

    try {
      if (matterId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/matter/${matterId}/update`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        const subjectId = localStorage.getItem('subjectId'); // Ensure subjectId is stored in local storage
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/${subjectId}/matter`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      toast({
        title: 'Berhasil',
        description: 'Materi berhasil disimpan',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      localStorage.removeItem('subjectId');
      router.push('/guru/materi/preview');
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

  const handleDelete = async () => {
    if (!matterId) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/matter/${matterId}/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({
        title: 'Berhasil',
        description: 'Materi berhasil dihapus',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      router.push('/guru/materi/preview');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Gagal menghapus materi: ${error}`,
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
        <DetailMateri detailMateri={detailMateri} setDetailMateri={setDetailMateri} handleSave={handleSave} handleDelete={handleDelete} />
      )}
      {showKonten === 'kontenmateri' && <KontenMateri kontenMateri={kontenMateri} setKontenMateri={setKontenMateri} />}
    </AuthenticatedLayout>
  );
}

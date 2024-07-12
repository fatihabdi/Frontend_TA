import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutAdmin/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import { Select, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Create() {
  const [mapelName, setMapelName] = React.useState('');
  const [mapelDesc, setMapelDesc] = React.useState('');
  const [semester, setSemester] = React.useState('');

  const toast = useToast();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      name: mapelName,
      description: mapelDesc,
      semester: semester
    };

    const token = localStorage.getItem('token');

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/create`, data, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        if (response.status === 201) {
          toast({
            title: 'Mata Pelajaran Berhasil Dibuat',
            description: 'Mata pelajaran baru telah berhasil dibuat',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          // Clear the form
          setMapelName('');
          setMapelDesc('');
          setSemester('');
          router.push('/admin/mata-pelajaran/list');
        }
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'Terjadi kesalahan saat membuat mata pelajaran',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        console.error('Error creating subject:', error);
      });
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Pengaduan" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Tambah Mata Pelajaran</h1>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <label htmlFor="mapel" className="text-sm font-medium text-Gray-700">
                  Nama Mata Pelajaran
                </label>
                <input
                  name="mapel"
                  id="mapel"
                  className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                  placeholder="Masukkan nama mata pelajaran"
                  value={mapelName}
                  onChange={(e) => setMapelName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="deskripsi" className="text-sm font-medium text-Gray-700">
                  Deskripsi Mata Pelajaran
                </label>
                <textarea
                  name="deskripsi"
                  id="deskripsi"
                  className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                  placeholder="Masukkan deskripsi mata pelajaran"
                  value={mapelDesc}
                  onChange={(e) => setMapelDesc(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-sm font-medium text-Gray-700">Assign Semester</h1>
                <Select placeholder="Pilih Semester" value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option value="1 & 2">VII</option>
                  <option value="3 & 4">VIII</option>
                  <option value="5 & 6">XI</option>
                </Select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <PrimaryButton type="submit" btnClassName="w-fit h-fit rounded-md">
                  Buat Mata Pelajaran
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

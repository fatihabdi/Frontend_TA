import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutAdmin/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import { Select, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Edit() {
  const [mapelName, setMapelName] = React.useState('');
  const [mapelDesc, setMapelDesc] = React.useState('');
  const [semester, setSemester] = React.useState('');
  const [subjectData, setSubjectData] = React.useState(null);

  const toast = useToast();
  const router = useRouter();
  const { item } = router.query; // Get the query parameter

  React.useEffect(() => {
    if (item) {
      const subjectData = JSON.parse(item);
      setSubjectData(subjectData);
      setMapelName(subjectData.name);
      setMapelDesc(subjectData.description);
      setSemester(subjectData.semester);
    }
  }, [item]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      name: mapelName,
      description: mapelDesc,
      semester: semester
    };

    const token = localStorage.getItem('token');

    if (subjectData) {
      axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/${subjectData.id}/update`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          toast({
            title: 'Mata Pelajaran Berhasil Diperbarui',
            description: 'Mata pelajaran telah berhasil diperbarui',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          router.push('/admin/mata-pelajaran/list');
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: 'Terjadi kesalahan saat memperbarui mata pelajaran',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
          console.error('Error updating subject:', error);
        });
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Edit Mata Pelajaran" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Edit Mata Pelajaran</h1>
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
                  <option value="1 & 2">1 & 2</option>
                  <option value="3 & 4">3 & 4</option>
                  <option value="5 & 6">5 & 6</option>
                </Select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <PrimaryButton size="mini" type="submit" btnClassName="w-fit h-fit rounded-md">
                  Perbarui Mata Pelajaran
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

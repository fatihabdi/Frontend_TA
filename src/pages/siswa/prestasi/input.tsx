import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import { Select, useToast } from '@chakra-ui/react';
import axios from 'axios';

export default function CreatePrestasi() {
  const [title, setTitle] = React.useState('');
  const [type_of_achivement, setTypeOfAchievement] = React.useState('');
  const [participation, setParticipation] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [evidence, setEvidence] = React.useState('');
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title,
      type_of_achivement,
      participation,
      level,
      evidence
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/student/achivement/create`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        toast({
          title: 'Success',
          description: 'Achievement has been successfully submitted.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        // Clear the form
        setTitle('');
        setTypeOfAchievement('');
        setParticipation('');
        setLevel('');
        setEvidence('');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit achievement.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error submitting achievement:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit achievement due to an error.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Input Prestasi" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Input Prestasi</h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-3">
            <div className="flex flex-col gap-3">
              <label htmlFor="title" className="text-sm font-medium text-Gray-700">
                Nama dan Judul Kegiatan
              </label>
              <input
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                placeholder="Tuliskan nama dan judul kegiatan"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-sm font-medium text-Gray-700">Jenis Prestasi</h1>
              <input
                type="text"
                name="type_of_achivement"
                id="type_of_achivement"
                value={type_of_achivement}
                onChange={(e) => setTypeOfAchievement(e.target.value)}
                className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                placeholder="Tuliskan jenis prestasi"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-sm font-medium text-Gray-700">Jenis Partisipasi</h1>
              <input
                type="text"
                id="participation"
                value={participation}
                onChange={(e) => setParticipation(e.target.value)}
                className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                placeholder="Tuliskan jenis partisipasi"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-sm font-medium text-Gray-700">Jenis Tingkat</h1>
              <Select placeholder="Pilih Jenis Tingkat" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="local">Local</option>
                <option value="regional">Regional</option>
                <option value="national">National</option>
                <option value="international">International</option>
              </Select>
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
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  className="w-full p-2 border-0 rounded-r-md focus:outline-none"
                  placeholder="Link to evidence (e.g., www.example.com)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <PrimaryButton type="submit" btnClassName="w-fit h-fit rounded-md">
                Ajukan Prestasi
              </PrimaryButton>
            </div>
          </form>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

import * as React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Button } from '@chakra-ui/react';
import TextInput from '@/components/TextInput';
import PrimaryButton from '../PrimaryButton';

type DetailMateriProps = {
  detailMateri?: { title: string; description: string };
  setDetailMateri?: (detail: { title: string; description: string }) => void;
  handleSave: () => void;
  handleDelete: () => void;
};

export default function DetailMateri({ detailMateri, setDetailMateri, handleSave, handleDelete }: DetailMateriProps) {
  const handleChange = (key: string, value: string) => {
    setDetailMateri((prevDetail) => ({
      ...prevDetail,
      [key]: value
    }));
  };

  return (
    <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
      <div className="flex flex-col justify-between gap-5 p-5 lg:flex-row">
        <div className="flex flex-col w-full gap-3">
          <h1 className="text-sm font-semibold text-Gray-600">Nama Materi</h1>
          <TextInput
            inputClassName="border shadow-none"
            value={detailMateri.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5">
        <h1 className="text-sm font-semibold text-Gray-600">Deskripsi Materi</h1>
        <textarea
          className="w-full p-3 text-sm font-medium border rounded-lg h-fit text-Gray-500"
          value={detailMateri.description}
          onChange={(e) => handleChange('description', e.target.value)}
        ></textarea>
      </div>
      <div className="flex justify-end gap-5 p-4">
        <Button leftIcon={<FiTrash2 />} colorScheme="gray" variant="outline" onClick={handleDelete}>
          Hapus Materi
        </Button>
        <PrimaryButton btnClassName="w-fit h-fit py-2" onClick={handleSave}>
          Simpan Materi
        </PrimaryButton>
      </div>
    </div>
  );
}

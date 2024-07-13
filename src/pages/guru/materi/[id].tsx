import * as React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Button } from '@chakra-ui/react';
import TextInput from '@/components/TextInput';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { useRouter } from 'next/router';

export default function DetailMateri() {
  const router = useRouter();
  const { subitem } = router.query;

  const [detailMateri, setDetailMateri] = React.useState({
    title: '',
    description: '',
    link: ''
  });

  React.useEffect(() => {
    if (subitem) {
      const subItemData = JSON.parse(subitem);
      setDetailMateri({
        title: subItemData.title || '',
        description: subItemData.description || '',
        link: subItemData.link || ''
      });
    }
  }, [subitem]);

  const handleChange = (key, value) => {
    setDetailMateri((prevDetail) => ({
      ...prevDetail,
      [key]: value
    }));
  };

  const { title, description, link } = detailMateri;

  return (
    <AuthenticatedLayout>
      <Seo title="Detail Konten Materi" />
      <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
        <div className="flex flex-col justify-between gap-5 p-5 lg:flex-row">
          <div className="flex flex-col w-full gap-3">
            <h1 className="text-sm font-semibold text-Gray-600">Nama Konten</h1>
            <TextInput disabled inputClassName="border shadow-none" value={title} onChange={(e) => handleChange('title', e.target.value)} />
          </div>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <h1 className="text-sm font-semibold text-Gray-600">Deskripsi Konten</h1>
          <textarea
            className="w-full p-3 text-sm font-medium border rounded-lg h-fit text-Gray-500"
            value={description}
            disabled
            onChange={(e) => handleChange('description', e.target.value)}
          ></textarea>
        </div>
        <div className="flex flex-col justify-between gap-5 p-5 lg:flex-row">
          <div className="flex flex-col w-full gap-3">
            <h1 className="text-sm font-semibold text-Gray-600">Link</h1>

            {link && (
              <a href={link} target="_blank" className="text-Primary-500 underline">
                {link}
              </a>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

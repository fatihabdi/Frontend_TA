import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Spinner, Text } from '@chakra-ui/react';

export default function MatterDetail() {
  const [matter, setMatter] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const { matterId, submater } = router.query; // Get the matter ID and submater from the query parameters

  React.useEffect(() => {
    if (matterId) {
      fetchMatterDetail(matterId);
    }
  }, [matterId]);

  const fetchMatterDetail = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/subject/matter/${id}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMatter(response.data.data);
    } catch (error) {
      console.error('Error fetching matter details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Materi" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <Spinner size="xl" />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Seo templateTitle="Detail Materi" />
      <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
        {matter ? (
          <>
            {matter.content &&
              matter.content
                .filter((contentItem) => contentItem.id === submater) // Filter content based on submater ID
                .map((contentItem) => (
                  <div key={contentItem.id}>
                    <Text className="text-Primary-700 font-semibold text-lg p-5">{contentItem.title}</Text>
                    <Text mt={2} className="p-3 text-sm font-medium text-Gray-700">
                      {contentItem.description}
                    </Text>
                    {contentItem.link && (
                      <Text mt={2} className="p-3 text-sm font-semibold text-Gray-700">
                        Link Pembelajaran:{' '}
                        <a href={contentItem.link} target="_blank" rel="noopener noreferrer" className="text-Primary-500 underline">
                          {contentItem.link}
                        </a>
                      </Text>
                    )}
                  </div>
                ))}
          </>
        ) : (
          <Text>Detail materi tidak ditemukan.</Text>
        )}
      </div>
    </AuthenticatedLayout>
  );
}

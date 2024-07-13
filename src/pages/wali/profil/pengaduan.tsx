import * as React from 'react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/components/layout/layoutWali/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import CardPengaduan from '@/components/pengaduan/CardPengaduanGlobal';
import { Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaWhatsapp } from 'react-icons/fa';

interface Announcement {
  id: number;
  title: string;
  information: string;
  created_at: string;
  updated_at: string;
}

export default function Pengaduan() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/global/announcements`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          const sortedAnnouncements = response.data.data.sort(
            (a: Announcement, b: Announcement) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          setAnnouncements(sortedAnnouncements);
        } else {
          setError('No data available');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Pengaduan" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">List Informasi & Pengumuman</h1>
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <PrimaryButton
                leftIcon={<FaWhatsapp />}
                size="mini"
                btnClassName="font-semibold w-full lg:w-fit h-fit"
                onClick={() => router.replace('https://wa.me/15551234567')}
              >
                Buat Pengaduan Baru
              </PrimaryButton>
            </div>
          </div>
          <div className="p-3 space-y-4">
            {loading ? (
              <>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </>
            ) : error ? (
              <div className="text-center py-5 text-Gray-600">{error}</div>
            ) : announcements.length > 0 ? (
              announcements.map((announcement) => (
                <CardPengaduan
                  key={announcement.id}
                  nama="Admin"
                  judul={announcement.title}
                  waktu={announcement.updated_at}
                  isiPengaduan={announcement.information}
                />
              ))
            ) : (
              <div className="text-center py-5 text-Gray-600">Tidak ada informasi dan pengumuman yang tersedia.</div>
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

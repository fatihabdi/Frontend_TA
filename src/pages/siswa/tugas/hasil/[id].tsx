import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Tag, TagLabel, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Tugas() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('Menunggu untuk dinilai guru');
  const [grade, setGrade] = useState(null);
  const toast = useToast();
  const router = useRouter();
  const { id, title } = router.query;
  const [submission, setSubmission] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!id || !title) {
      router.push(`/siswa/tugas/preview`);
    } else {
      checkAssignmentStatus();
    }
  }, [id, title]);

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
    }
  }, []);

  const checkAssignmentStatus = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/student/task/${id}/assignment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setIsSubmitted(true);
          setSubmission(response.data.data.submission || '');
          setFeedback(response.data.data.feedback || 'Menunggu untuk dinilai guru');
          setGrade(response.data.data.grade);
        }
      })
      .catch((error) => {
        console.error('Error fetching assignment status:', error);
      });
  };

  return (
    <AuthenticatedLayout>
      <Seo templateTitle="Tugas" />
      <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
        <div className="flex flex-col justify-between gap-5 p-3 lg:border-b lg:items-center lg:flex-row lg:border-Gray-200">
          <h1 className="font-semibold ">{title}</h1>
        </div>
        <div className="p-3">
          <h2 className="text-lg font-medium">Status Pengumpulan</h2>
          <div className="flex flex-col gap-3 py-5 lg:gap-9 lg:items-center lg:flex-row">
            <h2 className="text-sm font-semibold">Status Pengumpulan</h2>
            <div className="">
              <span className="">
                {isSubmitted ? (
                  <Tag className="" variant="outline" colorScheme="green" borderRadius="full">
                    <TagLabel>Sudah Mengumpulkan</TagLabel>
                  </Tag>
                ) : (
                  <Tag className="" variant="outline" colorScheme="gray" borderRadius="full">
                    <TagLabel>Belum Mengumpulkan</TagLabel>
                  </Tag>
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
            <h3 className="text-sm font-semibold">Status Penilaian</h3>
            <p className="text-Gray-500">{feedback !== 'Menunggu untuk dinilai guru' ? 'Sudah Dinilai' : 'Belum Dinilai'}</p>
          </div>
          <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
            <h3 className="text-sm font-semibold">Deadline Tugas</h3>
            <p className="text-Gray-500">October 20, 2022</p>
          </div>
          <div className="py-5">
            <h3 className="text-sm font-semibold">Tambah Komentar</h3>
            <textarea className="w-full p-2 mt-2 border border-gray-300 rounded-md" rows={4} placeholder="Tambahkan komentar" disabled />
          </div>
        </div>
        {isSubmitted && (
          <div className="p-3 border-t border-gray-200">
            <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="text-Gray-500">
                {username} - {title}
              </p>
            </div>
            <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
              <h3 className="text-sm font-medium">Link Pengumpulan</h3>
              <a href={submission} className="text-blue-500 underline">
                {submission}
              </a>
            </div>
            {feedback !== 'Menunggu untuk dinilai guru' && (
              <>
                <h1 className="text-sm font-medium">Evaluasi</h1>
                <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
                  <h3 className="text-sm font-medium">Point</h3>
                  <p className="text-Gray-500">{grade}</p>
                </div>
                <div className="flex flex-col py-5 lg:flex-row lg:gap-10">
                  <h3 className="text-sm font-medium">Feedback</h3>
                  <p className="text-Gray-500">{feedback}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}

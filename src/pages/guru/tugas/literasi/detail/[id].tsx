import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { FaRegFilePdf } from 'react-icons/fa6';
import PrimaryButton from '@/components/PrimaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Spinner, Tag, TagLabel } from '@chakra-ui/react';

export default function DetailLiterasi() {
  const router = useRouter();
  const { id } = router.query;
  const [literationDetail, setLiterationDetail] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [point, setPoint] = React.useState('');
  const [feedback, setFeedback] = React.useState('');

  React.useEffect(() => {
    if (id) {
      fetchLiterationDetail(id);
    }
  }, [id]);

  const fetchLiterationDetail = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/literation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLiterationDetail(response.data.data);
      setPoint(response.data.data.point?.toString() || '');
      setFeedback(response.data.data.feedback || '');
    } catch (error) {
      console.error('Error fetching literation detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/literation/${id}/update`,
        {
          point: point ? Number(point) : 0,
          feedback,
          status: point ? 'Sudah Dinilai' : 'Belum Dinilai'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        router.push('/guru/tugas/literasi');
      }
    } catch (error) {
      console.error('Error saving literation detail:', error);
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Tugas" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Tugas" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="font-semibold text-Gray-900">{literationDetail.title}</h1>
          </div>
          <div className="flex flex-col gap-10 p-5 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="font-semibold text-Gray-600">
              <span className="font-medium text-Gray-500">Nama Siswa :</span> {literationDetail.student}
            </h1>
          </div>
          <div className="flex flex-col gap-5 p-5">
            <h1 className="text-sm font-semibold text-Gray-600">Rangkuman Literasi</h1>
            <div className="w-full p-3 text-sm font-medium border rounded-lg h-fit text-Gray-500">{literationDetail.description}</div>
            <h1 className="text-sm font-semibold text-Gray-600">File(s) Tugas</h1>
            <div className="w-full p-3 text-sm font-medium border rounded-lg h-fit text-Gray-500">{literationDetail.documents}</div>
            <h1 className="text-sm font-semibold text-Gray-600">Evaluasi</h1>
            <table className="border-separate border-spacing-y-6">
              <tbody>
                <tr className="">
                  <td className="">
                    <h1 className="text-sm font-semibold text-Gray-600">Point</h1>
                  </td>
                  <td className="flex flex-col gap-4 lg:items-center lg:flex-row">
                    <input
                      type="number"
                      name='point'
                      className="p-2 border rounded-lg w-fit h-fit"
                      value={point}
                      onChange={(e) => setPoint(e.target.value)}
                    />
                    <h1 className="text-sm text-Gray-500">Evaluasi tugas ini dengan nilai antara 0 sampai 100</h1>
                  </td>
                </tr>
                <tr>
                  <td className="">
                    <h1 className="text-sm font-semibold text-Gray-600">Feedback</h1>
                  </td>
                  <td>
                    <textarea
                      name="feedback"
                      className="p-2 border rounded-lg"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      id=""
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <td className=""></td>
                  <td>
                    <PrimaryButton size='mini' btnClassName="" onClick={handleSave}>
                      Beri Nilai Tugas Ini
                    </PrimaryButton>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

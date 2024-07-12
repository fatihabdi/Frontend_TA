import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { FaRegFilePdf } from 'react-icons/fa6';
import PrimaryButton from '@/components/PrimaryButton';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

export default function DetailTugas() {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  const [assignment, setAssignment] = React.useState({
    id: '',
    task: '',
    student: '',
    submission: '',
    grade: 0,
    feedback: '',
    submit_at: ''
  });

  React.useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/task/assignment/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then((response) => {
          if (response.data && response.data.data) {
            setAssignment(response.data.data);
          } else {
            toast({
              title: 'Error',
              description: 'Failed to fetch assignment details',
              status: 'error',
              duration: 5000,
              isClosable: true
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching assignment details:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch assignment details',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    }
  }, [id, toast]);

  const handleSubmit = () => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/task/${id}/grade`,
        { grade: assignment.grade, feedback: assignment.feedback },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      .then((response) => {
        toast({
          title: 'Success',
          description: 'Grade and feedback submitted successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        router.push('/guru/tugas/status');
      })
      .catch((error) => {
        console.error('Error submitting grade and feedback:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit grade and feedback',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Detail Tugas" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex justify-between p-3 lg:border-b border-Gray-200">
            <h1 className="font-semibold text-Gray-600">
              <span className="font-medium text-Gray-500">Waktu Pengumpulan :</span> {new Date(assignment.submit_at).toLocaleString()}
            </h1>
            <h1 className="font-semibold text-Gray-600">
              <span className="font-medium text-Gray-500">Nama Siswa :</span> {assignment.student}
            </h1>
            <h1 className="font-semibold text-Gray-600">Nama Tugas : {assignment.task}</h1>
          </div>
          <div className="flex flex-col gap-5 p-5">
            <h1 className="text-sm font-semibold text-Gray-600">Deskripsi Tugas</h1>
            <div className="w-full p-3 text-sm font-medium border rounded-lg h-fit text-Gray-500">{assignment.task}</div>
            <h1 className="text-sm font-semibold text-Gray-600">Link File Tugas</h1>
            <a
              href={`https://${assignment.submission}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 text-sm font-medium border rounded-lg h-fit underline text-Primary-400"
            >
              {assignment.submission}
            </a>
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
                      className="p-2 border rounded-lg w-fit h-fit"
                      value={assignment.grade}
                      onChange={(e) => setAssignment({ ...assignment, grade: parseInt(e.target.value) })}
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
                      name=""
                      className="p-2 border rounded-lg"
                      value={assignment.feedback}
                      onChange={(e) => setAssignment({ ...assignment, feedback: e.target.value })}
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <PrimaryButton btnClassName="" size="mini" onClick={handleSubmit}>
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

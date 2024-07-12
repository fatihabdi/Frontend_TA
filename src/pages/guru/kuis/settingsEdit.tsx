import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

export default function Settings() {
  const [quizData, setQuizData] = React.useState({
    id: '',
    title: '',
    description: '',
    deadline: '',
    type_of_quiz: '' // Added type_of_quiz to the state
  });
  const router = useRouter();
  const toast = useToast();
  const { quizid } = router.query; // Get quiz ID from query parameters

  React.useEffect(() => {
    if (quizid) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${quizid}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          const quiz = response.data.data;
          setQuizData({
            id: quizid,
            title: quiz.title || '',
            description: quiz.description || '',
            deadline: quiz.deadline ? new Date(quiz.deadline).toISOString().split('T')[0] : '',
            type_of_quiz: quiz.type_of_quiz || '' // Set type_of_quiz from the fetched data
          });
        })
        .catch((error) => {
          console.error('Error fetching quiz details:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch quiz details',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    }
  }, [quizid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!quizData.id) {
      toast({
        title: 'Error',
        description: 'Quiz ID is missing',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    const token = localStorage.getItem('token');
    const updatedQuizData = {
      title: quizData.title,
      type_of_quiz: quizData.type_of_quiz, // Use the type_of_quiz from the fetched data
      description: quizData.description,
      deadline: new Date(quizData.deadline).toISOString()
    };

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${quizData.id}/update`, updatedQuizData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast({
        title: 'Success',
        description: 'Quiz updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      router.push('/guru/kuis/list');
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quiz',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="Setting Kuis" />
        <div className="w-full rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <PrimaryButton
                btnClassName="w-fit h-fit bg-Base-White text-Primary-500 rounded"
                onClick={() => router.push(`/guru/kuis/edit?id=${quizid}`)}
              >
                Pertanyaan
              </PrimaryButton>
              <PrimaryButton btnClassName="w-fit h-fit bg-Primary-50 text-Primary-700 rounded">Pengaturan</PrimaryButton>
            </div>
            <div className="flex items-center gap-3">
              <PrimaryButton btnClassName="w-fit h-fit" onClick={handleSave}>
                Simpan
              </PrimaryButton>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-5">
            <label htmlFor="judul">Judul</label>
            <TextInput name="title" value={quizData.title} placeholder="Judul Kuis" onChange={handleChange} />
            <label htmlFor="deskripsi">Deskripsi</label>
            <textarea
              name="description"
              value={quizData.description}
              placeholder="Deskripsi Kuis"
              className="border border-[#D0D5DD] rounded-lg p-2"
              onChange={handleChange}
            />
            <label htmlFor="deadline">Set Deadline</label>
            <TextInput name="deadline" type="date" value={quizData.deadline} onChange={handleChange} />
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

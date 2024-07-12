import * as React from 'react';
import { useRouter } from 'next/router';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

export default function Essay() {
  const router = useRouter();
  const { quizid, questionIndex, question, questionid } = router.query;
  const [pertanyaan, setPertanyaan] = React.useState('');
  const toast = useToast();

  React.useEffect(() => {
    if (question) {
      const questionData = JSON.parse(question as string);
      setPertanyaan(questionData.text);
    }
  }, [question]);

  const handleSaveQuestion = async () => {
    const newQuestion = {
      text: pertanyaan,
      options: [],
      correct_answer: ''
    };

    const url = questionid
      ? `${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/question/${questionid}/update`
      : `${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${quizid}/question/add`;

    try {
      const response = await axios({
        method: questionid ? 'put' : 'post',
        url: url,
        data: newQuestion,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200 || response.status === 204) {
        // Update localStorage
        const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
        if (Array.isArray(quizzes)) {
          const quizIndex = quizzes.findIndex((q) => q.id === quizid);
          if (quizIndex > -1) {
            if (questionid) {
              quizzes[quizIndex].questions[questionIndex] = newQuestion;
            } else {
              quizzes[quizIndex].questions.push(newQuestion);
            }
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
          }
        } else {
          console.error('Quizzes is not an array');
        }

        toast({
          title: 'Success',
          description: `Question ${questionid ? 'updated' : 'added'} successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        localStorage.setItem('question', JSON.stringify(newQuestion));
        router.push({
          pathname: '/guru/kuis/edit',
          query: { id: quizid }
        }); // Redirect to the appropriate page after saving
      } else {
        throw new Error(`Unexpected response status: ${response.status}`); // Trigger catch block for non-successful responses
      }
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || `Failed to ${questionid ? 'update' : 'add'} question`,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="Edit Essay Question" />
        <div className="w-full p-3 border rounded-md shadow border-Gray-200 bg-Base-white h-fit">
          <div className="p-3 border-b border-Gray-200">
            <h1 className="text-lg font-semibold">{questionid ? 'Edit' : 'Add'} Essay Question</h1>
          </div>
          <div className="flex flex-col gap-5 p-5">
            <label htmlFor="pertanyaan" className="text-sm font-semibold text-Gray-600">
              Masukkan Pertanyaan Disini
            </label>
            <textarea
              name="pertanyaan"
              id="pertanyaan"
              className="border border-[#D0D5DD] rounded-lg p-2 mt-3"
              placeholder="Proses memasak makanan pada tumbuhan disebut dengan?"
              value={pertanyaan}
              onChange={(e) => setPertanyaan(e.target.value)}
            />
            <div className="flex justify-start gap-5">
              <PrimaryButton btnClassName="w-fit h-fit" onClick={handleSaveQuestion}>
                Simpan
              </PrimaryButton>
              <SecondaryButton btnClassName="w-fit h-fit" onClick={() => router.push(`/guru/kuis/edit?id=${quizid}`)}>
                Batalkan
              </SecondaryButton>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

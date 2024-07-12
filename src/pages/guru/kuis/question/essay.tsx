import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import TextInput from '@/components/TextInput';
import { useRouter } from 'next/router';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

export default function Essay() {
  const [pertanyaan, setPertanyaan] = React.useState('');
  const [editIndex, setEditIndex] = React.useState(null);
  const router = useRouter();

  React.useEffect(() => {
    const editQuestionData = JSON.parse(localStorage.getItem('editQuestion'));
    if (editQuestionData) {
      setPertanyaan(editQuestionData.question.text);
      setEditIndex(editQuestionData.index);
      localStorage.removeItem('editQuestion');
    }
  }, []);

  const handleSaveQuestion = () => {
    const newQuestion = {
      text: pertanyaan,
      options: [],
      correct_answer: ''
    };

    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    if (quizzes.length > 0) {
      if (editIndex !== null) {
        quizzes[0].questions[editIndex] = newQuestion;
      } else {
        quizzes[0].questions.push(newQuestion);
      }
      localStorage.setItem('quizzes', JSON.stringify(quizzes));
    }

    router.push('/guru/kuis/create');
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="Create Kuis" />
        <div className="w-full p-3 border rounded-md shadow border-Gray-200 bg-Base-white h-fit">
          <div className="p-3 border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Essay</h1>
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
              <SecondaryButton btnClassName="w-fit h-fit" onClick={() => router.push('/guru/kuis/create')}>
                Batalkan
              </SecondaryButton>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

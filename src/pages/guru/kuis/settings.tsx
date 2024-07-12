import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import Checkbox from '@/components/Checkbox';
import TextInput from '@/components/TextInput';
import { useRouter } from 'next/router';

export default function Settings() {
  const [quizData, setQuizData] = React.useState({ title: '', description: '', deadline: '' });
  const router = useRouter();

  React.useEffect(() => {
    const storedQuizData = JSON.parse(localStorage.getItem('quizData')) || {};
    setQuizData(storedQuizData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleSave = () => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    if (quizzes.length > 0) {
      quizzes[0] = { ...quizzes[0], ...quizData };
      localStorage.setItem('quizzes', JSON.stringify(quizzes));
    }
    localStorage.removeItem('quizData');
    router.push('/guru/kuis/create');
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="Create Kuis" />
        <div className="w-full rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <PrimaryButton
                btnClassName="w-fit h-fit bg-Base-White text-Primary-500 rounded"
                onClick={() => router.push('/guru/kuis/create')}
              >
                Pertanyaan
              </PrimaryButton>
              <PrimaryButton btnClassName="w-fit h-fit bg-Primary-50 text-Primary-700 rounded" onClick={() => console.log('clicked')}>
                Pengaturan
              </PrimaryButton>
            </div>
            <div className="flex items-center gap-3">
              <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={handleSave}>
                Simpan
              </PrimaryButton>
            </div>
          </div>
          <div className="flex flex-col gap-5 p-5">
            <label htmlFor="title">Judul</label>
            <TextInput name="title" placeholder="Judul Kuis" value={quizData.title} onChange={handleChange} />
            <label htmlFor="description">Deskripsi</label>
            <textarea
              name="description"
              placeholder="Deskripsi Kuis"
              className="border border-[#D0D5DD] rounded-lg p-2"
              value={quizData.description}
              onChange={handleChange}
            />
            <label htmlFor="deadline">Set Deadline</label>
            <TextInput name="deadline" type="date" placeholder={quizData.deadline} value={quizData.deadline} onChange={handleChange} />
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

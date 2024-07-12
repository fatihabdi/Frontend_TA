import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import Seo from '@/components/Seo';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import * as React from 'react';
import { FiEdit } from 'react-icons/fi';
import { HiDotsVertical } from 'react-icons/hi';
import { Menu, MenuButton, IconButton, MenuList, MenuItem, useToast } from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function QuizDetail() {
  const [questions, setQuestions] = React.useState([]);
  const [quizTitle, setQuizTitle] = React.useState('');
  const [quizType, setQuizType] = React.useState('');
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query; // Get quiz ID from query parameters

  React.useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          const quiz = response.data.data;
          setQuestions(quiz.questions || []);
          setQuizTitle(quiz.title || '');
          setQuizType(quiz.type_of_quiz || '');
        })
        .catch((error) => {
          console.error('Error fetching quiz:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch quiz details',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    }
  }, [id]);

  const handleAddQuestion = () => {
    if (quizType === 'Multiple Choice') {
      router.push({
        pathname: '/guru/kuis/edit/pilihanganda',
        query: { quizid: id }
      });
    } else if (quizType === 'Essay') {
      router.push({
        pathname: '/guru/kuis/edit/essay',
        query: { quizid: id }
      });
    }
  };

  const handleEditQuestion = (questionid, questionIndex, question) => {
    const editPath = quizType === 'Multiple Choice' ? '/guru/kuis/edit/pilihanganda' : '/guru/kuis/edit/essay';
    router.push({
      pathname: editPath,
      query: { quizid: id, questionid, questionIndex, question: JSON.stringify(question) }
    });
  };

  const handleBack = () => {
    router.push('/guru/kuis/list');
  };

  const handleSettingsEdit = () => {
    router.push({
      pathname: '/guru/kuis/settingsEdit',
      query: { quizid: id }
    });
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="Quiz Details" />
        <div className="w-full rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <PrimaryButton btnClassName="w-fit h-fit bg-Primary-50 text-Primary-700 rounded" onClick={() => console.log('clicked')}>
                Pertanyaan
              </PrimaryButton>
              <PrimaryButton btnClassName="w-fit h-fit bg-Base-white text-Gray-500 rounded" onClick={handleSettingsEdit}>
                Pengaturan
              </PrimaryButton>
            </div>
            <div className="flex items-center gap-3">
              <PrimaryButton btnClassName="w-fit h-fit" onClick={handleBack}>
                Back
              </PrimaryButton>
            </div>
          </div>
          {questions.length > 0 ? (
            questions.map((item, index) => (
              <div className="flex items-center justify-between w-full p-5 border-b h-fit bg-Gray-50 border-Gray-200" key={index}>
                <div className="flex gap-3">
                  <label htmlFor={item.text}>{item.text}</label>
                </div>
                <Menu>
                  <MenuButton as={IconButton} icon={<HiDotsVertical className="text-Gray-500" />} variant="ghost" />
                  <MenuList>
                    <MenuItem icon={<FiEdit />} onClick={() => handleEditQuestion(item.id, index, item)}>
                      Edit
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-Gray-600">Tidak ada pertanyaan ditemukan</div>
          )}
          <div className="px-5 pt-5 pb-10 lg:flex lg:justify-end">
            <SecondaryButton btnClassName="w-full h-fit lg:w-fit" leftIcon={<MdAdd className="text-lg" />} onClick={handleAddQuestion}>
              Pertanyaan
            </SecondaryButton>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

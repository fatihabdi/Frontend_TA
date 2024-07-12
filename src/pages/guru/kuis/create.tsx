import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import Seo from '@/components/Seo';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import * as React from 'react';
import { BsEye } from 'react-icons/bs';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { HiDotsVertical } from 'react-icons/hi';
import { Menu, MenuButton, IconButton, MenuList, MenuItem, useToast } from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function CreateKuis() {
  const [questions, setQuestions] = React.useState([]);
  const router = useRouter();
  const toast = useToast();

  React.useEffect(() => {
    const class_id = localStorage.getItem('class_id');
    const subject_id = localStorage.getItem('subject_id');
    if (!class_id || !subject_id) {
      toast({
        title: 'Error',
        description: 'Missing class or subject ID',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      router.push('/guru/kuis/list');
    }

    // Fetch questions from localStorage
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const storedQuestions = storedQuizzes.length > 0 ? storedQuizzes[0].questions : [];
    setQuestions(storedQuestions);
  }, [toast, router]);

  const handleAddQuestion = () => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    if (quizzes.length > 0) {
      const quizType = quizzes[0].type_of_quiz;
      if (quizType === 'Multiple Choice') {
        router.push('/guru/kuis/question/pilihanganda');
      } else if (quizType === 'Essay') {
        router.push('/guru/kuis/question/essay');
      }
    }
  };

  const handleEdit = (index) => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    if (quizzes.length > 0) {
      const quizType = quizzes[0].type_of_quiz;
      const question = questions[index];
      localStorage.setItem('editQuestion', JSON.stringify({ index, question }));
      if (quizType === 'Multiple Choice') {
        router.push('/guru/kuis/question/pilihanganda');
      } else if (quizType === 'Essay') {
        router.push('/guru/kuis/question/essay');
      }
    }
  };

  const handleDelete = (index) => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    if (quizzes.length > 0) {
      quizzes[0].questions.splice(index, 1);
      localStorage.setItem('quizzes', JSON.stringify(quizzes));
      setQuestions(quizzes[0].questions);
    }
  };

  const handleSaveQuiz = () => {
    const class_id = localStorage.getItem('class_id');
    const subject_id = localStorage.getItem('subject_id');
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    if (quizzes.length > 0) {
      const quizData = quizzes[0];
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${class_id}/${subject_id}/create`, quizData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          toast({
            title: 'Success',
            description: 'Quiz created successfully',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          localStorage.removeItem('quizzes');
          localStorage.removeItem('class_id');
          localStorage.removeItem('subject_id');
          router.push('/guru/kuis/list');
        })
        .catch((error) => {
          console.error('Error creating quiz:', error);
          toast({
            title: 'Error',
            description: 'Failed to create quiz',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    }
  };

  const handlePengaturan = () => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    if (quizzes.length > 0) {
      const quizData = quizzes[0];
      localStorage.setItem('quizData', JSON.stringify(quizData));
      router.push('/guru/kuis/settings');
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="Create Kuis" />
        <div className="w-full rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <PrimaryButton btnClassName="w-fit h-fit bg-Primary-50 text-Primary-700 rounded" onClick={() => console.log('clicked')}>
                Pertanyaan
              </PrimaryButton>
              <PrimaryButton btnClassName="w-fit h-fit bg-Base-white text-Gray-500 rounded" onClick={handlePengaturan}>
                Pengaturan
              </PrimaryButton>
            </div>
            <div className="flex items-center gap-3">
              <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={handleSaveQuiz}>
                Simpan
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
                    <MenuItem icon={<FiEdit />} onClick={() => handleEdit(index)}>
                      Edit
                    </MenuItem>
                    <MenuItem icon={<FiTrash2 />} onClick={() => handleDelete(index)}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-Gray-600">Tidak ada pertanyaan ditemukan</div>
          )}
          <div className="px-5 pt-5 pb-10 lg:flex lg:justify-end">
            <SecondaryButton
              size="mini"
              btnClassName="w-full h-fit lg:w-fit"
              leftIcon={<MdAdd className="text-lg" />}
              onClick={handleAddQuestion}
            >
              Pertanyaan
            </SecondaryButton>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

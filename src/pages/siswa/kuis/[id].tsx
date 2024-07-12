import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import * as React from 'react';
import Seo from '@/components/Seo';
import SecondaryButton from '@/components/SecondaryButton';
import {
  Box,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { LuBookOpen } from 'react-icons/lu';
import PrimaryButton from '@/components/PrimaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Question {
  text: string;
  type_of_question: string;
  options: string[];
  correct_answer: string;
  number?: number;
}

interface RadioCardProps extends UseRadioProps {
  children: React.ReactNode;
}

function RadioCard(props: RadioCardProps) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" w="full">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'blue.50',
          color: 'black',
          borderColor: 'blue.900'
        }}
        _focus={{
          boxShadow: 'outline'
        }}
        px={5}
        py={3}
        w="full"
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default function PengerjaanKuis() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;

  const [response, setResponse] = React.useState<{
    id: string;
    class_id: string;
    subject_id: string;
    teacher_id: string;
    title: string;
    type_of_quiz: string;
    description: string;
    deadline: string;
    questions: Question[];
  }>({
    id: '',
    class_id: '',
    subject_id: '',
    teacher_id: '',
    title: '',
    type_of_quiz: '',
    description: '',
    deadline: '',
    questions: []
  });

  const [userAnswers, setUserAnswers] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/student/quiz/${id}/questions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          if (response.data && response.data.data) {
            const fetchedQuestions = response.data.data;
            const quizType = response.data.type_of_quiz;
            const numberedQuestions = fetchedQuestions.map((question, index) => ({
              ...question,
              options: [...question.options],
              number: index + 1
            }));
            localStorage.setItem('questions', JSON.stringify(numberedQuestions));
            setResponse((prevState) => ({
              ...prevState,
              questions: numberedQuestions,
              type_of_quiz: quizType
            }));
            setUserAnswers(Array(numberedQuestions.length).fill(''));
          } else {
            setResponse((prevState) => ({
              ...prevState,
              questions: []
            }));
            setUserAnswers([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching quiz questions:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch quiz questions',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    }
  }, [id, toast]);

  const handleAnswerChange = (index: number, answer: string) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = answer;
      localStorage.setItem('userAnswers', JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(response.questions.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const currentQuestions = response.questions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    value: userAnswers[currentPage - 1] || '',
    onChange: (value) => {
      handleAnswerChange(currentPage - 1, value);
    }
  });

  const group = getRootProps();

  const handleSubmit = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/student/quiz/${id}/submit`,
        { answers: userAnswers },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      .then(() => {
        // Clear localStorage
        localStorage.removeItem('questions');
        localStorage.removeItem('userAnswers');
        toast({
          title: 'Success',
          description: 'Quiz submitted successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        router.push(`/siswa/kuis/nilai?id=${id}`);
      })
      .catch((error) => {
        console.error('Error submitting quiz:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit quiz',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="Pengerjaan Kuis" />
        <div className="w-full p-3 rounded-md shadow bg-Base-white h-fit">
          <div className="flex flex-col justify-between gap-5 p-3">
            <h1 className="font-semibold">{response.title}</h1>
            <p className="text-sm font-medium text-Gray-500">{response.description}</p>
          </div>
        </div>
        <div className="flex flex-col justify-around w-full gap-5 lg:flex-row h-fit">
          <div className="flex flex-row items-center justify-around h-full lg:justify-start lg:flex-col bg-Base-white">
            <div className="p-6 lg:border-b border-Gray-200">
              <h1 className="text-xs font-semibold text-Gray-500">Question</h1>
            </div>
            <div className="flex flex-col items-center p-3">
              <h1 className="text-xs font-semibold text-Gray-500">Marked Out</h1>
              <h1 className="text-xs font-semibold">0.50</h1>
            </div>
          </div>
          <div className="flex flex-col items-center w-full h-full gap-5 p-5 bg-Base-white">
            {currentQuestions.length > 0 ? (
              currentQuestions.map((question, index) => (
                <div key={index} className="flex flex-col w-full gap-5">
                  <input type="text" value={question.text} disabled className="w-full p-3" />
                  {response.type_of_quiz === 'Multiple Choice' ? (
                    <div className="flex flex-col w-full gap-5" {...group}>
                      {question.options.map((value) => {
                        const radio = getRadioProps({ value });
                        return (
                          <RadioCard key={value} {...radio}>
                            {value}
                          </RadioCard>
                        );
                      })}
                    </div>
                  ) : (
                    <textarea
                      value={userAnswers[currentPage - 1]}
                      onChange={(e) => handleAnswerChange(currentPage - 1, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      rows={5}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-5 text-Gray-600">Tidak ada pertanyaan ditemukan</div>
            )}
            <div id="pagination" className="flex justify-between w-full p-3 border-t border-Gray-200">
              <SecondaryButton
                btnClassName={`font-semibold w-fit ${currentPage === 1 ? 'text-Gray-300 border-Gray-300' : ''}`}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </SecondaryButton>
              <span className="self-center">
                Page {currentPage} of {Math.ceil(response.questions.length / itemsPerPage)}
              </span>
              {currentPage === Math.ceil(response.questions.length / itemsPerPage) ? (
                <PrimaryButton btnClassName="font-semibold w-fit" onClick={onOpen}>
                  Finish Attempt
                </PrimaryButton>
              ) : (
                <SecondaryButton btnClassName="font-semibold w-fit" onClick={handleNextPage}>
                  Next
                </SecondaryButton>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-5 p-5 bg-Base-white">
            <h1 className="text-xs font-semibold text-Gray-900">Navigasi Kuis</h1>
            <div className="flex gap-2 lg:grid-cols-2 lg:grid">
              {response.questions.map((question, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 border rounded-full ${userAnswers[index] ? 'bg-Success-200 text-Base-white' : currentPage === index + 1 ? 'bg-Primary-400 text-Base-white' : 'bg-Base-white text-Base-black'}`}
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <SecondaryButton btnClassName="w-fit h-fit text-sm" onClick={onOpen}>
              Finish Attempt
            </SecondaryButton>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay backdropBlur="10px" />
          <ModalContent>
            <ModalHeader className="mt-3">
              <div className="p-2 w-[36px] rounded-full bg-Warning-100">
                <LuBookOpen className="text-Warning-600" />
              </div>
            </ModalHeader>
            <ModalCloseButton className="mt-4" />
            <ModalBody>
              <h1 className="text-lg font-semibold">Selesaikan Kuis</h1>
              <p className="text-sm">Apakah kamu ingin menyelesaikan kuis?</p>
              <p className="text-sm">Pastikan kamu sudah yakin dengan jawaban kamu</p>
            </ModalBody>

            <ModalFooter className="flex justify-center gap-3">
              <SecondaryButton onClick={onClose} btnClassName="font-semibold">
                Batal
              </SecondaryButton>
              <PrimaryButton onClick={handleSubmit} btnClassName="font-semibold">
                Konfirmasi
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </AuthenticatedLayout>
    </div>
  );
}

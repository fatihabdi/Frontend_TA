import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import * as React from 'react';
import Seo from '@/components/Seo';
import SecondaryButton from '@/components/SecondaryButton';
import {
  Box,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  Spinner,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input
} from '@chakra-ui/react';
import { LuBookOpen } from 'react-icons/lu';
import PrimaryButton from '@/components/PrimaryButton';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Question {
  text: string;
  type_of_question: string;
  options: string[];
  correct_answer: string;
  answer: string;
  number?: number;
}

interface RadioCardProps extends UseRadioProps {
  children: React.ReactNode;
  isCorrectAnswer: boolean;
  isUserAnswer: boolean;
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
        cursor="not-allowed"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        bg={props.isCorrectAnswer ? 'green.50' : props.isUserAnswer ? 'red.50' : ''}
        color={props.isCorrectAnswer ? 'green.900' : props.isUserAnswer ? 'red.900' : ''}
        borderColor={props.isCorrectAnswer ? 'green.900' : props.isUserAnswer ? 'red.900' : 'blue.900'}
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
    quiz_title: string;
    student_name: string;
    questions: Question[];
    grade: number;
  }>({
    quiz_title: '',
    student_name: '',
    questions: [],
    grade: 0
  });

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem('token');
        const quizResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/quiz/${id}/submission`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const fetchedQuizData = quizResponse.data.data;

        const questions = fetchedQuizData.questions.map((q, index) => ({
          text: q.text,
          type_of_question: q.type_of_question,
          options: q.options,
          correct_answer: q.correct_answer,
          answer: q.student_answer,
          number: index + 1
        }));

        setResponse({
          quiz_title: fetchedQuizData.title,
          student_name: 'Student', // Assuming the student name is not available in the response
          questions: questions,
          grade: fetchedQuizData.grade
        });
      } catch (error) {
        console.error('Error fetching quiz details:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch quiz details',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id, toast]);

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

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="Pengerjaan Kuis" />

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Spinner size="xl" />
          </div>
        ) : (
          <>
            <div className="flex bg-Base-white rounded flex-col justify-between gap-5 p-3">
              <h1 className="font-semibold">{response.quiz_title}</h1>
              <p className="text-sm font-medium text-Gray-500">{response.student_name}</p>
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
                {currentQuestions.map((question, index) => (
                  <div key={index} className="flex flex-col w-full gap-5">
                    <input type="text" value={question.text} disabled className="w-full p-3" />
                    <div className="flex flex-col w-full gap-3">
                      {question.options.map((option, idx) => {
                        return (
                          <RadioCard
                            key={idx}
                            isCorrectAnswer={option === question.correct_answer}
                            isUserAnswer={option === question.answer}
                            isDisabled
                          >
                            {option}
                          </RadioCard>
                        );
                      })}
                    </div>
                  </div>
                ))}
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
                  <SecondaryButton
                    btnClassName={`font-semibold w-fit ${currentPage === Math.ceil(response.questions.length / itemsPerPage) ? 'text-Gray-300 border-Gray-300' : ''}`}
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(response.questions.length / itemsPerPage)}
                  >
                    Next
                  </SecondaryButton>
                </div>
              </div>
              <div className="flex flex-col items-center gap-5 p-5 bg-Base-white">
                <h1 className="text-xs font-semibold text-Gray-900">Navigasi Kuis</h1>
                <div className="flex gap-2 lg:grid-cols-2 lg:grid">
                  {response.questions.map((question, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 border rounded-full ${
                        question.answer === question.correct_answer ? 'bg-Success-400 text-Base-white' : 'bg-Error-400 text-Base-white'
                      }`}
                      onClick={() => handlePageClick(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {response.questions[0].type_of_question === 'Essay' && (
              <div className="flex flex-col w-full gap-5 p-6 rounded-md shadow bg-Base-white h-fit">
                <h1 className="text-sm font-semibold text-Gray-600">Evaluasi</h1>
                <div className="flex items-center gap-4">
                  <h1 className="text-sm font-medium text-Gray-700">Point</h1>
                  <input type="number" className="p-2 border rounded-lg w-fit h-fit" value={response.grade} readOnly />
                  <h1 className="text-sm text-Gray-600">Evaluasi tugas ini dengan nilai antara 0 sampai 100</h1>
                </div>
                <PrimaryButton btnClassName="w-fit h-fit" onClick={onOpen}>
                  Edit Nilai Kuis
                </PrimaryButton>
              </div>
            )}
          </>
        )}
      </AuthenticatedLayout>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="p-2 rounded-full w-[36px] bg-Warning-100">
              <LuBookOpen className="rotate-0 text-Warning-600" />
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1 className="text-lg font-semibold">Edit Nilai</h1>
            <p className="text-sm font-light text-Gray-600">Masukkan nilai baru untuk kuis ini</p>
            <div className="flex flex-col gap-3 mt-3">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-Gray-700">Nilai</label>
                <Input
                  type="number"
                  value={response.grade}
                  onChange={(e) => setResponse({ ...response, grade: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-3">
            <SecondaryButton onClick={onClose} btnClassName="font-semibold">
              Batal
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                axios
                  .put(
                    `${process.env.NEXT_PUBLIC_API_URL}/teacher/quiz/${id}/grade`,
                    {
                      grade: response.grade
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                      }
                    }
                  )
                  .then(() => {
                    toast({
                      title: 'Success',
                      description: 'Grade updated successfully',
                      status: 'success',
                      duration: 5000,
                      isClosable: true
                    });
                    onClose();
                  })
                  .catch((error) => {
                    console.error('Error updating grade:', error);
                    toast({
                      title: 'Error',
                      description: 'Failed to update grade',
                      status: 'error',
                      duration: 5000,
                      isClosable: true
                    });
                  });
              }}
              btnClassName="font-semibold"
            >
              Update Nilai
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

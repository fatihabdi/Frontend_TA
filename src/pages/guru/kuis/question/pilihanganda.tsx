import * as React from 'react';
import { useRouter } from 'next/router';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Box, useRadio, useRadioGroup, UseRadioProps } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import SecondaryButton from '@/components/SecondaryButton';
import { MdAdd } from 'react-icons/md';
import PrimaryButton from '@/components/PrimaryButton';
import Checkbox from '@/components/Checkbox';

interface RadioCardProps extends UseRadioProps {
  children: React.ReactNode;
  isChecked: boolean;
}

function RadioCard(props: RadioCardProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" w="full" display="flex" alignItems="center">
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
        bg={props.isChecked ? 'blue.50' : ''}
        color={props.isChecked ? 'black' : ''}
        borderColor={props.isChecked ? 'blue.900' : ''}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default function PilihanGanda() {
  const router = useRouter();
  const [pertanyaan, setPertanyaan] = React.useState('');
  const [option, setOption] = React.useState(['']);
  const [correctAnswer, setCorrectAnswer] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);

  React.useEffect(() => {
    const editData = JSON.parse(localStorage.getItem('editQuestion'));
    if (editData) {
      setPertanyaan(editData.question.text);
      setOption(editData.question.options);
      setCorrectAnswer(editData.question.correct_answer);
      setIsEditing(true);
      setEditIndex(editData.index);
    }
  }, []);

  const handleAddOption = () => {
    if (option.length < 5) {
      setOption([...option, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    setOption(option.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOption = [...option];
    newOption[index] = value;
    setOption(newOption);
  };

  const handleCheckboxChange = (value: string) => {
    setCorrectAnswer(value);
  };

  const handleSaveQuestion = () => {
    const newQuestion = {
      text: pertanyaan,
      options: option,
      correct_answer: correctAnswer
    };

    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    if (quizzes.length > 0) {
      if (isEditing) {
        quizzes[0].questions[editIndex] = newQuestion;
        localStorage.removeItem('editQuestion');
      } else {
        quizzes[0].questions.push(newQuestion);
      }
      localStorage.setItem('quizzes', JSON.stringify(quizzes));
    }
    router.push('/guru/kuis/create');
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework'
  });

  const group = getRootProps();

  return (
    <div>
      <AuthenticatedLayout>
        <Seo title="Create Kuis" />
        <div className="w-full p-3 border rounded-md shadow border-Gray-200 bg-Base-white h-fit">
          <div className="p-3 border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Pilihan Ganda</h1>
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
            <div className="flex flex-col gap-5">
              <div className="flex flex-col w-full gap-3" {...group}>
                {option.map((value, index) => {
                  const radio = getRadioProps({ value });
                  return (
                    <div key={index} className="flex items-center w-full gap-3">
                      <RadioCard {...radio} isChecked={correctAnswer === value}>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="w-full p-3 rounded-lg"
                        />
                      </RadioCard>
                      <Box
                        as="label"
                        className={`flex items-center justify-center p-8 text-gray-500 border rounded-md ${correctAnswer === value ? 'border-Primary-900' : 'border-[#D0D5DD]'}`}
                      >
                        <Checkbox checked={correctAnswer === value} onChange={() => handleCheckboxChange(value)} />
                      </Box>
                      <Box
                        as="button"
                        onClick={() => handleRemoveOption(index)}
                        className="flex items-center justify-center p-8 text-gray-500 border border-[#D0D5DD] rounded-md"
                      >
                        <FiTrash2 className="" />
                      </Box>
                    </div>
                  );
                })}
              </div>
              {option.length < 5 && (
                <SecondaryButton btnClassName="w-fit h-fit" leftIcon={<MdAdd className="text-lg" />} onClick={handleAddOption}>
                  Tambah Jawaban Lain
                </SecondaryButton>
              )}
            </div>

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

import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { DayPicker, DayMouseEventHandler } from 'react-day-picker';
import Holidays from 'date-holidays';
import { isSameDay } from 'date-fns';
import PrimaryButton from '@/components/PrimaryButton';
import { Select, useToast } from '@chakra-ui/react';
import { FiSearch, FiCalendar, FiBook, FiInfo } from 'react-icons/fi';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { PiFlagBannerBold } from 'react-icons/pi';
import SecondaryButton from '@/components/SecondaryButton';
import axios from 'axios';
import dayjs from 'dayjs';
import { format } from 'date-fns';

export default function PreviewTugas() {
  const initiallySelectedDate = new Date();
  const [disabledDays, setDisabledDays] = React.useState([]);
  const [selectedDates, setSelectedDates] = React.useState([initiallySelectedDate]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const calendarContainerRef = React.useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [classSubjectData, setClassSubjectData] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [formData, setFormData] = React.useState({
    class_id: '',
    subject_id: '',
    title: '',
    type_of_task: '',
    description: '',
    deadline: initiallySelectedDate.toISOString().split('T')[0],
    link: ''
  });

  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    const hd = new Holidays('ID');
    const currentYear = new Date().getFullYear();
    const holidays = hd.getHolidays(currentYear);
    const holidayDates = holidays.map((holiday) => new Date(holiday.date));
    setDisabledDays(holidayDates);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          const classSubjectData = response.data.data;
          setClassSubjectData(classSubjectData);

          const uniqueClasses = [];
          const uniqueSubjects = [];
          classSubjectData.forEach((item) => {
            if (!uniqueClasses.some((cls) => cls.class_id === item.class_id)) {
              uniqueClasses.push({ class_id: item.class_id, class_name: item.class_name });
            }
            if (!uniqueSubjects.some((sub) => sub.subject_id === item.subject_id)) {
              uniqueSubjects.push({ subject_id: item.subject_id, subject_name: item.subject_name });
            }
          });
          setClasses(uniqueClasses);
          setSubjects(uniqueSubjects);
        } else {
          setClassSubjectData([]);
          setClasses([]);
          setSubjects([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching classes and subjects:', error);
        setClassSubjectData([]);
        setClasses([]);
        setSubjects([]);
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/task/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setTasks(response.data.data);
        } else {
          setTasks([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      });
  }, []);

  const handleDayClick: DayMouseEventHandler = (day) => {
    if (selectedDates.some((selectedDate) => isSameDay(selectedDate, day))) {
      setSelectedDates(selectedDates.filter((selectedDate) => !isSameDay(selectedDate, day)));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      deadline: day.toISOString().split('T')[0]
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
    const formattedDeadline = formData.deadline ? dayjs(formData.deadline).hour(23).minute(59).second(0).format('YYYY-MM-DD HH:mm:ss') : '';

    const updatedFormData = { ...formData, deadline: formattedDeadline };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/teacher/task/create`, updatedFormData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        toast({
          title: 'Success',
          description: 'Task created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onClose();
        setFormData({
          class_id: '',
          subject_id: '',
          title: '',
          type_of_task: '',
          description: '',
          deadline: initiallySelectedDate.toISOString().split('T')[0],
          link: ''
        });
      })
      .catch((error) => {
        console.error('Error creating task:', error);
        toast({
          title: 'Error',
          description: 'Failed to create task',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-4 rounded-md shadow-lg h-fit bg-Base-white" ref={calendarContainerRef}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:border-b lg:border-Gray-200 lg:px-5 lg:pb-5">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Daftar Tugas</h1>
              <PrimaryButton btnClassName="w-fit lg:hidden" onClick={onOpen}>
                Buat Tugas
              </PrimaryButton>
            </div>
            <div className="flex items-center justify-center gap-5">
              <Select placeholder="Mata Pelajaran" size="md">
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_name}
                  </option>
                ))}
              </Select>
              <Select placeholder="Kelas" size="md">
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
              <PrimaryButton btnClassName="lg:flex w-fit h-fit hidden" onClick={onOpen}>
                Buat Tugas
              </PrimaryButton>
            </div>
          </div>
          <DayPicker
            mode="multiple"
            selected={selectedDates}
            onDayClick={handleDayClick}
            disabled={disabledDays}
            styles={{
              head_cell: {
                width: `${calendarContainerRef.current?.clientWidth ?? 0}px`
              },
              table: {
                maxWidth: 'none'
              },
              day: {
                width: '',
                margin: 'auto'
              }
            }}
          />
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
                placeholder="Search"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-4 border rounded-md shadow-sm">
                <h2 className="font-semibold text-[#6941C6]">Tugas</h2>
                <h3 className="mt-2 text-lg font-bold">{task.title}</h3>
                <div className="justify-between lg:flex">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-3 mt-2 text-gray-500">
                      <FiCalendar />
                      <span>Start: {format(new Date(task.created_at), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-gray-500">
                      <FiBook />
                      <span>{task.type_of_task}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1 font-semibold text-Gray-600">
                    <h1>
                      <span className="text-Gray-900">Deadline :</span> {format(new Date(task.deadline), 'MMMM d, yyyy')}
                    </h1>
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && <div className="text-center py-5 text-Gray-600">Tidak ada tugas ditemukan</div>}
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
                <PiFlagBannerBold className="rotate-0" />
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="text-lg font-semibold">Tugas</h1>
              <p className="text-sm font-light text-Gray-600">Isi kolom berikut untuk menambah atau mengedit tugas</p>
              <form className="mt-3">
                <label htmlFor="class_id" className="text-sm text-Gray-600">
                  Kelas
                </label>
                <Select
                  id="class_id"
                  name="class_id"
                  placeholder="Pilih Kelas"
                  size="md"
                  value={formData.class_id}
                  onChange={handleInputChange}
                >
                  {classes.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.class_name}
                    </option>
                  ))}
                </Select>
                <label htmlFor="subject_id" className="mt-2 text-sm text-Gray-600">
                  Mata Pelajaran
                </label>
                <Select
                  id="subject_id"
                  name="subject_id"
                  placeholder="Pilih Mata Pelajaran"
                  size="md"
                  value={formData.subject_id}
                  onChange={handleInputChange}
                >
                  {subjects.map((subject) => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </Select>
                <label htmlFor="title" className="mt-2 text-sm text-Gray-600">
                  Judul
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <div className="flex flex-col mt-2 mb-2">
                  <label htmlFor="type_of_task" className="text-sm text-Gray-600">
                    Jenis Tugas
                  </label>
                  <select
                    name="type_of_task"
                    id="type_of_task"
                    value={formData.type_of_task}
                    onChange={handleInputChange}
                    className="p-2 mt-2 border-2 rounded-md border-Gray-300"
                  >
                    <option value="Tugas Harian">Tugas Harian</option>
                    <option value="Ulangan Harian">Ulangan Harian</option>
                    <option value="Proyek">Proyek</option>
                  </select>
                </div>
                <label htmlFor="description" className="text-sm text-Gray-600">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="cth. Buat artikel mengenai keluarga dalam bahasa inggris..."
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <label htmlFor="deadline" className="text-sm text-Gray-600">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                />
                <label htmlFor="link" className="text-sm text-Gray-600">
                  Link
                </label>
                <div className="relative flex items-center mt-2 mb-2 border-2 rounded-md border-Gray-300">
                  <span className="px-3 border-r text-Gray-600">https://</span>
                  <input
                    type="text"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full p-2 border-0 rounded-r-md focus:outline-none"
                    placeholder="www.example.com"
                  />
                </div>
                <div className="flex w-full gap-2 text-Gray-600">
                  <FiInfo className="text-md" />
                  <p className="text-sm">Dapat diisi dengan pendukung seperti Google forms, Video YouTube dan lainnya</p>
                </div>
              </form>
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

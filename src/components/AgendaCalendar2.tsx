import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Select
} from '@chakra-ui/react';
import { PiFlagBannerBold } from 'react-icons/pi';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import clsxm from '@/lib/clsxm';
import axios from 'axios';
import { useRouter } from 'next/router';

type AgendaCalendarProps = {
  className?: string;
};

export default function AgendaCalendar({ className, ...rest }: AgendaCalendarProps) {
  const { isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose } = useDisclosure();
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure();
  const toast = useToast();
  const [agendas, setAgendas] = React.useState([]);
  const router = useRouter();
  const [selectedAgenda, setSelectedAgenda] = React.useState(null);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    date: '',
    location: '',
    type_of_agenda: '',
    start_time: '',
    end_time: ''
  });

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/agenda/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setAgendas((prevAgendas) => prevAgendas.filter((agenda) => agenda.id !== id));
          toast({
            title: 'Agenda berhasil dihapus',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          onSecondModalClose();
        } else {
          console.error('Failed to delete agenda');
          toast({
            title: 'Error',
            description: 'Gagal menghapus agenda',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting agenda:', error);
        toast({
          title: 'Error',
          description: 'Gagal menghapus agenda',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/agenda`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setAgendas(response.data.data || []);
      })
      .catch((error) => {
        console.error('Error fetching agendas:', error);
        setAgendas([]);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data agenda',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    let formattedValue = value;

    if (id === 'start_time' || id === 'end_time') {
      formattedValue = value + ':00'; // Append ":00" to make it HH:MM:SS
    }

    setFormData((prevData) => ({
      ...prevData,
      [id]: formattedValue
    }));
  };

  const handleCreateAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/admin/agenda/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.status === 201) {
          const newAgenda = response.data.data;
          setAgendas((prevAgendas) => [...prevAgendas, newAgenda]);
          toast({
            title: 'Agenda berhasil dibuat',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          onFirstModalClose();
          router.reload();
        }
      })
      .catch((error) => {
        console.error('Error creating agenda:', error);
        toast({
          title: 'Error',
          description: error.response.data.error,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  console.log(formData);

  return (
    <div className={clsxm('', className)} {...rest}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height={800}
        droppable={true}
        dayMaxEventRows={true}
        dayMaxEvents={true}
        eventMaxStack={3}
        eventClick={(clickInfo) => {
          const agendaId = clickInfo.event.id;
          const selected = agendas.find((agenda) => agenda.id === agendaId);
          setSelectedAgenda(selected);
          onSecondModalOpen();
        }}
        views={{
          dayGridMonth: {
            dayMaxEventRows: 2
          },
          timeGridWeek: {
            dayMaxEventRows: 2
          }
        }}
        timeZone="UTC"
        editable={true}
        eventStartEditable={true}
        eventDurationEditable={true}
        eventResizableFromStart={true}
        events={agendas.map((agenda) => ({
          id: agenda.id,
          title: agenda.title,
          start: `${agenda.date}T${agenda.start_time}`,
          end: `${agenda.date}T${agenda.end_time}`,
          color: 'blue',
          allDay: false
        }))}
        customButtons={{
          myCustomButton: {
            text: 'Tambah Agenda',
            click: function () {
              onFirstModalOpen();
            }
          }
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: '',
          right: 'dayGridMonth,timeGridWeek,timeGridDay myCustomButton'
        }}
      />
      <Modal isOpen={isFirstModalOpen} onClose={onFirstModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
              <PiFlagBannerBold className="rotate-0" />
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1 className="text-lg font-semibold">Buat Agenda</h1>
            <p className="text-sm font-light text-Gray-600">Atur agenda disini</p>
            <form action="" className="mt-3">
              <label htmlFor="title" className="text-sm text-Gray-600">
                Judul
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                onChange={handleInputChange}
              />
              <label htmlFor="description" className="text-sm text-Gray-600">
                Deskripsi
              </label>
              <textarea
                name="description"
                id="description"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                onChange={handleInputChange}
              />
              <label htmlFor="location" className="text-sm text-Gray-600">
                Lokasi
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                onChange={handleInputChange}
              />
              <label htmlFor="type_of_agenda" className="text-sm text-Gray-600">
                Tipe Agenda
              </label>
              <input
                type="text"
                name="type_of_agenda"
                id="type_of_agenda"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                onChange={handleInputChange}
              />
              <label htmlFor="date" className="text-sm text-Gray-600">
                Atur Tanggal
              </label>
              <input
                type="date"
                id="date"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                onChange={handleInputChange}
              />
              <div className="flex justify-between gap-3 mt-2">
                <div className="flex flex-col w-full">
                  <label htmlFor="start_time" className="text-sm text-Gray-600">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    className="p-2 mt-2 border-2 rounded-md border-Gray-300"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="end_time" className="text-sm text-Gray-600">
                    Jam Berakhir
                  </label>
                  <input type="time" id="end_time" className="p-2 mt-2 border-2 rounded-md border-Gray-300" onChange={handleInputChange} />
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-3">
            <SecondaryButton onClick={onFirstModalClose} btnClassName="font-semibold">
              Batal
            </SecondaryButton>
            <PrimaryButton onClick={handleCreateAgenda} btnClassName="font-semibold">
              Konfirmasi
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSecondModalOpen} onClose={onSecondModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
              <PiFlagBannerBold className="rotate-0" />
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1 className="text-lg font-semibold">Detail Agenda</h1>
            <p className="text-sm font-light text-Gray-600">Lihat detail agenda disini</p>
            <form action="" className="mt-3">
              <label htmlFor="title" className="text-sm text-Gray-600">
                Judul
              </label>
              <input
                type="text"
                id="title"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                value={selectedAgenda ? selectedAgenda.title : ''}
                readOnly
              />
              <label htmlFor="description" className="text-sm text-Gray-600">
                Deskripsi
              </label>
              <textarea
                id="description"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                value={selectedAgenda ? selectedAgenda.description : ''}
                readOnly
              />
              <label htmlFor="location" className="text-sm text-Gray-600">
                Lokasi
              </label>
              <input
                type="text"
                id="location"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                value={selectedAgenda ? selectedAgenda.location : ''}
                readOnly
              />
              <label htmlFor="type_of_agenda" className="text-sm text-Gray-600">
                Tipe Agenda
              </label>
              <input
                type="text"
                id="type_of_agenda"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                value={selectedAgenda ? selectedAgenda.type_of_agenda : ''}
                readOnly
              />
              <label htmlFor="date" className="text-sm text-Gray-600">
                Tanggal
              </label>
              <input
                type="date"
                id="date"
                className="w-full p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                value={selectedAgenda ? selectedAgenda.date : ''}
                readOnly
              />
              <div className="flex justify-between gap-3 mt-2">
                <div className="flex flex-col w-full">
                  <label htmlFor="start_time" className="text-sm text-Gray-600">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    className="p-2 mt-2 border-2 rounded-md border-Gray-300"
                    value={selectedAgenda ? selectedAgenda.start_time : ''}
                    readOnly
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="end_time" className="text-sm text-Gray-600">
                    Jam Berakhir
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    className="p-2 mt-2 border-2 rounded-md border-Gray-300"
                    value={selectedAgenda ? selectedAgenda.end_time : ''}
                    readOnly
                  />
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-3">
            <SecondaryButton onClick={onSecondModalClose} btnClassName="font-semibold">
              Batal
            </SecondaryButton>
            <PrimaryButton onClick={() => handleDelete(selectedAgenda ? selectedAgenda.id : '')} btnClassName="font-semibold">
              Delete
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

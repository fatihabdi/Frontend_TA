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
  useToast
} from '@chakra-ui/react';
import { PiFlagBannerBold } from 'react-icons/pi';
import PrimaryButton from '@/components/PrimaryButton';
import clsxm from '@/lib/clsxm';
import axios from 'axios';

type AgendaCalendarProps = {
  className?: string;
};

export default function AgendaCalendar({ className, ...rest }: AgendaCalendarProps) {
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure();
  const toast = useToast();
  const [agendas, setAgendas] = React.useState([]);
  const [selectedAgenda, setSelectedAgenda] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/global/agendas`, {
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
        headerToolbar={{
          left: 'prev,next today',
          center: '',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
      />
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
            <PrimaryButton onClick={onSecondModalClose} btnClassName="font-semibold">
              Close
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

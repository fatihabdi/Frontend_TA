import * as React from 'react';
import { Button, Stack, Input, Textarea } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import PrimaryButton from '../PrimaryButton';

type KontenMateriProps = {
  kontenMateri?: { title: string; description: string; link: string }[];
  setKontenMateri?: (content: { title: string; description: string; link: string }[]) => void;
};

type Session = {
  id?: number;
  title?: string;
  description?: string;
  link?: string;
};

export default function KontenMateri({ kontenMateri, setKontenMateri }: KontenMateriProps) {
  const [sessions, setSessions] = React.useState<Session[]>(kontenMateri.map((item, index) => ({ id: index + 1, ...item })));
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(sessions[0]);

  React.useEffect(() => {
    setKontenMateri(sessions.map(({ id, ...rest }) => rest));
  }, [sessions, setKontenMateri]);

  const handleAddSession = () => {
    const newSession = {
      id: sessions.length + 1,
      title: `Sesi ${sessions.length + 1}`,
      description: '',
      link: ''
    };
    setSessions([...sessions, newSession]);
    setSelectedSession(newSession);
  };

  const handleRemoveSession = (id: number) => {
    setSessions(sessions.filter((session) => session.id !== id));
    if (selectedSession?.id === id) {
      setSelectedSession(null);
    }
  };

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
  };

  const handleSessionChange = (key: string, value: string) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => (session.id === selectedSession?.id ? { ...session, [key]: value } : session))
    );
    setSelectedSession((prevSelectedSession) => (prevSelectedSession ? { ...prevSelectedSession, [key]: value } : null));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex items-center gap-5 p-5 rounded-md h-fit bg-Base-white lg:hidden">
        <div className="border-r">
          <h1 className="m-3 text-sm font-semibold text-Gray-500">Sesi</h1>
        </div>
        <Stack spacing={3} direction="row">
          {sessions.map((session) => (
            <Button
              key={session.id}
              className="font-semibold"
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleSelectSession(session)}
            >
              {session.title}
              <FiTrash2 className="ml-2" onClick={() => handleRemoveSession(session.id)} />
            </Button>
          ))}
        </Stack>
        <PrimaryButton btnClassName="w-fit h-fit" onClick={handleAddSession}>
          Tambah Sesi
        </PrimaryButton>
      </div>
      <div className="items-center hidden h-full gap-5 p-5 rounded-md w-fit lg:flex lg:flex-col bg-Base-white">
        <div className="border-b flex justify-center w-full">
          <h1 className="m-3 text-sm font-semibold text-Gray-500">Sesi</h1>
        </div>
        <Stack spacing={3} direction="column">
          {sessions.map((session) => (
            <Button
              key={session.id}
              className="font-semibold"
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleSelectSession(session)}
            >
              {session.title.length > 10 ? `${session.title.substring(0, 10)}...` : session.title}
              <FiTrash2 className="ml-2" onClick={() => handleRemoveSession(session.id)} />
            </Button>
          ))}
        </Stack>
        <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={handleAddSession}>
          Tambah Sesi
        </PrimaryButton>
      </div>
      {selectedSession && (
        <div className="flex flex-col w-full gap-4 p-5 rounded-md lg:p-5 lg:rounded-l-none bg-Base-white lg:flex-1">
          <div className="flex flex-col gap-3">
            <h1 className="text-sm font-semibold text-Gray-600">Nama Sesi</h1>
            <Input value={selectedSession.title} onChange={(e) => handleSessionChange('title', e.target.value)} />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-sm font-semibold text-Gray-600">Deskripsi Konten</h1>
            <Textarea
              value={selectedSession.description || ''}
              placeholder="Deskripsi konten"
              onChange={(e) => handleSessionChange('description', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-sm font-semibold text-Gray-600">Link</h1>
            <Input
              value={selectedSession.link || ''}
              placeholder="https://www.example.com"
              onChange={(e) => handleSessionChange('link', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

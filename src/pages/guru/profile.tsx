import * as React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Avatar,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast
} from '@chakra-ui/react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';
import axios from 'axios';
import { PiFlagBannerBold } from 'react-icons/pi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function DetailDataDiri() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [teacherData, setTeacherData] = React.useState({
    username: '',
    name: '',
    email: ''
  });

  const toggle = () => {
    setOpen(!open);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const toast = useToast();

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { username, name, email } = response.data.data;
        setTeacherData({ username, name, email });
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile/change-password`,
        {
          old_password: currentPassword,
          new_password: newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast({
        title: 'Success',
        description: 'Password changed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to change password',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      console.error('Error changing password:', error);
    }
  };

  return (
    <AuthenticatedLayout>
      <Seo templateTitle="Detail Data Diri" />
      <Box bg="Base-white" p={5} rounded="md" shadow="lg">
        <Flex justify="space-between" borderBottom="1px" borderColor="Gray-200" p={3}>
          <Text fontSize="md" fontWeight="semibold">
            Profil Guru
          </Text>
        </Flex>
        <Flex align="center" gap={5} p={7}>
          <Avatar
            size="2xl"
            name={teacherData.name}
            src={`https://ui-avatars.com/api/?name=${teacherData.name}`}
            showBorder={true}
            shadow="lg"
          />
          <Box>
            <Text fontSize="3xl" fontWeight="semibold">
              {teacherData.name}
            </Text>
          </Box>
        </Flex>
        <Box p={3}>
          <FormControl mt={4}>
            <FormLabel>Username</FormLabel>
            <Input value={teacherData.username} isReadOnly />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Name</FormLabel>
            <Input value={teacherData.name} isReadOnly />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input value={teacherData.email} isReadOnly />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <div className="flex gap-4 items-center">
              <Input value="••••••••" isReadOnly />
              <PrimaryButton size="mini" btnClassName="w-fit" onClick={onOpen}>
                Ubah Password
              </PrimaryButton>
            </div>
          </FormControl>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="p-2 rounded-md w-[36px] shadow-md border border-Gray-200 bg-Base-white">
              <PiFlagBannerBold className="rotate-0" />
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1 className="text-lg font-semibold">Ubah Password</h1>
            <p className="text-sm font-light text-Gray-600">Isi kolom untuk mengubah password</p>
            <FormControl mt={4}>
              <label className="text-sm font-medium text-Gray-600 mb-2">Masukkan Password lama</label>
              <div className="relative">
                <input
                  type={open ? 'text' : 'password'}
                  placeholder="Password Lama"
                  className="w-full p-2 pr-[35px] mt-2 mb-2 border-2 rounded-md border-Gray-300"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div className="absolute right-4 bottom-5">
                  {open === false ? <BsEye onClick={toggle} /> : <BsEyeSlash onClick={toggle} />}
                </div>
              </div>
            </FormControl>
            <FormControl mt={4}>
              <label className="text-sm font-medium text-Gray-600 mb-2">Masukkan Password baru</label>
              <div className="relative">
                <input
                  type={open ? 'text' : 'password'}
                  placeholder="Password Baru"
                  className="w-full pr-[35px] p-2 mt-2 mb-2 border-2 rounded-md border-Gray-300"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="absolute right-4 bottom-5">
                  {open === false ? <BsEye onClick={toggle} /> : <BsEyeSlash onClick={toggle} />}
                </div>
              </div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Batal
            </Button>
            <PrimaryButton size="mini" btnClassName="w-fit h-fit" onClick={handleChangePassword}>
              Konfirmasi
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AuthenticatedLayout>
  );
}

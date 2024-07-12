import * as React from 'react';
import { useRouter } from 'next/router';
import { Box, Avatar, Flex, FormControl, FormLabel, Input, Select, Text, HStack } from '@chakra-ui/react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import PrimaryButton from '@/components/PrimaryButton';

export default function DetailDataDiri() {
  const router = useRouter();
  const { student } = router.query;
  let studentData = {
    name: '',
    nisn: '',
    gender: '',
    birthplace: '',
    birthdate: '',
    address: '',
    province: '',
    city: '',
    blood_type: '',
    religion: '',
    phone: '',
    parent_phone: '',
    email: '',
    institutional_email: ''
  };

  try {
    studentData = JSON.parse(student as string) || studentData;
  } catch (error) {
    console.error('Failed to parse student data:', error);
  }

  return (
    <AuthenticatedLayout>
      <Seo templateTitle="Detail Data Diri" />
      <Box bg="Base-white" p={5} rounded="md" shadow="lg">
        <Flex justify="space-between" borderBottom="1px" borderColor="Gray-200" p={3}>
          <Text fontSize="md" fontWeight="semibold">
            Detail Data Diri Siswa
          </Text>
        </Flex>
        <Flex align="center" gap={5} p={7}>
          <Avatar
            size="2xl"
            name={studentData.name}
            src={`https://ui-avatars.com/api/?name=${studentData.name}`}
            showBorder={true}
            shadow="lg"
          />
          <Box>
            <Text fontSize="3xl" fontWeight="semibold">
              {studentData.name}
            </Text>
            <Text color="Gray-600">NISN : {studentData.nisn}</Text>
            <Text color="Gray-600">Jenis Kelamin : {studentData.gender}</Text>
          </Box>
        </Flex>
        <Box p={3}>
          <Box borderBottom="1px" borderColor="Gray-200" pb={3}>
            <Text fontSize="md" fontWeight="semibold">
              Data Pribadi
            </Text>
          </Box>
          <FormControl mt={4}>
            <FormLabel>Tempat Lahir</FormLabel>
            <Input placeholder="Magetan" defaultValue={studentData.birthplace} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Tanggal Lahir</FormLabel>
            <Input placeholder="06 Juni 2008" defaultValue={studentData.birthdate} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Alamat</FormLabel>
            <Input placeholder="Jln H.A Salim No 255 Desa Pelem" defaultValue={studentData.address} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Provinsi Asal</FormLabel>
            <Input placeholder="Provinsi Asal" defaultValue={studentData.province} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Kabupaten Asal</FormLabel>
            <Input placeholder="Kabupaten Asal" defaultValue={studentData.city} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Golongan Darah</FormLabel>
            <Select placeholder="Pilih Golongan Darah" defaultValue={studentData.blood_type}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Agama</FormLabel>
            <Select placeholder="Pilih Agama" defaultValue={studentData.religion}>
              <option value="Islam">Islam</option>
              <option value="Katolik">Katolik</option>
              <option value="Protestan">Protestan</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </Select>
          </FormControl>
          <Box borderBottom="1px" borderColor="Gray-200" pt={5} pb={3}>
            <Text fontSize="md" fontWeight="semibold">
              Data Akun Sosial
            </Text>
          </Box>
          <FormControl mt={4}>
            <HStack spacing={4}>
              <Box flex="1">
                <FormLabel>No Handphone</FormLabel>
                <Input placeholder="089503889774" defaultValue={studentData.phone} />
              </Box>
              <PrimaryButton size="mini" onClick={() => router.replace(`https://wa.me/${studentData.phone}`)} btnClassName="w-fit h-fit">
                Hubungi WA
              </PrimaryButton>
            </HStack>
          </FormControl>
          <FormControl mt={4}>
            <HStack spacing={4}>
              <Box flex="1">
                <FormLabel>No. Handphone Orang Tua</FormLabel>
                <Input placeholder="089503889774" defaultValue={studentData.parent_phone} />
              </Box>
              <PrimaryButton
                size="mini"
                onClick={() => router.replace(`https://wa.me/${studentData.parent_phone}`)}
                btnClassName="w-fit h-fit"
              >
                Hubungi WA
              </PrimaryButton>
            </HStack>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input placeholder="dominica@gmail.com" defaultValue={studentData.email} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email Institusi</FormLabel>
            <Input placeholder="dominica@student.snesma.ac.id" defaultValue={studentData.institutional_email} />
          </FormControl>
        </Box>
      </Box>
    </AuthenticatedLayout>
  );
}

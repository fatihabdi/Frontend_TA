import * as React from 'react';
import axios from 'axios';
import { Box, Avatar, Flex, FormControl, FormLabel, Input, Select, Text, HStack, Button } from '@chakra-ui/react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import { FiEdit } from 'react-icons/fi';
import Seo from '@/components/Seo';
import { useRouter } from 'next/router';

interface StudentData {
  name: string;
  nisn: string;
  gender: string;
  birthplace: string;
  birthdate: string;
  address: string;
  province: string;
  city: string;
  blood_type: string;
  religion: string;
  phone: string;
  parent_phone: string;
  email: string;
}

export default function DetailDataDiri() {
  const router = useRouter();
  const [data, setData] = React.useState<StudentData[]>([]);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/student/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setData(response.data.data);
      });
  }, []);

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
            name={data.name}
            src={`https://ui-avatars.com/api/?name=${data.name}&size=35&background=random&color=fff`}
            showBorder={true}
            shadow="lg"
          />
          <Box>
            <Text fontSize="3xl" fontWeight="semibold">
              {data.name}
            </Text>
            <Text color="Gray-600">NISN : {data.nisn}</Text>
            <Text color="Gray-600">Jenis Kelamin : {data.gender}</Text>
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
            <Input value={data.birthplace} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Tanggal Lahir</FormLabel>
            <Input value={data.birthdate} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Alamat</FormLabel>
            <Input value={data.address} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Provinsi Asal</FormLabel>
            <Select placeholder={data.province} value={data.province}></Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Kabupaten Asal</FormLabel>
            <Select placeholder={data.city} value={data.city}></Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Golongan Darah</FormLabel>
            <Select placeholder={data.blood_type}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Agama</FormLabel>
            <Select placeholder={data.religion}>
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
            <HStack spacing={4} className="items-center">
              <Box flex="1">
                <FormLabel>No Handphone</FormLabel>
                <Input value={data.phone} />
              </Box>
            </HStack>
          </FormControl>
          <FormControl mt={4}>
            <HStack spacing={4}>
              <Box flex="1">
                <FormLabel>No. Handphone Orang Tua</FormLabel>
                <Input value={data.parent_phone} />
              </Box>
            </HStack>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input value={data.email} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email Institusi</FormLabel>
            <Input value={data.email} />
          </FormControl>
        </Box>
      </Box>
    </AuthenticatedLayout>
  );
}

import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutWali/AuthenticatedLayout';
import { useRouter } from 'next/router';
import Seo from '@/components/Seo';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Select } from '@chakra-ui/react';

export default function ListKehadiran() {
  const router = useRouter();
  const [attendance, setAttendance] = React.useState([]);
  const [groupedAttendance, setGroupedAttendance] = React.useState([]);
  const [username, setUsername] = React.useState('');
  const [studentName, setStudentName] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username') || '');
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/parent/attendance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          const data = response.data.data || [];
          console.log('Fetched Attendance Data:', data); // Add logging
          setAttendance(data);
          if (data.length > 0) {
            setStudentName(data[0].student_name); // Set the student name to the first entry
          }
          const groupedData = groupAttendanceBySubject(data);
          console.log('Grouped Attendance Data:', groupedData); // Add logging
          setGroupedAttendance(groupedData);
        });
    }
  }, []);

  const groupAttendanceBySubject = (data) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.subject_name]) {
        acc[item.subject_name] = {
          subject_name: item.subject_name,
          total_attendance: 0,
          total_meetings: 0
        };
      }
      acc[item.subject_name].total_meetings += 1;
      if (item.attedance_status === 'Hadir') {
        acc[item.subject_name].total_attendance += 1;
      }
      return acc;
    }, {});

    return Object.values(grouped).map((item) => ({
      ...item,
      attendance_percentage: ((item.total_attendance / item.total_meetings) * 100).toFixed(2) + '%'
    }));
  };

  return (
    <div className="overflow-x-auto">
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex items-center justify-between p-4">
            <h1 className="flex items-center gap-2 text-lg font-semibold">Presentase Kehadiran Siswa - {studentName}</h1>
            <div className="flex items-center gap-2">
              <Select placeholder="Kelas" size="md">
                <option value="1">X</option>
                <option value="2">XI</option>
                <option value="3">XII</option>
              </Select>
            </div>
          </div>
          <div className="">
            <TableContainer className="">
              <Table variant="simple" className="">
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>Mata Pelajaran</Th>
                    <Th>Presentase Kehadiran</Th>
                    <Th>Jumlah Kehadiran</Th>
                    <Th>Jumlah Pertemuan</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {groupedAttendance.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} className="text-center">
                        No data available
                      </Td>
                    </Tr>
                  ) : (
                    groupedAttendance.map((item, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{item.subject_name}</Td>
                        <Td>{item.attendance_percentage}</Td>
                        <Td>{item.total_attendance}</Td>
                        <Td>{item.total_meetings}</Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

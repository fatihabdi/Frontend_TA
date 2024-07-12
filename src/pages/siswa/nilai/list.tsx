import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import PrimaryButton from '@/components/PrimaryButton';
import { HiOutlinePrinter } from 'react-icons/hi';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/router';

interface Grade {
  id: string;
  subject: string;
  formative_scores: number;
  summative_scores: number;
  project_scores: number;
}

interface StudentProfile {
  name: string;
  nisn: string;
}

const NilaiList: React.FC = () => {
  const router = useRouter();
  const [grades, setGrades] = React.useState<Grade[]>([]);
  const [semester, setSemester] = React.useState<string>('');
  const [academicYear, setAcademicYear] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [profile, setProfile] = React.useState<StudentProfile>({ name: '', nisn: '' });

  React.useEffect(() => {
    fetchProfile();
    if (semester && academicYear) {
      fetchGrades();
    }
  }, [semester, academicYear]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(response.data.data || { name: '', nisn: '' });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchGrades = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/grades`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          semester,
          academicYear
        }
      });
      setGrades(response.data.data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    const input = document.getElementById('grades-template');
    if (!input) {
      console.error('No element found with ID grades-template');
      return;
    }

    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${profile.name}_${profile.nisn}_grades_${semester === '1' ? 'ganjil' : 'genap'}_${academicYear}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  };

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Nilai" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex justify-between p-3 border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Grades</h1>
            <div className="flex items-center gap-3">
              <Select placeholder="Semester" size="md" onChange={(e) => setSemester(e.target.value)}>
                <option value="1">Ganjil</option>
                <option value="2">Genap</option>
              </Select>
              <Select placeholder="Tahun Akademik" size="md" onChange={(e) => setAcademicYear(e.target.value)}>
                <option value="2023-2024">2023/2024</option>
                <option value="2024-2025">2024/2025</option>
                <option value="2025-2026">2025/2026</option>
              </Select>
              <PrimaryButton
                btnClassName="w-fit h-fit"
                size="mini"
                onClick={handlePrint}
                leftIcon={<HiOutlinePrinter className="text-xl" />}
              >
                Cetak Nilai Lengkap
              </PrimaryButton>
            </div>
          </div>
          <div className="m-5 border rounded-lg shadow-sm">
            <Table id="grades-table" className="">
              <Thead className="bg-Gray-50">
                <Tr>
                  <Th>No</Th>
                  <Th>Mata Pelajaran</Th>
                  <Th>Rata-Rata Formatif</Th>
                  <Th>Rata-Rata Sumatif</Th>
                  <Th>Rata-Rata Proyek</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan={6} className="text-center">
                      Loading...
                    </Td>
                  </Tr>
                ) : (
                  grades.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>{index + 1}</Td>
                      <Td>{item.subject}</Td>
                      <Td>{item.formative_scores}</Td>
                      <Td>{item.summative_scores}</Td>
                      <Td>{item.project_scores}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </div>
        </div>
        <div id="grades-template" style={{ display: 'block', position: 'absolute', zIndex: -1 }}>
          <div className="w-[595px] h-[842px] relative bg-white">
            <div className="left-[30px] top-[30px] absolute justify-center items-center gap-[9px] inline-flex">
              <img className="w-[69.48px] h-[81px]" src="/image 4.png" />
              <div className="w-[367px] flex-col justify-start items-center gap-2 inline-flex">
                <div className="self-stretch text-center text-black text-base font-semibold font-['Inter'] leading-tight">
                  DINAS PENDIDIKAN KABUPATEN MAGETAN
                </div>
                <div className="self-stretch text-center text-black text-base font-semibold font-['Inter'] leading-tight">
                  SMP NEGERI 1 MAGETAN
                </div>
                <div className="self-stretch text-center text-black text-[10px] font-semibold font-['Inter'] leading-tight">
                  Jl. Kartini No.4, Dusun Magetan, Kec. Magetan, Magetan, Jawa Timur 63361
                </div>
              </div>
              <img className="w-20 h-20" src="/logo-smp.png" />
            </div>
            <div className="h-2 left-[30px] top-[127px] absolute flex-col justify-start items-start gap-2 inline-flex">
              <div className=" w-[535px] h-[5px] border border-Base-black"></div>
              <div className=" w-[535px] h-[5px] border border-Base-black"></div>
            </div>
            <div className="h-12 left-[130px] top-[151px] absolute flex-col justify-start items-start gap-2 inline-flex">
              <div className="self-stretch text-center text-black text-sm font-bold font-['Inter'] leading-tight">
                LAPORAN HASIL BELAJAR PESERTA DIDIK
              </div>
              <div className="self-stretch text-center text-black text-sm font-bold font-['Inter'] leading-tight">
                SEMESTER {semester === '1' ? 'GANJIL' : 'GENAP'} TAHUN PELAJARAN {academicYear}
              </div>
            </div>
            <div className="h-[60px] left-[29px] top-[223px] absolute flex-col justify-start items-start inline-flex">
              <div className="self-stretch justify-start items-center inline-flex">
                <div className="w-[150px] text-black text-[13px] font-medium font-['Inter'] leading-tight">Nama Peserta Didik</div>
                <div className="w-2.5 text-center text-black text-[13px] font-medium font-['Inter'] leading-tight">:</div>
                <div className="w-[150px] text-black text-[13px] font-medium font-['Inter'] leading-tight">{profile.name}</div>
              </div>
              <div className="self-stretch justify-start items-center inline-flex">
                <div className="w-[150px] text-black text-[13px] font-medium font-['Inter'] leading-tight">Nomor Induk Siswa</div>
                <div className="w-2.5 text-center text-black text-[13px] font-medium font-['Inter'] leading-tight">:</div>
                <div className="w-[150px] text-black text-[13px] font-medium font-['Inter'] leading-tight">{profile.nisn}</div>
              </div>
            </div>
            <div className="w-fit h-fit left-[19px] top-[307px] absolute bg-white justify-start items-start inline-flex">
              <Table id="grades-table" className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>No</Th>
                    <Th>Mata Pelajaran</Th>
                    <Th>Rata-Rata Formatif</Th>
                    <Th>Rata-Rata Sumatif</Th>
                    <Th>Rata-Rata Proyek</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={6} className="text-center">
                        Loading...
                      </Td>
                    </Tr>
                  ) : (
                    grades.map((item, index) => (
                      <Tr key={item.id}>
                        <Td>{index + 1}</Td>
                        <Td>{item.subject}</Td>
                        <Td>{item.formative_scores}</Td>
                        <Td>{item.summative_scores}</Td>
                        <Td>{item.project_scores}</Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
};

export default NilaiList;

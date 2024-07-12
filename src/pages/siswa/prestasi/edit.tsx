import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutSiswa/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Select, Tag, TagLabel } from '@chakra-ui/react';
import PrimaryButton from '@/components/PrimaryButton';

export default function EditPrestasi() {
  const [item, setItem] = React.useState([]);

  // React.useEffect(() => {
  //   axios
  //     .get('https://ems-30c1804a223a.herokuapp.com/api/student/achivement/1', {
  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Pengaduan" />
        <div className="w-full p-3 rounded-md shadow-lg h-fit bg-Base-white">
          <div className="flex flex-col justify-between gap-5 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Input Prestasi</h1>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div className="flex flex-col gap-3">
              <label htmlFor="pengaduan" className="text-sm font-medium text-Gray-700">
                Nama dan Judul Kegiatan
              </label>
              <input
                name="pengaduan"
                id="pengaduan"
                className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                placeholder="Tuliskan pengaduan kamu disini"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-sm font-medium text-Gray-700">Jenis Prestasi</h1>
              <Select placeholder="Pilih Golongan Darah">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-sm font-medium text-Gray-700">Jenis Partisipasi</h1>
              <Select placeholder="Pilih Golongan Darah">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-sm font-medium text-Gray-700">Jenis Tingkat</h1>
              <Select placeholder="Pilih Golongan Darah">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="link" className="text-sm text-Gray-700">
                Upload Bukti
              </label>
              <div className="relative flex items-center border rounded-md border-Gray-200">
                <span className="px-3 border-r text-Gray-600">https://</span>
                <input
                  type="text"
                  id="link"
                  className="w-full p-2 border-0 rounded-r-md focus:outline-none"
                  placeholder="www.example.com"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="status">Status</label>
              {item.status === 'Wait Approval' ? (
                <Tag colorScheme="blue" borderRadius="full" size="sm" className="w-fit">
                  <TagLabel>Wait Approval</TagLabel>
                </Tag>
              ) : item.status === 'Success' ? (
                <Tag colorScheme="green" borderRadius="full" size="sm" className="w-fit">
                  <TagLabel>Success</TagLabel>
                </Tag>
              ) : (
                <Tag colorScheme="red" borderRadius="full" size="sm" className="w-fit">
                  <TagLabel>Declined</TagLabel>
                </Tag>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="alasan" className="text-sm font-medium text-Gray-700">
                Alasan Ditolak
              </label>
              <textarea
                name="alasan"
                id="alasan"
                className="w-full p-2 border rounded-lg border-Gray-200 h-fit"
                placeholder="Tuliskan hasil kamu disini"
              />
            </div>
            <div className="flex justify-end gap-3">
              <PrimaryButton btnClassName="w-fit h-fit rounded-md">Ajukan Ulang</PrimaryButton>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

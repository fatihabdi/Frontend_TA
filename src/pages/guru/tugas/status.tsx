import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import { Input, Select, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import SecondaryButton from '@/components/SecondaryButton';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function StatusPengumpulan() {
  const router = useRouter();
  const [tasks, setTasks] = React.useState([]);
  const [filteredTasks, setFilteredTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [subjects, setSubjects] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [filters, setFilters] = React.useState({
    subject: '',
    class: '',
    taskType: '',
    sortOrder: '',
    createdAt: ''
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [taskResponse, classResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/task/all`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/class`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const tasksData = taskResponse.data.data || [];
        const classesData = classResponse.data.data || [];

        // Filter out duplicate class names and subject names
        const uniqueClasses = [];
        const classNames = new Set();
        const allSubjects = [];

        classesData.forEach((cls) => {
          if (!classNames.has(cls.class_name)) {
            classNames.add(cls.class_name);
            uniqueClasses.push(cls);
          }
          if (!allSubjects.find((sub) => sub.id === cls.subject_id)) {
            allSubjects.push({ id: cls.subject_id, name: cls.subject_name });
          }
        });

        setClasses(uniqueClasses);
        setSubjects(allSubjects);

        const studentsData = await Promise.all(
          uniqueClasses.map(async (cls) => {
            return await Promise.all(
              allSubjects.map(async (subject) => {
                const studentResponse = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/${cls.class_id}/${subject.id}/student`,
                  {
                    headers: { Authorization: `Bearer ${token}` }
                  }
                );
                const totalSiswa = (studentResponse.data.data || []).length;
                return { classId: cls.class_id, subjectId: subject.id, totalSiswa };
              })
            );
          })
        );

        const studentsMap = studentsData.flat().reduce((acc, curr) => {
          acc[`${curr.classId}-${curr.subjectId}`] = curr.totalSiswa;
          return acc;
        }, {});

        const submissionsData = await Promise.all(
          tasksData.map(async (task) => {
            const submissionResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/task/${task.id}/assignment`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const totalSubmit = (submissionResponse.data.data || []).length;
            return { taskId: task.id, totalSubmit };
          })
        );

        const submissionsMap = submissionsData.reduce((acc, curr) => {
          acc[curr.taskId] = curr.totalSubmit;
          return acc;
        }, {});

        const tasksWithSubmissionsAndStudents = tasksData.map((task) => {
          const classData = uniqueClasses.find((cls) => cls.class_name === task.class);
          const subjectData = allSubjects.find((sub) => sub.name === task.subject);

          let totalSiswa = 0;
          if (classData && subjectData) {
            totalSiswa = studentsMap[`${classData.class_id}-${subjectData.id}`] || 0;
          }

          return {
            ...task,
            totalSubmit: submissionsMap[task.id] || 0,
            totalSiswa
          };
        });

        setTasks(tasksWithSubmissionsAndStudents);
        setFilteredTasks(tasksWithSubmissionsAndStudents);
      } catch (error) {
        console.error('Error fetching data:', error);
        setTasks([]);
        setFilteredTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = tasks;

    if (filters.subject) {
      filtered = filtered.filter((task) => task.subject === filters.subject);
    }
    if (filters.class) {
      filtered = filtered.filter((task) => task.class === filters.class);
    }
    if (filters.taskType) {
      filtered = filtered.filter((task) =>
        filters.taskType === 'ulangan harian' ? task.type_of_task === 'Ulangan Harian' : task.type_of_task !== 'Ulangan Harian'
      );
    }
    if (filters.sortOrder) {
      filtered = filtered.sort((a, b) =>
        filters.sortOrder === 'ascending'
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at)
      );
    }
    if (filters.createdAt) {
      filtered = filtered.filter((task) => task.created_at.startsWith(filters.createdAt));
    }

    setFilteredTasks(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters, tasks]);

  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full p-3 border rounded-md shadow-lg h-fit border-Gray-200 bg-Base-white">
          <div className="flex flex-col justify-between gap-4 p-3 lg:flex-row lg:border-b border-Gray-200">
            <h1 className="text-lg font-semibold">Status Pengumpulan</h1>
            <div className="flex flex-col gap-3 lg:flex-row">
              <Select name="subject" placeholder="Mata Pelajaran" size="md" onChange={handleFilterChange}>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </Select>
              <Select name="class" placeholder="Kelas" size="md" onChange={handleFilterChange}>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_name}>
                    {cls.class_name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex flex-col justify-around gap-4 px-3 py-6 lg:flex-row">
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="jenis" className="text-sm font-medium text-Gray-700">
                Jenis Tugas
              </label>
              <Select name="taskType" placeholder="All" size="md" onChange={handleFilterChange}>
                <option value="ulangan harian">Ulangan Harian</option>
                <option value="tugas harian">Tugas Harian</option>
              </Select>
            </span>
            <span className="flex flex-col w-full gap-4">
              <label htmlFor="sort" className="text-sm font-medium text-Gray-700">
                Urutkan Berdasarkan
              </label>
              <Select name="sortOrder" placeholder="All" size="md" onChange={handleFilterChange}>
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </Select>
            </span>
            <span className="w-full">
              <label htmlFor="date" className="text-sm font-medium text-Gray-700">
                Tanggal Dibuat
              </label>
              <Input name="createdAt" size="md" type="date" className="mt-3" onChange={handleFilterChange} />
            </span>
          </div>
          <div className="m-3 border rounded-lg shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center">
                <Spinner size="xl" />
              </div>
            ) : (
              <Table className="">
                <Thead className="bg-Gray-50">
                  <Tr>
                    <Th>Nama Tugas</Th>
                    <Th>Total Siswa</Th>
                    <Th>Total Submit</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredTasks.length === 0 ? (
                    <Tr>
                      <Td colSpan="4" className="text-center">
                        Tidak ada tugas
                      </Td>
                    </Tr>
                  ) : (
                    filteredTasks.map((task, index) => (
                      <Tr key={index}>
                        <Td className="flex flex-col gap-2">
                          {task.title}
                          <p className="text-sm text-Gray-500">{task.description}</p>
                        </Td>
                        <Td>{task.totalSiswa}</Td>
                        <Td>{task.totalSubmit}</Td>
                        <Td>
                          <SecondaryButton
                            btnClassName="font-semibold py-2 px-2"
                            onClick={() => router.push(`/guru/tugas/status/${task.id}`)}
                          >
                            Detail
                          </SecondaryButton>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}

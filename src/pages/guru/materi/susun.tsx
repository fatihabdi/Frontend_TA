import * as React from 'react';
import { Tag, Select, Text, Spinner } from '@chakra-ui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
import Seo from '@/components/Seo';
import axios from 'axios';
import { useRouter } from 'next/router';

type Item = {
  id: string;
  content: string;
  created_at: string; // Assuming the API provides a created_at field
  sub?: string[];
};

const Susun = () => {
  const [items, setItems] = React.useState<Item[]>([]);
  const [subjects, setSubjects] = React.useState([]);
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [winReady, setWinReady] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setWinReady(true);
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubjectChange = async (e) => {
    const selectedSubject = e.target.value;
    setSelectedSubject(selectedSubject);
    if (selectedSubject) {
      fetchMatters(selectedSubject);
    }
  };

  const fetchMatters = async (subjectId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teacher/subject/${subjectId}/matter`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.data.map((matter) => ({
        id: matter.id,
        content: matter.title,
        created_at: matter.created_at, // Assuming the API provides a created_at field
        sub: matter.content
      }));
      setItems(data);
    } catch (error) {
      console.error('Error fetching matters:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleSortChange = (e) => {
    const sortOrder = e.target.value;
    const sortedItems = [...items].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
    });
    setItems(sortedItems);
  };

  const handleSubItemClick = (id, subItem) => {
    router.push({
      pathname: `/guru/materi/${id}`,
      query: { subitem: JSON.stringify(subItem) }
    });
  };

  return (
    <AuthenticatedLayout>
      <Seo templateTitle="Susunan Materi" />
      <div className="flex items-center justify-between w-full gap-4 p-5 rounded-md h-fit bg-Base-white">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <Select placeholder="Pilih Mata Pelajaran" size="md" onChange={handleSubjectChange}>
            {subjects.map((subjectGroup) =>
              subjectGroup.subject.map((subject) => (
                <option key={subject.subject_id} value={subject.id}>
                  {subject.name}
                </option>
              ))
            )}
          </Select>
        </div>
      </div>

      <div className="pb-5 mt-5 rounded-md bg-Base-white">
        <div className="flex justify-between p-5 mb-4">
          <Text fontSize="lg" fontWeight="bold">
            Susunan Materi
          </Text>
          <div>
            <Select placeholder="Sort" size="md" onChange={handleSortChange}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Spinner size="xl" />
          </div>
        ) : (
          winReady && (
            <div>
              {items.map(({ id, content, sub }) => (
                <div key={id} className="mb-4">
                  <div className="flex items-center justify-between p-3 cursor-pointer bg-Gray-100" onClick={() => toggleExpand(id)}>
                    <div className="flex items-center gap-5">
                      <Tag colorScheme="blue" borderRadius="full" border={1} size="sm">
                        {id.slice(0, 4)}
                      </Tag>
                      <h1 className="font-bold text-md">{content}</h1>
                    </div>
                    <div className="flex items-center gap-5">
                      <MdKeyboardArrowDown className={`text-xl ${expanded === id ? 'transform rotate-180' : ''}`} />
                    </div>
                  </div>
                  {expanded === id && (
                    <>
                      {sub?.map((subItem, subIndex) => (
                        <div key={subIndex} className="p-5 border-b border-Gray-200">
                          <button onClick={() => handleSubItemClick(id, subItem)}>
                            <h1 className="font-bold text-md">{subItem.title}</h1>
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default Susun;

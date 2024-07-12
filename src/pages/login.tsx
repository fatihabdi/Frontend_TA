import * as React from 'react';
import Checkbox from '@/components/Checkbox';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Section from '~/Section.png';
import Logo from '~/logo-smp.png';
import Image from 'next/image';
import axios from 'axios';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export default function Login() {
  const [data, setData] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const toast = useToast();

  const toggle = () => {
    setOpen(!open);
  };

  const handleClick = (event: FormEvent) => {
    event.preventDefault(); // Prevent form submission
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data)
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(true);
          toast({
            title: 'Login Success',
            description: 'You have successfully logged in',
            status: 'success',
            duration: 5000,
            isClosable: true
          });

          if (typeof window !== 'undefined') {
            const token = response.data.data.token;
            Cookies.set('token', token); // Set token in cookies
            localStorage.setItem('token', token); // Set token in localStorage
            localStorage.setItem('username', response.data.data.username);

            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;
            const isHomeroomTeacher = decodedToken.is_homeroom_teacher;

            if (isHomeroomTeacher) {
              localStorage.setItem('is_homeroom_teacher', 'true');
            } else {
              localStorage.setItem('is_homeroom_teacher', 'false');
            }

            if (userRole === 'admin') {
              router.push('/admin/home');
            } else if (userRole === 'teacher') {
              router.push('/guru/home');
            } else if (userRole === 'student') {
              router.push('/siswa/home');
            } else if (userRole === 'parent') {
              router.push('/wali/home');
            } else {
              router.push('/');
            }
          }
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        setError(true);
        toast({
          title: 'Error',
          description: 'An error occurred during login',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        console.error('Login error:', error);
      });
  };

  const setDataHandler = (field: string, value: unknown) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  return (
    <Layout>
      <Seo templateTitle="Login" />
      <main className="lg:flex">
        <div className="py-[48px] px-8 lg:w-full lg:py-[184px] lg:px-[184px]">
          <div className="items-center gap-2 lg:flex lg:mb-[80px]">
            <Image src={Logo} alt="Logo" width={40} />
            <h1 className="hidden text-3xl font-semibold text-Gray-900 lg:flex">SMPN 1 Magetan</h1>
          </div>
          <div className="pt-5">
            <h1 className="text-xl font-semibold lg:text-4xl text-Gray-900">Log in</h1>
            <h1 className="mt-2 font-light text-Gray-600">Welcome back! Please enter your details.</h1>
          </div>
          <div className="mt-5">
            <form>
              <div className="flex flex-col gap-1">
                <label htmlFor="email">Username</label>
                <TextInput
                  placeholder="Enter your Username"
                  value={data?.username}
                  onChange={(event) => {
                    setDataHandler('username', event.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1 mt-4">
                <label htmlFor="password">Password</label>
                <div className="relative">
                  <TextInput
                    placeholder="••••••••"
                    inputClassName={`w-full rounded-lg ${
                      error === false ? 'border-Gray-300' : 'border-Error-300'
                    } shadow border-2 py-[10px] px-[14px] placeholder:text-Gray-500`}
                    type={open ? 'text' : 'password'}
                    value={data?.password}
                    onChange={(event) => {
                      setDataHandler('password', event.target.value);
                    }}
                  />
                  <div className="absolute right-4 bottom-4">
                    {open === false ? <BsEye onClick={toggle} /> : <BsEyeSlash onClick={toggle} />}
                  </div>
                </div>
                {error === true ? <p className="text-sm text-Error-300 font-extralight">The password you entered is incorrect</p> : ''}
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                  <Checkbox name="remember_me" checked={false} onChange={() => {}} />
                  <label htmlFor="remember_me">Remember me</label>
                </div>
                <a href="#" className="font-semibold text-Primary-500">
                  Forgot password
                </a>
              </div>
              <div className="mt-4">
                <PrimaryButton onClick={handleClick} is_loading={isLoading}>
                  Sign in
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
        <div className="items-center justify-center flex-auto hidden lg:flex lg:w-full">
          <Image src={Section} className="object-cover w-screen h-screen" alt="Section" />
        </div>
      </main>
    </Layout>
  );
}

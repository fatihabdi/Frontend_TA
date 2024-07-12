import { AppProps } from 'next/app';
import '@/styles/globals.css';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'react-day-picker/dist/style.css';
import { ChakraProvider } from '@chakra-ui/react';

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <Component {...pageProps} />
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
};

export default App;

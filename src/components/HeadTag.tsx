import Head from 'next/head';
import React from 'react';

type HeadProps = {
  title?: string;
};

export default function Header({ title }: HeadProps) {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
    </div>
  );
}

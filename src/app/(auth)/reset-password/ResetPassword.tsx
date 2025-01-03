'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button, Form, Input } from 'antd';
import {
  ArrowLeftOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

import logo from '@/assets/images/logo.svg';
import support from '@/assets/images/support.png';
import Link from 'next/link';

export const ResetPassword: React.FC = () => {
  return (
    <div className="container flex min-h-screen py-10">
      <div className="sm:p-10 p-5 bg-white rounded-3xl shadow-2xl shadow-black/5 m-auto max-w-lg w-full space-y-5">
        <h1 className="text-center text-2xl font-medium">
          Restabilirea parolei
        </h1>

        <p className="text-gray-500 text-center">
          Din motive de securitate, restabilirea parolei este posibilă doar prin
          contactarea echipei noastre de suport.
        </p>

        <p className="text-dc-red text-center text-sm font-medium">
          Ne poți contacta prin email sau telefon:
        </p>

        <div className="flex md:flex-row flex-col gap-5">
          <Button
            size="large"
            type="dashed"
            href={'#'}
            icon={<MailOutlined />}
            className="w-full"
          >
            info@doctorchat.md
          </Button>

          <Button
            size="large"
            type="dashed"
            href={'#'}
            icon={<PhoneOutlined className="rotate-[110deg]" />}
            className="w-full"
          >
            +373 78 272 887
          </Button>
        </div>

        <div className="flex flex-col items-center gap-5">
          <Image
            src={support.src}
            height={support.height}
            width={support.width}
            alt="Centrul medical"
            className="h-auto w-72"
          />

          <Button type="primary" href="/" icon={<ArrowLeftOutlined />}>
            Pagina principală
          </Button>
        </div>
      </div>
    </div>
  );
};

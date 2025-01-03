'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button, Form, Input, notification, Spin } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { ILogin } from '@/types';

import logo from '@/assets/images/logo.svg';
import medicalCenter from '@/assets/images/medical-center.png';
import Link from 'next/link';

export const Login: React.FC = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ILogin) => {
    setLoading(true);
    try {
      const response = await signIn('credentials', {
        ...values,
        redirect: false,
      });

      if (response?.error) {
        notification.error({
          message: 'Eroare de autentificare!',
        });
      } else {
        push('/');
      }
    } catch {
      notification.error({ message: 'Eroare de autentificare!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />

      <div className="md:grid md:grid-cols-2 flex flex-col-reverse min-h-screen items-center justify-center">
        <div className="bg-dc-blue md:min-h-full min-h-[50vh] md:p-20 p-10 flex items-center justify-center w-full">
          <Image
            src={medicalCenter.src}
            height={medicalCenter.height}
            width={medicalCenter.width}
            alt="Centrul medical"
            className="w-full max-w-xl"
          />
        </div>

        <div className="px-5 p-10 w-full md:min-h-full min-h-[50vh] flex">
          <div className="sm:p-10 p-5 bg-white rounded-3xl shadow-2xl shadow-black/5 m-auto max-w-lg w-full max-h-max space-y-5">
            <Image
              src={logo.src}
              height={logo.height}
              width={logo.width}
              alt="Centrul medical"
              className="h-12 mx-auto"
            />

            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              className="flex-none space-y-5"
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Introduceți adresa de email',
                  },
                  {
                    type: 'email',
                    message: 'Adresa de email nu este validă',
                  },
                ]}
              >
                <Input
                  size="large"
                  type="email"
                  prefix={<MailOutlined />}
                  placeholder="Adresa de email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Introduceți parola de acces',
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Parola"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  size="large"
                  block
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Intră în cont
                </Button>
              </Form.Item>
            </Form>

            <Link
              href="/reset-password"
              className="flex justify-center text-sm text-dc-red"
            >
              Ați uitat parola? Solicitați ajutor.
            </Link>
          </div>
        </div>
      </div>

      {/*<div className="container">
        <div className="min-h-screen flex items-center justify-center py-10">
          <div className="md:grid md:grid-cols-2 flex flex-col-reverse gap-10 items-center">
            <Image
              src={medicalCenter.src}
              height={medicalCenter.height}
              width={medicalCenter.width}
              alt="Centrul medical"
              className="w-auto"
            />

            <div className="sm:p-10 p-5 bg-white rounded-3xl shadow-2xl shadow-black/5 mx-auto max-w-lg w-full max-h-max space-y-5">
              <Image
                src={logo.src}
                height={logo.height}
                width={logo.width}
                alt="Centrul medical"
                className="h-12 mx-auto"
              />

              <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                className="flex-none space-y-5"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Introduceți adresa de email',
                    },
                    {
                      type: 'email',
                      message: 'Adresa de email nu este validă',
                    },
                  ]}
                >
                  <Input
                    size="large"
                    type="email"
                    prefix={<MailOutlined />}
                    placeholder="Adresa de email"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Introduceți parola de acces',
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Parola"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    size="large"
                    block
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Intră în cont
                  </Button>
                </Form.Item>
              </Form>

              <Link
                href="/reset-password"
                className="flex justify-center text-sm text-dc-red"
              >
                Ați uitat parola? Solicitați ajutor.
              </Link>
            </div>
          </div>
        </div>
      </div>*/}
    </>
  );
};

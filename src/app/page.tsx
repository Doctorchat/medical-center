'use client';
import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { api } from '@/utils/api';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link href="/profile">Profil</Link>, 'profile', <UserOutlined />),
];

export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data: session } = useSession();

  console.log(session);

  const logout = async () => {
    await signOut();
  };

  // useEffect(() => {
  //   api.profile.get().then((res) => console.log(res));
  // }, []);

  return (
    <>
      <div className="container min-h-screen py-5">
        <Layout
          style={{
            padding: '24px 0',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="!min-h-screen"
        >
          <Sider width={220}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={items}
            />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Button color="danger" onClick={logout}>
              Logout
            </Button>
          </Content>
        </Layout>
      </div>
      {/*  */}
      {/*  */}
      {/*  */}
      {/* <Layout className="!min-h-screen">
        <Sider
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="flex justify-center p-5">
            {collapsed ? (
              <svg viewBox="0 0 74 64" fill="none" className="transition">
                <path
                  d="M73.4282 43.9809C73.4282 48.1497 71.8598 51.9562 69.287 54.8317L70.6674 60.7203C71.2131 63.0408 68.6541 64.8432 66.6545 63.5407L60.931 59.8214C59.7157 60.1103 58.45 60.2662 57.1429 60.2662H39.202C34.703 60.2662 30.6305 58.441 27.6863 55.4967C24.7374 52.5478 22.9167 48.4753 22.9167 43.9809H36.7209C39.3167 43.9809 41.4125 41.8851 41.4125 39.2893V34.8729H45.829C48.4247 34.8729 50.5206 32.777 50.5206 30.1813C50.5206 28.888 49.9977 27.7139 49.1447 26.8609C48.2917 26.0079 47.1222 25.4851 45.8244 25.4851H41.4079V20.9769C41.4079 19.6836 40.8851 18.5096 40.0321 17.6566C39.1882 16.8081 38.0142 16.2807 36.7117 16.2807H50.5114L57.1337 16.2762C66.1317 16.2762 73.4236 23.5681 73.4236 32.5661V43.9763L73.4282 43.9809Z"
                  fill="#E81F41"
                />
                <path
                  d="M50.5159 16.2853H41.4079L36.7163 16.2899C34.1251 16.2899 32.0247 18.3904 32.0247 20.9815V25.3979H27.6037C26.3104 25.3979 25.1363 25.9254 24.2833 26.7738C23.4395 27.6222 22.9075 28.7963 22.9075 30.0941C22.9075 32.6899 25.0079 34.7857 27.5991 34.7857H32.0201V39.2939C32.0201 41.8896 34.1206 43.9855 36.7117 43.9855H16.2897C14.8359 43.9855 13.4326 43.7929 12.0934 43.4398L6.10853 46.2098C4.11357 47.5031 1.55451 45.7053 2.09567 43.3893L3.43024 37.6933C1.28393 34.9371 -0.000183136 31.47 -0.000183105 27.7002L-0.000183012 16.2899C-0.000182939 7.28734 7.29175 -1.77e-07 16.2897 0L34.2306 3.5399e-07C38.7296 4.4299e-07 42.8067 1.82527 45.7464 4.76956C48.6953 7.71844 50.5159 11.7818 50.5159 16.2807V16.2853Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 244 64" className="transition">
                <path
                  fill="#E81F41"
                  d="M73.4 44c0 4.1-1.5 8-4.1 10.8l1.4 6c.5 2.2-2 4-4 2.7l-5.8-3.7c-1.2.3-2.4.5-3.8.5H39.2A16.2 16.2 0 0 1 22.9 44h13.8c2.6 0 4.7-2.1 4.7-4.7v-4.4h4.4a4.7 4.7 0 1 0 0-9.4h-4.4V21a4.7 4.7 0 0 0-4.7-4.7h20.4c9 0 16.3 7.3 16.3 16.3V44Z"
                />
                <path
                  fill="#fff"
                  d="M50.5 16.3H36.7A4.7 4.7 0 0 0 32 21v4.4h-4.4a4.7 4.7 0 0 0 0 9.4H32v4.5c0 2.6 2.1 4.7 4.7 4.7H16.3c-1.5 0-2.9-.2-4.2-.6l-6 2.8c-2 1.3-4.5-.5-4-2.8l1.3-5.7a16.2 16.2 0 0 1-3.4-10V16.3C0 7.3 7.3 0 16.3 0h18a16.2 16.2 0 0 1 16.2 16.3ZM208 23.7h-2.2v21.6h2.3v-6.5c0-.7 0-1.4.2-2 .2-.7.4-1.2.8-1.7.3-.5.7-.8 1.2-1 .6-.3 1.2-.4 2-.4 1 0 1.7.3 2.2 1 .5.6.8 1.5.8 2.6v8h2.2v-8.2c0-.8 0-1.6-.3-2.2-.2-.7-.5-1.3-1-1.8-.3-.4-.9-.8-1.5-1a6 6 0 0 0-5 .2l-1 .7-.6.8v-10ZM200.3 29.3a5.8 5.8 0 0 0-2.3-1.9 7 7 0 0 0-5.9 0 7.8 7.8 0 0 0-4 4.6 9.3 9.3 0 0 0 0 6.5 7.5 7.5 0 0 0 13 2.3l1.8 1.5c-1 1.2-2 2.1-3.3 2.7-1.3.6-2.7.9-4.4.9a10.2 10.2 0 0 1-9.5-6.4c-.5-1.3-.8-2.7-.8-4.3a11.2 11.2 0 0 1 3-7.5 10 10 0 0 1 7.3-3.1c1.4 0 2.7.2 4 .7 1.3.5 2.3 1.3 3.2 2.5l-2.1 1.5Z"
                />
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M96.5 25.1h-7.8v20.3h7.8A10.6 10.6 0 0 0 103 43a8.7 8.7 0 0 0 3-4.5c.3-1 .4-2.1.4-3.4a9.7 9.7 0 0 0-1.7-6 8.7 8.7 0 0 0-1.7-1.8 10.2 10.2 0 0 0-6.5-2.3Zm-.8 18h-4.6V27.3h4.6c1.2 0 2.3.2 3.3.5a6.7 6.7 0 0 1 4.3 3.9c.4 1 .6 2.1.6 3.5s-.2 2.6-.7 3.6a6.7 6.7 0 0 1-4.3 3.9c-1 .3-2 .4-3.2.4ZM109.7 35.8c-.4.9-.6 1.8-.6 2.9 0 1 .2 2 .6 2.8.3.9.8 1.6 1.5 2.2.6.7 1.3 1.1 2.2 1.5.9.3 1.8.5 2.9.5 1 0 2-.2 2.8-.5a6.6 6.6 0 0 0 3.8-3.7c.3-.8.5-1.8.5-2.8 0-1-.2-2-.5-2.9a6.8 6.8 0 0 0-3.8-3.7c-.8-.3-1.8-.5-2.8-.5-1 0-2 .2-2.9.5a6.6 6.6 0 0 0-3.7 3.7Zm2.2 4.8a5.6 5.6 0 0 1 0-4 4.5 4.5 0 0 1 4.4-3c.7 0 1.4.2 2 .5a4.5 4.5 0 0 1 2.4 2.6c.2.6.3 1.3.3 2s0 1.3-.3 2a4.6 4.6 0 0 1-2.5 2.6c-.5.2-1.2.3-2 .3-.6 0-1.3 0-1.9-.3a4.5 4.5 0 0 1-2.4-2.7Z"
                  clipRule="evenodd"
                />
                <path
                  fill="#fff"
                  d="M136.4 35.3c-.5-.6-1-1-1.6-1.2-.5-.3-1.1-.4-1.8-.4s-1.4.1-2 .4c-.5.2-1 .6-1.4 1l-.8 1.6a6.3 6.3 0 0 0 0 3.9l1 1.6a4.1 4.1 0 0 0 3.2 1.4 4 4 0 0 0 3.4-1.6l1.7 1.6c-.7.7-1.4 1.2-2.3 1.6-.9.3-1.8.5-2.8.5-1 0-2-.2-2.8-.5a6.1 6.1 0 0 1-3.6-3.7c-.3-.9-.5-1.8-.5-2.8 0-1 .2-2 .5-2.8a6.6 6.6 0 0 1 3.6-3.7c.9-.4 1.8-.6 2.8-.6 1 0 2 .2 2.8.5 1 .4 1.7 1 2.4 1.6l-1.8 1.6ZM144 33.9h4v-2h-4v-3.7h-2.2V32h-3v1.9h3v7.3l.1 1.9c.1.5.3 1 .6 1.4.2.4.6.7 1 .9.6.2 1.2.3 2 .3l1.3-.1c.5 0 1-.2 1.3-.4l-.1-2a4.4 4.4 0 0 1-2 .4c-.5 0-.8 0-1.1-.2-.3-.2-.5-.4-.6-.7l-.2-1V34Z"
                />
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M150 38.7a7.2 7.2 0 0 1 2-5.1c.6-.6 1.4-1.1 2.2-1.5 1-.3 1.9-.5 2.9-.5s2 .2 2.8.5a6.6 6.6 0 0 1 3.8 3.7c.4.9.5 1.8.5 2.9a6.8 6.8 0 0 1-4.3 6.5 7.8 7.8 0 0 1-5.7 0 6.6 6.6 0 0 1-3.7-3.7c-.4-.8-.6-1.8-.6-2.8Zm2.4 0c0 .7 0 1.3.3 2a4.6 4.6 0 0 0 4.4 3c.7 0 1.4-.2 2-.4a4.5 4.5 0 0 0 2.4-2.7c.2-.6.3-1.2.3-2 0-.6 0-1.3-.3-1.9a4.5 4.5 0 0 0-4.4-3c-.7 0-1.4.1-2 .4a4.5 4.5 0 0 0-2.4 2.6c-.2.6-.3 1.3-.3 2Z"
                  clipRule="evenodd"
                />
                <path
                  fill="#fff"
                  d="m167.6 33.4.1 1.7v10.2h2.2v-6.5c0-1.5.3-2.7 1-3.6.6-.9 1.6-1.3 3-1.3l1.1.1.2-2.2-.5-.2a5.4 5.4 0 0 0-3.3.8 4.5 4.5 0 0 0-1.6 1.8 22.5 22.5 0 0 0-.1-2.2h-2.1v1.4Z"
                />
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M221.6 33.7c.6-.7 1.5-1.2 2.4-1.6 1-.3 1.9-.5 2.9-.5 2 0 3.4.5 4.3 1.4.8 1 1.3 2.4 1.3 4.3V43a13.3 13.3 0 0 0 .2 2.4h-2.2l-.1-1v-1c-.5.6-1 1.2-1.8 1.6a5 5 0 0 1-2.7.7 7 7 0 0 1-2-.3c-.5-.1-1-.4-1.5-.7-.4-.4-.8-.8-1-1.3-.3-.5-.5-1-.5-1.7 0-1 .3-2 1-2.6.5-.6 1.2-1 2-1.4a36.5 36.5 0 0 1 5.4-.7h1v-.4c0-1-.4-1.7-1-2.2-.5-.5-1.3-.7-2.4-.7-.7 0-1.4.1-2.1.4a5 5 0 0 0-1.9 1l-1.3-1.4Zm6.4 5.2a8 8 0 0 0-3.4.6 2 2 0 0 0-1.2 2c0 .8.2 1.4.8 1.8.6.3 1.3.5 2.1.5a4 4 0 0 0 1.7-.3 3.6 3.6 0 0 0 2-2.2l.2-1.5v-.9H228Z"
                  clipRule="evenodd"
                />
                <path
                  fill="#fff"
                  d="M240 33.9h3.9v-2h-4v-3.7h-2.2V32h-3v1.9h3v7.3l.1 1.9c.1.5.3 1 .6 1.4.2.4.6.7 1 .9.6.2 1.2.3 2 .3l1.3-.1c.5 0 1-.2 1.3-.4v-2a4.4 4.4 0 0 1-2 .4c-.6 0-1 0-1.2-.2-.3-.2-.5-.4-.6-.7l-.2-1V34Z"
                />
              </svg>
            )}
          </div>

          <Menu defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>

        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <button onClick={logout}>Logout</button>
          </Header>

          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }} items={[]} />
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              Bill is a cat.
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>*/}
    </>
  );
}

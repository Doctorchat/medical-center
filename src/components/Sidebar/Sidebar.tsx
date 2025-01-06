'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';

import { LogoutMenuItem } from './LogoutMenuItem';
import type { MenuItem } from '@/types';

const items: MenuItem[] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: <Link href="/">Dashboard</Link>,
  },
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: <Link href="/profile">Profil</Link>,
  },
  LogoutMenuItem,
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      <aside className="h-screen max-w-64 w-full">
        <Menu
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={[pathname]}
          mode="inline"
          items={items}
          inlineCollapsed={false}
          className="h-full !p-2"
        />
      </aside>
    </>
  );
};

export default Sidebar;

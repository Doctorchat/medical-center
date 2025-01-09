import React from 'react';
import { Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import { authService } from '@/services/auth.service';
import type { MenuItem } from '@/types';
const { confirm } = Modal;

const showDeleteConfirm = () => {
  confirm({
    title: 'Sigur doriți să ieșiți din cont?',
    content:
      'Odată ce vă deconectați, sesiunea dvs. va fi închisă și toate datele nesalvate vor fi pierdute.',
    okText: 'Da, vreau să ies',
    okType: 'danger',
    cancelText: 'Anulează',
    onOk: authService.logout,
    type: 'warning',
  });
};

export const LogoutMenuItem: MenuItem = {
  key: 'logout',
  icon: <LogoutOutlined />,
  label: 'Ieși din cont',
  danger: true,
  onClick: showDeleteConfirm,
};

'use client';
import React from 'react';
import { consultationService } from '@/services/consultation.service';

import { Button, message, Popconfirm, Space, Spin, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '@/types';
import type { LiteralUnion } from 'antd/es/_util/type';
import type { PresetColorKey } from 'antd/es/theme/internal';

interface ConsultationStatus {
  label: string;
  badgeColor: LiteralUnion<PresetColorKey>;
}

const CONSULTATION_STATUS: Record<number, ConsultationStatus> = {
  0: {
    label: 'Rezervat',
    badgeColor: 'gold',
  },
  1: {
    label: 'Confirmat',
    badgeColor: 'green',
  },
  2: {
    label: 'Anulat',
    badgeColor: 'red',
  },
  3: {
    label: 'Finalizat',
    badgeColor: 'blue',
  },
};

const columns: TableProps<Appointment>['columns'] = [
  {
    title: 'Client',
    dataIndex: 'user',
    key: 'user',
    render: (_, { user }) => user?.name,
  },
  {
    title: 'Doctor',
    dataIndex: 'doctor',
    key: 'doctor',
    render: (_, { doctor }) => doctor?.name,
  },

  {
    title: 'Statut',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status }) => {
      const s = CONSULTATION_STATUS[status];
      return <Tag color={s.badgeColor}>{s.label}</Tag>;
    },
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, { id }) => (
      <Space size="middle">
        <CancelConsultationButton id={id} />
      </Space>
    ),
  },
];

export default function HomePage() {
  const {
    data: consultations,
    isLoading,
    isError,
  } = useQuery({
    queryFn: async () => await consultationService.getAll(),
    queryKey: ['consultations-list'],
  });

  if (isLoading) return <Spin spinning />;
  if (isError) return <div>Sorry There was an Error</div>;

  console.log(consultations?.data);
  return (
    <>
      <Table columns={columns} dataSource={consultations?.data} />
    </>
  );
}

const CancelConsultationButton: React.FC<{ id: number }> = ({ id }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: number) => await consultationService.cancel(id),
    onSuccess: () => {
      message.success('Consultația a fost creată cu succes!');
      queryClient.invalidateQueries({ queryKey: ['consultations-list'] });
    },
    onError: (error) => {
      console.error('Eroare la crearea consultației:', error);
      message.error('A apărut o eroare la crearea consultației.');
    },
  });

  const onConfirm = async () => {
    mutation.mutate(id);
  };

  return (
    <Popconfirm
      title="Delete the task"
      description="Are you sure to delete this task?"
      okText="Yes"
      cancelText="No"
      onConfirm={onConfirm}
    >
      <Button danger loading={mutation.isPending}>
        Cancel
      </Button>
    </Popconfirm>
  );
};

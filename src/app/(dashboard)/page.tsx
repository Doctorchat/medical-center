'use client';
import React, { useMemo, useState } from 'react';
import { consultationService } from '@/services/consultation.service';

import { Empty, message, Popover, Space, Spin, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '@/types';
import type { LiteralUnion } from 'antd/es/_util/type';
import type { PresetColorKey } from 'antd/es/theme/internal';
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { DateTime } from 'luxon';
import { cn } from '@/utils/classNames';

type ConsultationStatusType = 'cancel' | 'confirm' | 'complete';

interface ConsultationStatus {
  label: string;
  badgeColor: LiteralUnion<PresetColorKey>;
  type?: ConsultationStatusType;
}

const CONSULTATION_STATUS: Record<number, ConsultationStatus> = {
  0: {
    label: 'Rezervat',
    badgeColor: 'gold',
  },
  1: {
    label: 'Confirmat',
    badgeColor: 'green',
    type: 'confirm',
  },
  2: {
    label: 'Anulat',
    badgeColor: 'red',
    type: 'cancel',
  },
  3: {
    label: 'Finalizat',
    badgeColor: 'blue',
    type: 'complete',
  },
};

const CONSULTATION_STATUS_LIST = Object.entries(CONSULTATION_STATUS).map(
  ([key, value]) => {
    return {
      value: key,
      ...value,
    };
  },
);

const columns: TableProps<Appointment>['columns'] = [
  {
    title: 'Client',
    dataIndex: 'user',
    key: 'user',
    render: (_, { user }) => user?.name,
  },
  {
    title: 'Ora',
    dataIndex: 'time',
    key: 'time',
    render: (_, { start_time }) =>
      DateTime.fromFormat(start_time, 'yyyy-MM-dd HH:mm:ss', {
        locale: 'ro',
      }).toFormat('d LLLL yyyy, HH:mm', {
        locale: 'ro',
      }),
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
    render: (_, { status, id }) => (
      <Space size="large">
        <StatusConsultationButton statusId={status} consultationId={id} />
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
  if (isError) return <Empty description="Datele lipsesc" />;

  console.log(consultations?.data);
  return (
    <>
      <Table columns={columns} dataSource={consultations?.data} />
    </>
  );
}

const StatusConsultationButton: React.FC<{
  consultationId: number;
  statusId: number;
}> = ({ statusId, consultationId }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    String(statusId),
  );
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      type,
    }: {
      id: number;
      type: ConsultationStatusType;
    }) => {
      if (type === 'cancel') {
        return await consultationService.cancel(id);
      }
      if (type === 'confirm') {
        return await consultationService.confirm(id);
      }
      if (type === 'complete') {
        return await consultationService.complete(id);
      }
    },
    onSuccess: () => {
      message.success('Datele au fost actualizate');
      queryClient.invalidateQueries({ queryKey: ['consultations-list'] });
    },
    onError: () => {
      message.error('A apărut o eroare la actualizarea datelor.');
      setSelectedStatus(String(statusId));
    },
  });

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setIsOpen(false);

    const type = CONSULTATION_STATUS[Number(status)]?.type;
    if (!type) return;

    mutation.mutate({
      id: Number(consultationId),
      type,
    });
  };

  const content = useMemo(
    () => (
      <div className="flex flex-col gap-2 max-w-36">
        {CONSULTATION_STATUS_LIST.map((status) => (
          <Tag
            key={status.label}
            color={status.badgeColor}
            className={cn('cursor-pointer hover:scale-105 transition', {
              '!hidden': status?.value === '0',
            })}
            onClick={() => handleStatusSelect(status.value)}
          >
            {status.label}
          </Tag>
        ))}
      </div>
    ),
    [],
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom"
    >
      {selectedStatus && (
        <Tag
          color={CONSULTATION_STATUS[Number(selectedStatus)]?.badgeColor}
          icon={mutation?.isPending ? <LoadingOutlined /> : <EditOutlined />}
          className="cursor-pointer"
        >
          {CONSULTATION_STATUS[Number(selectedStatus)]?.label}
        </Tag>
      )}
    </Popover>
  );
};

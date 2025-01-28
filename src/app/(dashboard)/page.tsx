'use client';
import React, { useMemo, useState } from 'react';
import { consultationService } from '@/services/consultation.service';

import {
  Button,
  Empty,
  message,
  Modal,
  Popover,
  Input,
  Spin,
  Table,
  Tag,
} from 'antd';
import type { TableProps } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '@/types';
import type { LiteralUnion } from 'antd/es/_util/type';
import type { PresetColorKey } from 'antd/es/theme/internal';
import {
  EditOutlined,
  LoadingOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { DateTime } from 'luxon';
import { cn } from '@/utils/classNames';
import { useDebounce } from 'react-use';

const { TextArea } = Input;

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
    render: (_, { user }) => (
      <div className="font-medium">
        <div>{user?.name}</div>
        <a href={`tel:${user?.phone}`} className="flex text-dc-red max-w-max">
          {user?.phone}
        </a>
        <a
          href={`mailto:${user?.email}`}
          className="flex font-normal text-gray-400 max-w-max"
        >
          {user?.email}
        </a>
      </div>
    ),
  },
  {
    title: 'Ora începere',
    dataIndex: 'start_time',
    key: 'start_time',
    render: (_, { start_time }) =>
      DateTime.fromFormat(start_time, 'yyyy-MM-dd HH:mm:ss').toFormat(
        'd LLLL yyyy, HH:mm',
        {
          locale: 'ro',
        },
      ),
  },
  {
    title: 'Ora finalizare',
    dataIndex: 'end_time',
    key: 'end_time',
    render: (_, { end_time }) =>
      DateTime.fromFormat(end_time, 'yyyy-MM-dd HH:mm:ss').toFormat('HH:mm', {
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
      <StatusConsultationButton statusId={status} consultationId={id} />
    ),
  },

  {
    title: 'Comentariu',
    key: 'comment',
    dataIndex: 'comment',
    render: (_, { comment, id, updated_at }) => (
      <ModifyCommentModal
        defaultComment={comment}
        consultationId={id}
        date={updated_at}
      />
    ),
  },
];

export default function HomePage() {
  const [search, setSearch] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null);

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    [search],
  );

  const { data: consultations, isLoading } = useQuery({
    queryFn: async () =>
      await consultationService.getAll(
        debouncedSearch ? { search: debouncedSearch } : undefined,
      ),
    queryKey: ['consultations-list', debouncedSearch],
  });

  return (
    <>
      <div className="mb-5 w-full">
        <Input
          placeholder="Căutare după nume, email și telefon..."
          onChange={(e) => setSearch(e.currentTarget.value)}
          addonBefore={<SearchOutlined />}
        />
      </div>

      <div className="mb-5">{isLoading && <Spin spinning />}</div>

      {!isLoading && (
        <Table columns={columns} dataSource={consultations?.data} />
      )}
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

const ModifyCommentModal: React.FC<{
  defaultComment: string | null;
  consultationId: number;
  date: string;
}> = ({ defaultComment, consultationId, date }) => {
  const [commentValue, setCommentValue] = useState(defaultComment);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () =>
      await consultationService.modifyComment(consultationId, commentValue),
    onSuccess: () => {
      message.success('Datele au fost actualizate');
      queryClient.invalidateQueries({ queryKey: ['consultations-list'] });
    },
    onError: () => {
      message.error('A apărut o eroare la actualizarea datelor.');
    },
  });

  const hideModal = () => {
    setCommentValue(null);
    setOpen(false);
  };

  const onOk = () => {
    if (defaultComment === commentValue) {
      hideModal();
      return;
    }
    mutation.mutate();
    hideModal();
  };

  return (
    <>
      <Button
        type="default"
        onClick={showModal}
        icon={mutation?.isPending ? <LoadingOutlined /> : <EyeOutlined />}
      >
        Vezi / modifică
      </Button>
      <Modal
        title="Adăugare/modificare comentariu"
        open={open}
        onOk={onOk}
        onCancel={hideModal}
        okText="Salvează"
        cancelText="Anulare"
      >
        <div className="flex items-center mb-2 gap-2 text-sm text-gray-400">
          <div>Ultima actualizare:</div>
          <div className="text-dc-red">
            {DateTime.fromISO(date).toFormat('d LLLL yyyy, HH:mm', {
              locale: 'ro',
            })}
          </div>
        </div>

        <TextArea
          className="mb-5"
          defaultValue={defaultComment || ''}
          value={commentValue || ''}
          placeholder="Comentariu..."
          onChange={(e) => setCommentValue(e.currentTarget.value)}
          maxLength={1000}
          autoSize={{ minRows: 4 }}
          count={{
            show: true,
            max: 1000,
          }}
        />
      </Modal>
    </>
  );
};

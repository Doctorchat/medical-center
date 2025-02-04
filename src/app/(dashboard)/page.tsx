"use client";
import React, { useEffect, useMemo, useState } from "react";
import { consultationService } from "@/services/consultation.service";

import { message, Modal, Popover, Input, Spin, Table, Tag, Button } from "antd";
import type { TableProps } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ConsultationStatusType, IConsultation } from "@/types";
import {
  EditOutlined,
  LoadingOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { DateTime } from "luxon";
import { cn } from "@/utils/classNames";
import { useDebounce } from "react-use";
import { usePagination } from "@/hooks/use-pagination";
import { useTranslations } from "next-intl";
import {
  CONSULTATION_STATUS,
  CONSULTATION_STATUS_LIST,
} from "@/utils/constants";

const { TextArea } = Input;

export default function HomePage() {
  const [search, setSearch] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null);

  const { limit, page, updatePage, updateLimit } = usePagination();

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
        debouncedSearch
          ? { search: debouncedSearch }
          : { per_page: limit, page },
      ),
    queryKey: ["consultations-list", debouncedSearch, page, limit],
  });

  const t = useTranslations();

  const columns: TableProps<IConsultation>["columns"] = useMemo(
    () => [
      {
        title: t("client"),
        dataIndex: "user",
        key: "user",
        render: (_, { user }) => (
          <div className="font-medium">
            <div>{user?.name}</div>
            <a
              href={`tel:${user?.phone}`}
              className="flex text-dc-red max-w-max"
            >
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
        title: t("start_time"),
        dataIndex: "start_time",
        key: "start_time",
        render: (_, { start_time }) =>
          DateTime.fromFormat(start_time, "yyyy-MM-dd HH:mm:ss").toFormat(
            "d LLLL yyyy, HH:mm",
            {
              locale: "ro",
            },
          ),
      },

      {
        title: t("end_time"),
        dataIndex: "end_time",
        key: "end_time",
        render: (_, { end_time }) =>
          DateTime.fromFormat(end_time, "yyyy-MM-dd HH:mm:ss").toFormat(
            "HH:mm",
            {
              locale: "ro",
            },
          ),
      },

      {
        title: t("doctor"),
        dataIndex: "doctor",
        key: "doctor",
        render: (_, { doctor }) => doctor?.name,
      },

      {
        title: t("status"),
        key: "status",
        dataIndex: "status",
        render: (_, { status, id }) => (
          <StatusConsultationButton statusId={status} consultationId={id} />
        ),
      },

      {
        title: t("comment"),
        key: "comment",
        dataIndex: "comment",
        render: (_, { comment, id, updated_at }) => (
          <ModifyCommentModal
            defaultComment={comment}
            consultationId={id}
            date={updated_at}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <>
      <div className="mb-5 w-full">
        <Input
          size="large"
          placeholder={t("search_by_name_email_phone")}
          onChange={(e) => setSearch(e.currentTarget.value)}
          addonBefore={<SearchOutlined />}
        />
      </div>

      {isLoading && (
        <div className="mb-5 flex h-full">
          {isLoading && <div className="m-auto">{<Spin spinning />}</div>}
        </div>
      )}

      {!isLoading && (
        <Table
          bordered
          columns={columns}
          dataSource={consultations?.data}
          scroll={{ x: "max-content" }}
          pagination={
            !debouncedSearch && {
              total: consultations?.meta?.total,
              current: page,
              showSizeChanger: true,
              pageSize: limit,
              defaultPageSize: limit,
              pageSizeOptions: ["10", "20", "50", "75"],
              onShowSizeChange: updateLimit,
              onChange: updatePage,
            }
          }
        />
      )}
    </>
  );
}

const StatusConsultationButton: React.FC<{
  consultationId: number;
  statusId: number;
}> = ({ statusId, consultationId }) => {
  const t = useTranslations();
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setSelectedStatus(String(statusId));
  }, [consultationId, statusId]);

  const mutation = useMutation({
    mutationFn: async ({
      id,
      type,
    }: {
      id: number;
      type: ConsultationStatusType;
    }) => {
      if (type === "cancel") {
        return await consultationService.cancel(id);
      }
      if (type === "confirm") {
        return await consultationService.confirm(id);
      }
      if (type === "complete") {
        return await consultationService.complete(id);
      }
    },
    onSuccess: () => {
      message.success("Datele au fost actualizate");
      queryClient.invalidateQueries({ queryKey: ["consultations-list"] });
    },
    onError: () => {
      message.error("A apărut o eroare la actualizarea datelor.");
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
            className={cn("cursor-pointer hover:scale-105 transition w-full", {
              "!hidden": status?.value === "0",
            })}
            onClick={() => handleStatusSelect(status.value)}
          >
            {t(status?.label)}
          </Tag>
        ))}
      </div>
    ),
    [t, consultationId, statusId],
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
          {t(CONSULTATION_STATUS[Number(selectedStatus)]?.label)}
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
  const t = useTranslations();
  const [commentValue, setCommentValue] = useState(defaultComment);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (comment: string | null) =>
      await consultationService.modifyComment(consultationId, comment),
    onSuccess: () => {
      message.success("Datele au fost actualizate");
      queryClient.invalidateQueries({ queryKey: ["consultations-list"] });
      setCommentValue(commentValue);
      hideModal();
    },
    onError: () => {
      message.error("A apărut o eroare la actualizarea datelor.");
    },
  });

  const hideModal = () => {
    setOpen(false);
  };

  const onOk = () => {
    if (defaultComment === commentValue) {
      hideModal();
      return;
    }
    mutation.mutate(commentValue);
  };

  return (
    <>
      <Button
        type="default"
        onClick={showModal}
        icon={mutation?.isPending ? <LoadingOutlined /> : <EyeOutlined />}
      >
        {t("view_edit")}
      </Button>
      <Modal
        title={t("add_edit_comment")}
        open={open}
        onOk={onOk}
        onCancel={hideModal}
        okText={t("save")}
        cancelText={t("cancel")}
      >
        <div className="flex items-center mb-2 gap-2 text-sm text-gray-400">
          <div>{t("last_update")}:</div>
          <div className="text-dc-red">
            {DateTime.fromISO(date).toFormat("d LLLL yyyy, HH:mm", {
              locale: "ro",
            })}
          </div>
        </div>

        <TextArea
          className="mb-5"
          defaultValue={defaultComment || ""}
          value={commentValue || ""}
          placeholder={`${t("comment")}...`}
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

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConsultationStatusType } from "@/types";
import { consultationService } from "@/services/consultation.service";
import { message, Popover, Tag } from "antd";
import {
  CONSULTATION_STATUS,
  CONSULTATION_STATUS_LIST,
} from "@/utils/constants";
import { cn } from "@/utils/classNames";
import { EditOutlined, LoadingOutlined } from "@ant-design/icons";

export const StatusConsultationButton: React.FC<{
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
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "consultations-list" ||
          query.queryKey[0] === "consultations-list-kanban",
      });
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

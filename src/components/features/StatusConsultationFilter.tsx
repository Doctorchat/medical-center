import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Popover, Tag } from "antd";
import {
  CONSULTATION_STATUS,
  CONSULTATION_STATUS_LIST,
} from "@/utils/constants";
import { cn } from "@/utils/classNames";

export const StatusConsultationFilter: React.FC = () => {
  const t = useTranslations();
  const [selectedStatus, setSelectedStatus] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusSelect = (status: number) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };

  const content = useMemo(
    () => (
      <div className="flex flex-col gap-2 max-w-36">
        {CONSULTATION_STATUS_LIST.map((status) => (
          <Tag
            key={status.label}
            color={status.badgeColor}
            className={cn("cursor-pointer hover:scale-105 transition w-full")}
            onClick={() => handleStatusSelect(Number(status.value))}
          >
            {t(status?.label)}
          </Tag>
        ))}
      </div>
    ),
    [t],
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom"
    >
      <Tag
        color={CONSULTATION_STATUS[Number(selectedStatus)]?.badgeColor}
        className="cursor-pointer"
      >
        {t(CONSULTATION_STATUS[Number(selectedStatus)]?.label)}
      </Tag>
    </Popover>
  );
};

"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { DraggableItem } from "./DraggableItem";
import type { IConsultation, IKanban } from "@/types";

interface IProps {
  id: keyof IKanban;
  items: IConsultation[];
  isDroppable: boolean;
}

const KANBAN_COLUMNS_IDS: Record<keyof IKanban, string> = {
  booked: "reserved",
  confirmed: "confirmed",
  last10completed: "completed",
  today: "today",
};

export const DroppableColumn: React.FC<IProps> = ({
  id,
  isDroppable,
  items,
}) => {
  const t = useTranslations();
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 rounded-xl bg-gray-100 w-72 flex-none",
        isOver && isDroppable && "ring-2 ring-inset ring-transparent",
        id === "confirmed" && "bg-green-100 ring-green-300",
        id === "last10completed" && "bg-blue-100 ring-blue-300",
      )}
    >
      <div className="text-base font-semibold mb-2">
        {t(KANBAN_COLUMNS_IDS[id])}
      </div>

      {items.map((item) => (
        <DraggableItem key={item?.id} data={item} columnId={id} />
      ))}
    </div>
  );
};

"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { DraggableItem } from "./DraggableItem";
import type { IConsultation, IKanban } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        "pb-5 rounded-xl bg-gray-100 w-72 flex-none overflow-hidden",
        isOver && isDroppable && "ring-2 ring-inset ring-transparent",
        id === "booked" && "bg-amber-100",
        id === "confirmed" && "bg-green-100 ring-green-400",
        id === "last10completed" && "bg-sky-100 ring-sky-400",
      )}
    >
      <div className="text-base font-semibold p-5">
        {t(KANBAN_COLUMNS_IDS[id])}
      </div>

      <ScrollArea className="h-[calc(100%_-_theme(spacing.14))]">
        <div className="px-5">
          {items?.map((item) => (
            <DraggableItem key={item?.id} data={item} columnId={id} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

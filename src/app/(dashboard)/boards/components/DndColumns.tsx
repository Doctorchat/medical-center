"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { message } from "antd";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DroppableColumn } from "./DroppableColumn";

import { consultationService } from "@/services/consultation.service";
import { DraggableItem } from "@/app/(dashboard)/boards/components/DraggableItem";

import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import type {
  ConsultationStatusType,
  IConsultationDraggable,
  IKanban,
} from "@/types";

interface IProps {
  initialData?: IKanban;
}

const columnOrder: (keyof IKanban)[] = [
  "today",
  "booked",
  "confirmed",
  "last10completed",
];
const droppableColumns = ["confirmed", "last10completed"];

export const DndColumns: React.FC<IProps> = ({ initialData }) => {
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const [items, setItems] = useState<IKanban>({
    booked: [],
    confirmed: [],
    last10completed: [],
    today: [],
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      id,
      type,
    }: {
      id: number;
      type: ConsultationStatusType | null;
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
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const fromColumn = active.data.current?.columnId as keyof IKanban;
    const toColumn = over.id as keyof IKanban;
    const activeId = active?.data?.current?.id;

    // Verificăm dacă mutarea este validă
    if (
      fromColumn === toColumn ||
      !droppableColumns.includes(toColumn) ||
      !items[fromColumn]
    ) {
      return;
    }

    // Găsim index-ul și elementul mutat
    const activeIndex = items[fromColumn].findIndex(
      (item) => item.id === activeId,
    );
    const activeItem = items[fromColumn][activeIndex];

    if (activeIndex === -1 || !activeItem) return;

    // Creăm o copie nouă a stării
    const newItems = { ...items };

    // Eliminăm elementul din coloana sursă
    newItems[fromColumn] = newItems[fromColumn].filter(
      (item) => item.id !== activeId,
    );

    // Adăugăm elementul în coloana destinație
    newItems[toColumn] = [...newItems[toColumn], activeItem];

    // Actualizăm starea
    setItems(newItems);

    mutation.mutate(
      {
        id: Number(activeId),
        type:
          toColumn === "last10completed"
            ? "complete"
            : toColumn === "confirmed"
              ? "confirm"
              : null,
      },
      {
        onError: () => {
          message.error("A apărut o eroare la actualizarea datelor.");
          console.log("LOH", items);
          setItems(items);
        },
      },
    );
  };

  useEffect(() => {
    if (initialData) {
      setItems(initialData);
    }
  }, [initialData]);

  const [draggableItemData, setDraggableItemData] =
    useState<IConsultationDraggable>();

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={(event) =>
        setDraggableItemData(
          event?.active?.data?.current as IConsultationDraggable,
        )
      }
      sensors={sensors}
    >
      <ScrollArea className="max-h-screen w-full">
        <div className="flex gap-4 md:h-[calc(100vh_-_theme(spacing.12))] h-[calc(100vh_-_theme(spacing.24))]">
          {columnOrder?.map((columnId) => (
            <DroppableColumn
              key={columnId}
              id={columnId}
              items={items[columnId]}
              isDroppable={droppableColumns.includes(columnId)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DragOverlay>
        {draggableItemData ? (
          <DraggableItem
            data={draggableItemData}
            columnId={draggableItemData?.columnId}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { consultationService } from "@/services/consultation.service";

export default function HomePage() {
  const { data } = useQuery({
    queryFn: async () => await consultationService.getKanban(),
    queryKey: ["consultations-list-kanban"],
  });

  const [currentDragSource, setCurrentDragSource] = useState(null);

  const [columns, setColumns] = useState({
    column1: [
      { id: "1", content: "Item 1" },
      { id: "2", content: "Item 2" },
    ],
    column2: [
      { id: "3", content: "Item 3" },
      { id: "4", content: "Item 4" },
    ],
  });

  const handleDragStart = (start) => {
    setCurrentDragSource(start.source.droppableId);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    setCurrentDragSource(null);

    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    const newColumns = JSON.parse(JSON.stringify(columns));
    const [movedItem] = newColumns[source.droppableId].splice(source.index, 1);
    newColumns[destination.droppableId].splice(destination.index, 0, movedItem);

    setColumns(newColumns);
  };

  return (
    <>
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-5">
          {data &&
            Object.entries(data).map(([key, value]) => (
              <Droppable
                key={key}
                droppableId={key}
                isDropDisabled={currentDragSource === key}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="w-72 bg-gray-50 p-4 rounded-lg border"
                  >
                    <h3 className="font-bold mb-4">{key}</h3>
                    {value?.map((item, index: number) => (
                      <Draggable
                        key={item.id}
                        draggableId={String(item.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 mb-2 bg-white border rounded-lg shadow-sm transition-transform
                          ${
                            snapshot.isDragging && currentDragSource !== key
                              ? "bg-blue-50 shadow-md rotate-3 scale-105"
                              : ""
                          }`}
                          >
                            {item.user?.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
        </div>
      </DragDropContext>

      <div>
        {data?.confirmed?.map((item) => (
          <div key={item?.id}>{item?.doctor?.name}</div>
        ))}
      </div>
    </>
  );
}

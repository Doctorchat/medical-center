"use client";
import { useQuery } from "@tanstack/react-query";
import { consultationService } from "@/services/consultation.service";
import { DndColumns } from "./components/DndColumns";

export default function HomePage() {
  const { data } = useQuery({
    queryFn: async () => await consultationService.getKanban(),
    queryKey: ["consultations-list-kanban"],
  });

  return <DndColumns initialData={data} />;
}

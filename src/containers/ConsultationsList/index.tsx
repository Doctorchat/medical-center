"use client";
import React, { useMemo, useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "react-use";
import { useQuery } from "@tanstack/react-query";
import { consultationService } from "@/services/consultation.service";
import { useTranslations } from "next-intl";
import { Input, Spin, Table, TableProps } from "antd";
import type { IConsultation } from "@/types";
import { DateTime } from "luxon";
import { StatusConsultationButton } from "@/components/features/StatusConsultationButton";
import { SearchOutlined } from "@ant-design/icons";
import { EditConsultationModal } from "@/components/features/EditConsultationModal";
import { StatusConsultationFilter } from "@/components/features/StatusConsultationFilter";

export const ConsultationsList: React.FC = () => {
  const [search, setSearch] = useState<string | null>(null);
  const [status, setStatus] = useState<number>();
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
        key: "user",
        fixed: true,
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
        title: t("start_date_time"),
        key: "start_time",
        width: 210,
        render: (_, { start_time }) =>
          DateTime.fromFormat(start_time, "yyyy-MM-dd HH:mm:ss").toFormat(
            "d LLLL yyyy, HH:mm",
          ),
      },

      {
        title: t("end_time"),
        key: "end_time",
        width: 180,
        render: (_, { end_time }) =>
          DateTime.fromFormat(end_time, "yyyy-MM-dd HH:mm:ss").toFormat(
            "HH:mm",
          ),
      },

      {
        title: t("doctor"),
        key: "doctor",
        render: (_, { doctor }) => doctor?.name,
      },

      {
        title: t("status"),
        key: "status",
        width: 180,
        render: (_, { status, id }) => (
          <StatusConsultationButton statusId={status} consultationId={id} />
        ),
      },

      {
        title: t("comment"),
        key: "comment",
        width: 300,
        render: (_, { comment }) => comment,
      },

      {
        key: "actions",
        width: 100,
        render: (data) => <EditConsultationModal data={data} />,
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

        <StatusConsultationFilter />
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
};

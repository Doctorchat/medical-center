"use client";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  DatePicker,
  Input,
  message,
  Modal,
  TimePicker,
} from "antd";
import { DateTime } from "luxon";
import dayjs from "dayjs";
import { Slot } from "@radix-ui/react-slot";
import { EditOutlined } from "@ant-design/icons";

import { consultationService } from "@/services/consultation.service";

import type { IConsultation } from "@/types";
import { StatusConsultationButton } from "@/components/features/StatusConsultationButton";
import { cn } from "@/lib/utils";

const { TextArea } = Input;

interface IProps {
  data: IConsultation;
  children?: ReactNode;
}

export const EditConsultationModal: React.FC<IProps> = ({ data, children }) => {
  const t = useTranslations();
  const [commentValue, setCommentValue] = useState(data?.comment);
  const [startTimeValue, setStartTimeValue] = useState(
    dayjs(data?.start_time).format("YYYY-MM-DD HH:mm"),
  );
  const [endTimeValue, setEndTimeValue] = useState(
    dayjs(data?.end_time).format("YYYY-MM-DD HH:mm"),
  );

  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  const isDataChanged = useMemo(() => {
    return (
      (data?.comment !== commentValue ||
        data?.start_time !== startTimeValue ||
        data?.end_time !== endTimeValue) &&
      !error
    );
  }, [
    data?.comment,
    data?.start_time,
    data?.end_time,
    commentValue,
    startTimeValue,
    endTimeValue,
    error,
  ]);

  const showModal = () => {
    setOpen(true);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const endTime = dayjs(endTimeValue).format("HH:mm");
      const adjustedEndTime =
        dayjs(startTimeValue).format("YYYY-MM-DD") + ` ${endTime}`;

      await consultationService.modifyLead(data?.id, {
        start_time: startTimeValue,
        end_time: adjustedEndTime,
        comment: commentValue,
      });
    },
    onSuccess: () => {
      message.success("Datele au fost actualizate");
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "consultations-list" ||
          query.queryKey[0] === "consultations-list-kanban",
      });
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
    if (!isDataChanged) {
      hideModal();
      return;
    }
    mutation.mutate();
  };

  useEffect(() => {
    const isEndTimeGreater =
      dayjs(endTimeValue).format("HH:mm") >
      dayjs(startTimeValue).format("HH:mm");

    if (!isEndTimeGreater) {
      setError(true);
    }
    setError(false);
  }, [startTimeValue, endTimeValue]);

  useEffect(() => {
    setCommentValue(data?.comment);
    setStartTimeValue(dayjs(data?.start_time).format("YYYY-MM-DD HH:mm"));
    setEndTimeValue(dayjs(data?.end_time).format("YYYY-MM-DD HH:mm"));
  }, [data]);

  return (
    <>
      {children ? (
        <Slot onClick={showModal}>{children}</Slot>
      ) : (
        <Button onClick={showModal} variant="filled" icon={<EditOutlined />}>
          {t("edit")}
        </Button>
      )}

      <Modal
        title={data?.user?.name}
        open={open}
        onOk={onOk}
        onCancel={hideModal}
        okText={t("save")}
        cancelText={t("cancel")}
        okButtonProps={{
          disabled: !isDataChanged,
        }}
        footer={(originNode) => {
          return (
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="text-gray-400 text-left">
                <div className="text-xs">{t("last_update")}:</div>
                <div className="text-sm text-dc-red">
                  {DateTime.fromISO(data?.updated_at, {
                    zone: "Europe/Chisinau",
                  }).toFormat("d LLLL yyyy, HH:mm")}
                </div>
              </div>
              <div className="flex xs:flex-nowrap flex-wrap justify-end gap-2">
                {originNode}
              </div>
            </div>
          );
        }}
      >
        <div className="divide-y divide-gray-200">
          <DrawerItem
            label={t("status")}
            value={
              <StatusConsultationButton
                statusId={data?.status}
                consultationId={data?.id}
              />
            }
          />
          <DrawerItem label={t("email")} value={data?.user?.email} />

          <DrawerItem label={t("phone")} value={data?.user?.phone} />

          <DrawerItem label={t("doctor")} value={data?.doctor?.name} />

          <DrawerItem
            responsive
            label={t("start_date_time")}
            value={
              <DatePicker
                format="DD MMMM, HH:mm"
                size="large"
                showTime={{
                  minuteStep: 5,
                  showSecond: false,
                }}
                allowClear={false}
                defaultValue={dayjs(startTimeValue, "YYYY-MM-DD HH:mm")}
                className="w-full"
                onChange={(value) =>
                  setStartTimeValue(dayjs(value).format("YYYY-MM-DD HH:mm"))
                }
              />
            }
          />

          <DrawerItem
            responsive
            label={t("end_time")}
            value={
              <TimePicker
                allowClear={false}
                format="HH:mm"
                size="large"
                defaultValue={dayjs(endTimeValue, "YYYY-MM-DD HH:mm")}
                minuteStep={5}
                className="w-full"
                onChange={(value) =>
                  setEndTimeValue(dayjs(value).format("YYYY-MM-DD HH:mm"))
                }
              />
            }
          />

          {error && (
            <div className="!border-t-0 pb-3">
              <Alert
                type="error"
                showIcon
                message={t("error.end_time_later_than_start")}
              />
            </div>
          )}

          <div className="space-y-1 py-5">
            <label className="text-gray-400" htmlFor="comment">
              {t("comment")}
            </label>
            <TextArea
              id="comment"
              className="mb-5"
              defaultValue={data?.comment || ""}
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
          </div>
        </div>
      </Modal>
    </>
  );
};

const DrawerItem = ({
  label,
  value,
  responsive,
}: {
  label: string;
  value: ReactNode;
  responsive?: boolean;
}) => {
  return (
    <div
      className={cn(
        "grid-cols-2 gap-6 py-3 items-center",
        responsive
          ? "flex flex-col sm:items-center items-start sm:flex-row xs:grid sm:gap-6 gap-2"
          : "grid",
      )}
    >
      <div className="text-gray-400">{label}:</div>
      <div className="font-medium w-full">{value}</div>
    </div>
  );
};

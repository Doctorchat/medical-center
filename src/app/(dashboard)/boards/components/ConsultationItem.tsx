"use client";
import React from "react";
import { Button, Drawer } from "antd";
import { useToggle } from "react-use";
import { IConsultation } from "@/types";

interface IProps {
  data: IConsultation;
}

export const ConsultationItem: React.FC<IProps> = ({ data }) => {
  const [openDrawer, setOpenDrawer] = useToggle(false);
  return (
    <>
      <Button onClick={setOpenDrawer}>{data?.id}</Button>
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={setOpenDrawer}
        open={openDrawer}
      >
        {data?.id}
      </Drawer>
    </>
  );
};

"use client";

import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/admin/Table";
import Button from "@/components/admin/Button";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/admin/Dropdown";
import PopConfirm from "@/components/admin/PopConfirm";
import { EllipsisVertical } from "lucide-react";
import {
  deleteEnquiry,
  getAllEnquiryList,
} from "@/store/slices/settingSlice";

const Enquiry = () => {
  const { userId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.setting.enquiryList);
  const [search, setSearch] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    dispatch(getAllEnquiryList());
  }, [dispatch, userId]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data?.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const handleDelete = (rowData) => {
    dispatch(deleteEnquiry({ id: rowData?.id, userId }))
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "Enquiry has been deleted successfully !.",
            status: "success",
          });
          dispatch(getAllEnquiryList());
        } else {
          showToast({
            title: resp?.payload?.status,
            description: resp?.payload?.message,
            status: "error",
          });
        }
      })
      .catch(() => {
        showToast({
          title: "Something went wrong !.",
          description: "Failed to delete blog.",
          status: "error",
        });
      });
  };

  const dummyColumns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (value, record) => <p className="font-medium">{value}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (value, record) => <p className="font-medium">{value}</p>,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      render: (value) => <p className="text-wrap">{value}</p>,
    },
    {
      title: "Message",
      dataIndex: "message",
      render: (value) => <p className="text-wrap">{value}</p>,
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (value) => <p className="text-wrap">{value}</p>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (value, record, rowIndex) => {
        const isOpen = openDropdowns[record.id] || false; // or record._id, whatever unique
        return (
          <Dropdown
            open={isOpen}
            onOpenChange={(open) =>
              setOpenDropdowns((prev) => ({ ...prev, [record.id]: open }))
            }
            items={[
              { key: 1, label: "edit", onClick: () => handleEdit(record) },
              {
                key: 2,
                label: (
                  <PopConfirm
                    title="Are you sure you want to delete?"
                    onConfirm={() => handleDelete(record)}
                    onCancel={() => console.log("Cancel")}
                  >
                    <div className="text-red-600">Delete</div>
                  </PopConfirm>
                ),
                noClose: true,
              },
            ]}
          >
            <Button size="small" variant="secondary">
              <EllipsisVertical />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          showIcon
          onChange={(e) => setSearch(e.target.value)}
          wrapperClassName="w-80"
        />
      </div>
    );
  }, [search]);

  return (
    <>
      <h2 className="text-lg font-semibold">Enquiry list</h2>
      <Table
        columns={dummyColumns}
        dataSource={filteredData}
        topContent={topContent}
        className="w-full"
        scroll={{ x: 1300 }}
      />
    </>
  );
};

export default Enquiry;

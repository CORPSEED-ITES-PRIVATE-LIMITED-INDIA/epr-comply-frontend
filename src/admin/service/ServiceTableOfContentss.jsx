import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addService,
  addTableOfContent,
  deleteSubCategory,
  delteTableOfContent,
  getServiceListBySubCategoryId,
  getServiceTableContentList,
  updateService,
  updateServiceTableOfContent,
} from "../../toolkit/slices/serviceSlice";
import { Link, useParams } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import dayjs from "dayjs";
import Input from "../../components/Input";
import Select from "../../components/Select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Dropdown from "../../components/Dropdown";
import PopConfirm from "../../components/PopConfirm";
import { EllipsisVertical } from "lucide-react";
import TextEditor from "../../components/TextEditor";

const serviceSchema = z.object({
  tabName: z.string().nonempty("Tab name is required"),
  title: z.string().nonempty("Title is required"),
  description: z.string().optional(),
  displayOrder: z.string().optional(),
  displayStatus: z.string().optional(),
});

const ServiceTableOfContentss = () => {
  const { userId, categoryId, subcategoryId, serviceId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.service.serviceTableOfContentList);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [rowData, setRowData] = useState(null);
  const [descModal, setDescModal] = useState(false);

  useEffect(() => {
    dispatch(getServiceTableContentList({ serviceId }));
  }, [dispatch, serviceId]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data?.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      tabName: "",
      title: "",
      description: "",
      displayOrder: "",
      displayStatus: "",
    },
  });

  const handleDelete = (rowData) => {
    dispatch(delteTableOfContent({ id: rowData?.id, userId }))
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "Tab content has been deleted successfully !.",
            status: "success",
          });
          dispatch(getServiceTableContentList({ serviceId }));
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
          description: "Failed to delete category.",
          status: "error",
        });
      });
  };

  const handleEdit = (item) => {
    reset({
      title: item?.title,
      tabName: item?.tabName,
      description: item?.description,
      displayOrder: item?.displayOrder,
      displayStatus: item?.displayStatus,
    });
    setRowData(item);
    setOpenModal(true);
  };

  const onSubmit = (data) => {
    data.serviceId = serviceId;
    if (rowData) {
      dispatch(updateServiceTableOfContent({ id: rowData?.id, userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Tab content has been updated successfully !.",
              status: "success",
            });
            setOpenModal(false);
            setRowData(null);
            dispatch(getServiceTableContentList({ serviceId }));
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
            description: "Failed to update service.",
            status: "error",
          });
        });
    } else {
      dispatch(addTableOfContent({ userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Tab content  has been added successfully.",
              status: "success",
            });
            setOpenModal(false);
            dispatch(getServiceTableContentList({ serviceId }));
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
            description: "Failed to add service.",
            status: "error",
          });
        });
    }
  };

  const dummyColumns = [
    {
      title: "Tab name",
      dataIndex: "tabName",
      render: (value) => <p className="text-wrap">{value}</p>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (value, record) => <p className="font-medium">{value}</p>,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (value, record) => (
        <Button
          onClick={() => {
            setDescModal(true);
            setRowData(record);
          }}
        >
          View
        </Button>
      ),
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
        <Button onClick={() => setOpenModal(true)}>Add tab</Button>
      </div>
    );
  }, [search]);

  return (
    <>
      <h2 className="text-lg font-semibold">Service table of content</h2>
      <Table
        columns={dummyColumns}
        dataSource={filteredData}
        topContent={topContent}
        className="w-full"
      />
      <Modal
        title={rowData ? "Update service table of content" : "Create service table of content"}
        open={openModal}
        width={"60%"}
        onCancel={() => setOpenModal(false)}
        onOk={handleSubmit(onSubmit)}
      >
        <form className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-auto px-2 py-2.5">
          {/* Slug */}
          <div className="flex flex-col">
            <label className="mb-1">Tab name</label>
            <Controller
              name="tabName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter slug" />
              )}
            />
            {errors.slug && (
              <p className="text-red-600 text-sm">{errors.slug.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <label className="mb-1">Title</label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter title" />
              )}
            />
            {errors.title && (
              <p className="text-red-600 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Full Description */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextEditor
                    data={field?.value}
                    onChange={(prev, editor) => {
                      const newData = editor?.getData();
                      field.onChange(newData);
                    }}
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Display Status */}
          <div className="flex flex-col">
            <label className="mb-1">Display Status</label>
            <Controller
              name="displayStatus"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: "Inactive", value: 0 },
                    { label: "Active", value: 1 },
                  ]}
                />
              )}
            />
          </div>

          {/* Meta Title */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Display order</label>
            <Controller
              name="displayOrder"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Meta title" />
              )}
            />
          </div>
        </form>
      </Modal>

      <Modal
        title={"Description"}
        open={descModal}
        width={"60%"}
        onCancel={() => {
          setDescModal(false);
          setRowData(null);
        }}
        footer={false}
      >
        <div className="px-8 py-10 max-w-4xl mx-auto max-h-[80vh] overflow-auto">
          <div
            className="prose prose-lg"
            dangerouslySetInnerHTML={{ __html: rowData?.description }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default ServiceTableOfContentss;

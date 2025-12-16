import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addServiceFAQ,
  deleteServiceFaqs,
  getAllServiceFAQS,
  updateServiceFaqs,
} from "../../toolkit/slices/serviceSlice";
import { useParams } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import Input from "../../components/Input";
import Select from "../../components/Select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Dropdown from "../../components/Dropdown";
import PopConfirm from "../../components/PopConfirm";
import { EllipsisVertical } from "lucide-react";
import TextEditor from "../../components/TextEditor";

const serviceSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  displayOrder: z.number(),
  displayStatus: z.number(),
});

const ServiceFAQS = () => {
  const { userId, serviceId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.service.serviceFaqsList);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [rowData, setRowData] = useState(null);
  const [descModal, setDescModal] = useState(false);

  useEffect(() => {
    dispatch(getAllServiceFAQS(serviceId));
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
      question: "",
      answer: "",
      displayOrder: 0,
      displayStatus: 1,
    },
  });

  const handleDelete = (rowData) => {
    dispatch(deleteServiceFaqs({ id: rowData?.id, userId }))
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "Tab content has been deleted successfully !.",
            status: "success",
          });
          dispatch(getAllServiceFAQS(serviceId));
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
      question: item?.question || "",
      answer: item?.answer || "",
      displayOrder: Number(item?.displayOrder || 0),
      displayStatus: Number(item?.displayStatus || 0),
    });
    setRowData(item);
    setOpenModal(true);
  };

  const onSubmit = (data) => {
    console.log("dfgdkjgjgdjgd", data);
    data.serviceId = serviceId;
    if (rowData) {
      dispatch(updateServiceFaqs({ id: rowData?.id, userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Service FAQ has been updated successfully !.",
              status: "success",
            });
            setOpenModal(false);
            setRowData(null);
            dispatch(getAllServiceFAQS(serviceId));
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
            description: "Failed to update service FAQ.",
            status: "error",
          });
        });
    } else {
      dispatch(addServiceFAQ({ userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Service FAQ has been added successfully.",
              status: "success",
            });
            setOpenModal(false);
            dispatch(getAllServiceFAQS(serviceId));
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
      title: "Question",
      dataIndex: "question",
      render: (value, record) => <p className="font-medium">{value}</p>,
    },
    {
      title: "Answer",
      dataIndex: "answer",
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
        <Button onClick={() => setOpenModal(true)}>Add faq</Button>
      </div>
    );
  }, [search]);

  return (
    <>
      <h2 className="text-lg font-semibold">Service FAQ</h2>
      <Table
        columns={dummyColumns}
        dataSource={filteredData}
        topContent={topContent}
        className="w-full"
      />
      <Modal
        title={rowData ? "Update service FAQ's" : "Create service FAQ's"}
        open={openModal}
        width={"60%"}
        onCancel={() => setOpenModal(false)}
        onOk={handleSubmit(onSubmit)}
      >
        <form
          className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-auto px-2 py-2.5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Slug */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Question</label>
            <Controller
              name="question"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.question && (
              <p className="text-red-600 text-sm">{errors.question.message}</p>
            )}
          </div>

          {/* Full Description */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Answer</label>
            <Controller
              name="answer"
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
                      {error.answer.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>

          <Controller
            name="displayStatus"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={(val) => field.onChange(Number(val))}
                options={[
                  { label: "Inactive", value: 0 },
                  { label: "Active", value: 1 },
                ]}
              />
            )}
          />

          <Controller
            name="displayOrder"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
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
            dangerouslySetInnerHTML={{ __html: rowData?.answer }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default ServiceFAQS;

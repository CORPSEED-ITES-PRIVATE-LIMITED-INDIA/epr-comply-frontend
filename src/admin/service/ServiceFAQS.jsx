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
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import TextEditor from "../../components/TextEditor";

const ServiceFAQS = () => {
  const { userId, serviceId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.service.serviceFaqsList);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [descModal, setDescModal] = useState(false);
  const initialForm = {
    question: "",
    answer: "",
    displayOrder: 0,
    displayStatus: 1,
  };
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    dispatch(getAllServiceFAQS(serviceId));
  }, [dispatch, serviceId]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data?.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, data]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) newErrors.question = "Question is required";

    if (!formData.answer.trim()) newErrors.answer = "Answer is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    setRowData(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      displayOrder: Number(item.displayOrder || 0),
      displayStatus: Number(item.displayStatus || 1),
    });
    setOpenModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = { ...formData, serviceId };
    if (rowData) {
      dispatch(updateServiceFaqs({ id: rowData?.id, userId, data: payload }))
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
      dispatch(addServiceFAQ({ userId, data: payload }))
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
      {!openModal ? (
        <div className="max-w-6xl">
          <h2 className="text-lg font-semibold">Service FAQ</h2>
          <Table
            columns={dummyColumns}
            dataSource={filteredData}
            topContent={topContent}
            className="max-w-full"
            scroll={{ y: "80vh", x: 1300 }}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Button
              icon={<ArrowLeft className="h-4 w-4 text-gray-800 font-medium" />}
              variant="text"
              size="small"
              onClick={() => setOpenModal(false)}
            />
            <h2 className="text-lg font-semibold">
              {rowData ? "Update service faq's" : "Create service faq's"}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-6 mb-6 px-4 py-4"
          >
            {/* Question */}
            <div className="col-span-1">
              <label>
                Question <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.question}
                onChange={(e) => handleChange("question", e.target.value)}
              />
              {errors.question && (
                <p className="text-red-600 text-sm">{errors.question}</p>
              )}
            </div>

            {/* Answer */}
            <div className="col-span-2">
              <label>
                Answer <span className="text-red-500">*</span>
              </label>
              <TextEditor
                data={formData.answer}
                onChange={(editorData) => handleChange("answer", editorData)}
              />
              {errors.answer && (
                <p className="text-red-600 text-sm">{errors.answer}</p>
              )}
            </div>

            {/* Display Status */}
            <div>
              <label>Display Status</label>
              <Select
                value={formData.displayStatus}
                onChange={(val) => handleChange("displayStatus", Number(val))}
                options={[
                  { label: "Inactive", value: 0 },
                  { label: "Active", value: 1 },
                ]}
              />
            </div>

            {/* Display Order */}
            <div>
              <label>Display Order</label>
              <Input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  handleChange("displayOrder", Number(e.target.value))
                }
              />
            </div>

            <div className="col-span-2 flex justify-between w-full">
              <button
                className="px-6 py-2 rounded-md cursor-pointer"
                onClick={() => {
                  setOpenModal(false);
                  setFormData(initialData);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        </>
      )}

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
            className="tiptap-render prose prose-lg"
            dangerouslySetInnerHTML={{ __html: rowData?.answer }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default ServiceFAQS;

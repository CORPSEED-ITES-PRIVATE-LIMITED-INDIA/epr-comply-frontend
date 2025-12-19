import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
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
import Dropdown from "../../components/Dropdown";
import PopConfirm from "../../components/PopConfirm";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import TextEditor from "../../components/TextEditor";
import {
    addBlogFAQS,
  deleteBlogFAQ,
  getBlogFaqsList,
  updateBlogFAQS,
} from "../../toolkit/slices/blogSlice";

const BlogFAQS = () => {
  const { userId, blogId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.blogs.blogFaqList);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [descModal, setDescModal] = useState(false);
  const initialForm = {
    title: "",
    description: "",
    displayStatus: 1,
  };
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    dispatch(getBlogFaqsList(blogId));
  }, [dispatch, blogId]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data?.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (rowData) => {
    dispatch(deleteBlogFAQ({ faqId: rowData?.id, blogId, userId }))
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "Description has been deleted successfully !.",
            status: "success",
          });
          dispatch(getBlogFaqsList(blogId));
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
      title: item.title,
      description: item.description,
      displayStatus: Number(item.displayStatus || 1),
    });
    setOpenModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = { ...formData };
    if (rowData) {
      dispatch(
        updateBlogFAQS({ faqId: rowData?.id, blogId, userId, data: payload })
      )
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Blog FAQ has been updated successfully !.",
              status: "success",
            });
            setOpenModal(false);
            setRowData(null);
            dispatch(getBlogFaqsList(blogId));
            setFormData(initialForm);
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
      dispatch(addBlogFAQS({ blogId,userId, data: payload }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Blog FAQ has been added successfully.",
              status: "success",
            });
            setOpenModal(false);
            dispatch(getBlogFaqsList(blogId));
            setFormData(initialForm);
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
        <Button onClick={() => setOpenModal(true)}>Add faq</Button>
      </div>
    );
  }, [search]);

  return (
    <>
      {!openModal ? (
        <>
          <h2 className="text-lg font-semibold">Blog FAQ</h2>
          <Table
            columns={dummyColumns}
            dataSource={filteredData}
            topContent={topContent}
            className="w-full"
            scroll={{ y: "80vh", x: 1300 }}
          />
        </>
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
            <div className="col-span-2">
              <label>
                Question <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Answer */}
            <div className="col-span-2">
              <label>
                Description <span className="text-red-500">*</span>
              </label>
              <TextEditor
                data={formData.description}
                onChange={(prev, editor) =>
                  handleChange("description", editor.getData())
                }
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
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
            className="prose prose-lg"
            dangerouslySetInnerHTML={{ __html: rowData?.description }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default BlogFAQS;

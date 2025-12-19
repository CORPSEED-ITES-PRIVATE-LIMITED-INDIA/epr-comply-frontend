import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  addService,
  deleteSubCategory,
  getAllCategories,
  getAllServices,
  getAllSubCategoriesByCategoryId,
  getServiceListBySubCategoryId,
  updateService,
} from "../../toolkit/slices/serviceSlice";
import { Link, useParams } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import dayjs from "dayjs";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Dropdown from "../../components/Dropdown";
import PopConfirm from "../../components/PopConfirm";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import FileUploader from "../../components/FileUploader";
import TextEditor from "../../components/TextEditor";
import { generateSlug } from "../../navData";

const Services = () => {
  const { userId, categoryId, subcategoryId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.service.allServiceList);
  const categoryList = useSelector((state) => state.service.categoryList);
  const subcategoryList = useSelector((state) => state.service.subcategoryList);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [rowData, setRowData] = useState(null);
  const [descModal, setDescModal] = useState(false);
  const [errors, setErrors] = useState({});
  const initialData = {
    title: "",
    slug: "",
    categoryId: 0,
    subcategoryId: 0,
    shortDescription: "",
    fullDescription: "",
    bannerImage: "",
    thumbnail: "",
    videoUrl: "",
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    displayStatus: 0,
    showHomeStatus: 0,
  };
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    dispatch(getAllServices(subcategoryId));
    dispatch(getAllCategories());
  }, [dispatch, subcategoryId]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data?.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };

      // auto-generate slug when title changes
      if (key === "title") {
        updated.slug = generateSlug(value);
      }

      return updated;
    });

    // clear error when user types
    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.subcategoryId) {
      newErrors.subcategoryId = "Subcategory is required";
    }

    if (!formData.fullDescription || formData.fullDescription.trim() === "") {
      newErrors.fullDescription = "Full description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (rowData) => {
    dispatch(deleteSubCategory({ id: rowData?.id, userId }))
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "Category has been deleted successfully !.",
            status: "success",
          });
          dispatch(getServiceListBySubCategoryId(subcategoryId));
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
    setFormData({
      title: item?.title,
      slug: item?.slug,
      shortDescription: item?.shortDescription,
      fullDescription: item?.fullDescription,
      bannerImage: item?.bannerImage,
      thumbnail: item?.thumbnail,
      videoUrl: item?.videoUrl,
      metaTitle: item?.metaTitle,
      metaKeyword: item?.metaKeyword,
      metaDescription: item?.metaDescription,
      displayStatus: item?.displayStatus,
      showHomeStatus: item?.showHomeStatus,
    });
    setRowData(item);
    setOpenModal(true);
  };

  const onSubmit = (data) => {
    if (!validateForm()) return;
    if (rowData) {
      dispatch(updateService({ id: rowData?.id, userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Service has been updated successfully !.",
              status: "success",
            });
            setOpenModal(false);
            setRowData(null);
            dispatch(getServiceListBySubCategoryId(subcategoryId));
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
      dispatch(addService({ userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Service has been added successfully.",
              status: "success",
            });
            setOpenModal(false);
            dispatch(getServiceListBySubCategoryId(subcategoryId));
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
      title: "Title",
      dataIndex: "title",
      render: (value, record) => <p className="font-medium">{value}</p>,
    },
    {
      title: "Meta title",
      dataIndex: "metaTitle",
      render: (value) => <p className="text-wrap">{value}</p>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Post date",
      dataIndex: "postDate",
      render: (value) => <p>{dayjs(value).format("DD-MM-YYYY")}</p>,
    },
    {
      title: "Meta description",
      dataIndex: "metaDescription",
      render: (value) => <p className="text-wrap">{value}</p>,
    },
    {
      title: "Meta keywords",
      dataIndex: "metaKeyword",
      render: (value) => <p className="text-wrap">{value}</p>,
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
              {
                key: 1,
                label: (
                  <Link to={`${record?.id}/detail`}>Add table of content</Link>
                ),
              },
              { key: 2, label: <Link to={`${record?.id}/faqs`}>FAQ's</Link> },
              { key: 3, label: "edit", onClick: () => handleEdit(record) },
              {
                key: 4,
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
        <Button onClick={() => setOpenModal(true)}>Add service</Button>
      </div>
    );
  }, [search]);

  return (
    <>
      {!openModal ? (
        <>
          <h2 className="text-lg font-semibold">Service list</h2>
          <Table
            columns={dummyColumns}
            dataSource={filteredData}
            topContent={topContent}
            scroll={{ y: "78vh", x: 1200 }}
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
              {rowData ? "Update service" : "Create service"}
            </h2>
          </div>
          <form
            className="grid grid-cols-2 gap-6 max-h-[80vh] overflow-auto px-2 py-2.5 max-w-full"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(formData);
            }}
          >
            {/* Title */}
            <div className="flex flex-col">
              <label className="mb-1">Title</label>
              <Input
                value={formData.title}
                placeholder="Enter title"
                onChange={(e) => handleChange("title", e.target.value)}
              />
              {errors.title && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.title}
                </span>
              )}
            </div>

            {/* Slug */}
            <div className="flex flex-col">
              <label className="mb-1">Slug</label>
              <Input
                value={formData.slug}
                placeholder="Enter slug"
                onChange={(e) => handleChange("slug", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="mb-1">Category</label>
              <Select
                value={formData.categoryId}
                options={categoryList?.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                placeholder="Select category"
                onChange={(value) => {
                  dispatch(getAllSubCategoriesByCategoryId(value));
                  handleChange("categoryId", value);
                }}
              />
              {errors.categoryId && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.categoryId}
                </span>
              )}
            </div>

            {/* Subcategory */}
            <div className="flex flex-col">
              <label className="mb-1">Subcategory</label>
              <Select
                value={formData.subcategoryId}
                options={subcategoryList?.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                placeholder="Select subcategory"
                onChange={(value) => handleChange("subcategoryId", value)}
              />
              {errors.subcategoryId && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.subcategoryId}
                </span>
              )}
            </div>

            {/* Short Description */}
            <div className="flex flex-col col-span-2">
              <label className="mb-1">Short Description</label>
              <TextEditor
                data={formData.shortDescription}
                onChange={(prev, editor) => {
                  handleChange("shortDescription", editor.getData());
                }}
              />
            </div>

            {/* Full Description */}
            <div className="flex flex-col col-span-2">
              <label className="mb-1">Full Description</label>
              <TextEditor
                data={formData.fullDescription}
                onChange={(prev, editor) => {
                  handleChange("fullDescription", editor.getData());
                }}
              />
              {errors.fullDescription && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.fullDescription}
                </span>
              )}
            </div>

            {/* Banner Image */}
            <div className="flex flex-col">
              <label className="mb-1">Banner Image</label>
              <FileUploader
                value={formData.bannerImage}
                onChange={(file) => handleChange("bannerImage", file)}
              />
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col">
              <label className="mb-1">Thumbnail</label>
              <FileUploader
                value={formData.thumbnail}
                onChange={(file) => handleChange("thumbnail", file)}
              />
            </div>

            {/* Video URL */}
            <div className="flex flex-col col-span-2">
              <label className="mb-1">Video URL</label>
              <Input
                value={formData.videoUrl}
                placeholder="Enter video URL"
                onChange={(e) => handleChange("videoUrl", e.target.value)}
              />
            </div>

            {/* Display Status */}
            <div className="flex flex-col">
              <label className="mb-1">Display Status</label>
              <Select
                value={formData.displayStatus}
                options={[
                  { label: "Inactive", value: 0 },
                  { label: "Active", value: 1 },
                ]}
                onChange={(value) => handleChange("displayStatus", value)}
              />
            </div>

            {/* Show Home Status */}
            <div className="flex flex-col">
              <label className="mb-1">Show on Home</label>
              <Select
                value={formData.showHomeStatus}
                options={[
                  { label: "No", value: 0 },
                  { label: "Yes", value: 1 },
                ]}
                onChange={(value) => handleChange("showHomeStatus", value)}
              />
            </div>

            {/* Meta Title */}
            <div className="flex flex-col col-span-2">
              <label className="mb-1">Meta Title</label>
              <Input
                value={formData.metaTitle}
                placeholder="Meta title"
                onChange={(e) => handleChange("metaTitle", e.target.value)}
              />
            </div>

            {/* Meta Keyword */}
            <div className="flex flex-col col-span-2">
              <label className="mb-1">Meta Keyword</label>
              <Input
                value={formData.metaKeyword}
                placeholder="Meta keywords"
                onChange={(e) => handleChange("metaKeyword", e.target.value)}
              />
            </div>

            {/* Meta Description */}
            <div className="flex flex-col col-span-2">
              <label className="mb-1">Meta Description</label>
              <Input
                as="textarea"
                rows={3}
                value={formData.metaDescription}
                placeholder="Meta description"
                onChange={(e) =>
                  handleChange("metaDescription", e.target.value)
                }
              />
            </div>

            {/* Submit */}
            <div className="col-span-2 flex justify-between">
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
            dangerouslySetInnerHTML={{ __html: rowData?.fullDescription }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default Services;

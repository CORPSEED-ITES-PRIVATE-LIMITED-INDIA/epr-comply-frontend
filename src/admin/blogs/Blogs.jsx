import { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import dayjs from "dayjs";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Dropdown from "../../components/Dropdown";
import PopConfirm from "../../components/PopConfirm";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import {
  addBlog,
  deleteBlog,
  getBlogList,
  updateBlog,
} from "../../toolkit/slices/blogSlice";
import {
  getAllCategories,
  getAllSubCategoriesByCategoryId,
  getServiceListBySubCategoryId,
} from "../../toolkit/slices/serviceSlice";
import TextEditor from "../../components/TextEditor";
import FileUploader from "../../components/FileUploader";
import { generateSlug } from "../../navData";

const Required = () => <span className="text-red-500 ml-1">*</span>;

const Blogs = () => {
  const { userId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.blogs.blogList);
  const categoryList = useSelector((state) => state.service.categoryList);
  const subCategoryList = useSelector((state) => state.service.subcategoryList);
  const serviceList = useSelector((state) => state.service.serviceList);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [descModal, setDescModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [rowData, setRowData] = useState(null);
  const initialForm = {
    title: "",
    slug: "",
    image: null,
    summary: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    serviceIds: [],
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    displayStatus: 1,
    searchKeyword: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getBlogList(userId));
    dispatch(getAllCategories());
  }, [dispatch, userId]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data?.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "title") {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (!formData.slug.trim()) newErrors.slug = "Slug is required";

    if (!formData.categoryId) newErrors.categoryId = "Category is required";

    if (!formData.subcategoryId)
      newErrors.subcategoryId = "Subcategory is required";

    if (!formData.description || formData.description.trim() === "")
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (rowData) => {
    dispatch(deleteBlog({ id: rowData?.id, userId }))
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "Blog has been deleted successfully !.",
            status: "success",
          });
          dispatch(getBlogList(userId));
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

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      slug: item.slug,
      image: item.image,
      summary: item.summary,
      description: item.description,
      metaTitle: item.metaTitle,
      metaKeyword: item.metaKeyword,
      metaDescription: item.metaDescription,
      displayStatus: item.displayStatus,
      searchKeyword: item.searchKeyword,
      categoryId: item.categoryId,
      subcategoryId: item.subcategoryId,
      serviceIds: item.serviceIds || [],
    });
    setRowData(item);
    setOpenModal(true);
  };

  const onSubmit = (data) => {
    if (!validateForm()) return;
    if (rowData) {
      dispatch(updateBlog({ id: rowData?.id, userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Service has been updated successfully !.",
              status: "success",
            });
            setFormData(initialForm);
            setOpenModal(false);
            setRowData(null);
            dispatch(getBlogList(userId));
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
            description: "Failed to update blog.",
            status: "error",
          });
        });
    } else {
      dispatch(addBlog({ userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Blog has been added successfully.",
              status: "success",
            });
            setFormData(initialForm);
            setOpenModal(false);
            dispatch(getBlogList(userId));
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
            description: "Failed to add blogs.",
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
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Post date",
      dataIndex: "postDate",
      render: (value) => <p>{dayjs(value).format("DD-MM-YYYY")}</p>,
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
              { key: 1, label: <Link to={`${record.id}/blogFaq`}>FAQ's</Link> },
              { key: 2, label: "edit", onClick: () => handleEdit(record) },
              {
                key: 3,
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
        <Button onClick={() => setOpenModal(true)}>Add blog</Button>
      </div>
    );
  }, [search]);

  return (
    <>
      {!openModal ? (
        <>
          <h2 className="text-lg font-semibold">Blogs list</h2>
          <Table
            columns={dummyColumns}
            dataSource={filteredData}
            topContent={topContent}
            className="w-full"
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
              {rowData ? "Update blog" : "Create blog"}
            </h2>
          </div>
          <form
            className="grid grid-cols-2 gap-6 max-h-[80vh] overflow-auto px-2 py-2.5"
            onSubmit={() => onSubmit(formData)}
          >
            {/* Title */}
            <div className="flex flex-col">
              <label className="mb-1">
                Title <Required />
              </label>
              <Input
                value={formData.title}
                placeholder="Enter title"
                onChange={(e) => handleChange("title", e.target.value)}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div className="flex flex-col">
              <label className="mb-1">
                Slug <Required />
              </label>
              <Input
                value={formData.slug}
                placeholder="Enter slug"
                onChange={(e) => handleChange("slug", e.target.value)}
              />
              {errors.slug && (
                <p className="text-red-600 text-sm">{errors.slug}</p>
              )}
            </div>

            {/* Image */}
            <div className="flex flex-col">
              <label className="mb-1">Image</label>
              <FileUploader
                value={formData.image}
                onChange={(file) => handleChange("image", file)}
              />
            </div>

            {/* Summary */}
            <div className="flex flex-col">
              <label className="mb-1">Summary</label>
              <Input
                as="textarea"
                rows={3}
                value={formData.summary}
                placeholder="Write summary"
                onChange={(e) => handleChange("summary", e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col col-span-2">
              <label className="mb-1">
                Description <Required />
              </label>
              <TextEditor
                data={formData.description}
                onChange={(prev, editor) => {
                  handleChange("description", editor.getData());
                }}
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Category ID */}
            <div className="flex flex-col">
              <label className="mb-1">
                Category <Required />
              </label>
              <Select
                value={formData.categoryId}
                options={categoryList?.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
                onChange={(value) => {
                  handleChange("categoryId", value);
                  dispatch(getAllSubCategoriesByCategoryId(value));
                }}
              />
              {errors.categoryId && (
                <p className="text-red-600 text-sm">{errors.categoryId}</p>
              )}
            </div>

            {/* Subcategory ID */}
            <div className="flex flex-col">
              <label className="mb-1">
                Subcategory <Required />
              </label>
              <Select
                value={formData.subcategoryId}
                options={subCategoryList?.map((sc) => ({
                  label: sc.name,
                  value: sc.id,
                }))}
                onChange={(value) => {
                  handleChange("subcategoryId", value);
                  dispatch(getServiceListBySubCategoryId(value));
                }}
              />
              {errors.subcategoryId && (
                <p className="text-red-600 text-sm">{errors.subcategoryId}</p>
              )}
            </div>

            {/* Service IDs (MULTI SELECT) */}
            <div className="flex flex-col">
              <label className="mb-1">Services</label>
              <Select
                multiple
                value={formData.serviceIds}
                options={serviceList?.map((s) => ({
                  label: s.title,
                  value: s.id,
                }))}
                onChange={(value) => handleChange("serviceIds", value)}
              />
            </div>

            {/* Meta Title */}
            <div className="flex flex-col">
              <label className="mb-1">Meta Title</label>
              <Input
                placeholder="Meta title"
                value={formData?.metaTitle}
                onChange={(e) => handleChange("metaTitle", e.target.value)}
              />
            </div>

            {/* Meta Keyword */}
            <div className="flex flex-col">
              <label className="mb-1">Meta Keyword</label>
              <Input
                value={formData?.metaKeyword}
                onChange={(e) => handleChange("metaKeyword", e.target.value)}
                placeholder="Meta keyword"
              />
            </div>

            {/* Meta Description */}
            <div className="flex flex-col">
              <label className="mb-1">Meta Description</label>

              <Input
                as="textarea"
                rows={3}
                placeholder="Meta description"
                value={formData?.metaDescription}
                onChange={(e) =>
                  handleChange("metaDescription", e.target.value)
                }
              />
            </div>

            {/* Display Status */}
            <div className="flex flex-col">
              <label className="mb-1">Display Status</label>

              <Select
                options={[
                  { label: "Inactive", value: 0 },
                  { label: "Active", value: 1 },
                ]}
                value={formData?.displayStatus}
                onChange={(e) => handleChange("displayStatus", e)}
              />
            </div>

            {/* Search Keyword */}
            <div className="flex flex-col">
              <label className="mb-1">Search Keyword</label>

              <Input
                placeholder="Search keyword"
                value={formData?.searchKeyword}
                onChange={(e) => handleChange("searchKeyword", e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="col-span-2 flex justify-between">
              <button
                className="px-6 py-2 rounded-md cursor-pointer"
                onClick={() => {
                  setOpenModal(false);
                  setFormData(initialForm);
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

export default Blogs;

import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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

const blogSchema = z.object({
  title: z.string().nonempty("Title is required"),
  slug: z.string().nonempty("Slug is required"),
  image: z.string().optional(),
  // image: z.string().nonempty("Image is required"),
  summary: z.string().nonempty("Summary is required"),
  description: z.string().nonempty("Description is required"),
  metaTitle: z.string().optional(),
  metaKeyword: z.string().optional(),
  metaDescription: z.string().optional(),
  displayStatus: z.number(),
  searchKeyword: z.string().optional(),
  categoryId: z.number(),
  subcategoryId: z.number(),
  serviceIds: z.array(z.number()).optional(),
});

const Blogs = () => {
  const { userId, categoryId } = useParams();
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

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      image: "",
      summary: "",
      description: "",
      metaTitle: "",
      metaKeyword: "",
      metaDescription: "",
      displayStatus: 0,
      searchKeyword: "",
      categoryId: "",
      subcategoryId: "",
      serviceIds: [],
    },
  });

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
    reset({
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
    if (rowData) {
      dispatch(updateBlog({ id: rowData?.id, userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Service has been updated successfully !.",
              status: "success",
            });
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
        <Button onClick={() => setOpenModal(true)}>Add blog</Button>
      </div>
    );
  }, [search]);

  return (
    <>
      <h2 className="text-lg font-semibold">Blogs list</h2>
      <Table
        columns={dummyColumns}
        dataSource={filteredData}
        topContent={topContent}
        className="w-full"
      />
      <Modal
        title={rowData ? "Update blogs" : "Create blogs"}
        open={openModal}
        width={"60%"}
        onCancel={() => setOpenModal(false)}
        onOk={handleSubmit(onSubmit)}
      >
        <form className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-auto px-2 py-2.5">
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

          {/* Slug */}
          <div className="flex flex-col">
            <label className="mb-1">Slug</label>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter slug" />
              )}
            />
            {errors.slug && (
              <p className="text-red-600 text-sm">{errors.slug.message}</p>
            )}
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label className="mb-1">Image</label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <FileUploader
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                />
              )}
            />
            {errors.image && (
              <p className="text-red-600 text-sm">{errors.image.message}</p>
            )}
          </div>

          {/* Summary */}
          <div className="flex flex-col">
            <label className="mb-1">Summary</label>
            <Controller
              name="summary"
              control={control}
              render={({ field }) => (
                <Input
                  as="textarea"
                  rows={3}
                  {...field}
                  placeholder="Write summary"
                />
              )}
            />
            {errors.summary && (
              <p className="text-red-600 text-sm">{errors.summary.message}</p>
            )}
          </div>

          {/* Description */}
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

          {/* Category ID */}
          <div className="flex flex-col">
            <label className="mb-1">Category</label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  options={categoryList?.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  onChange={(e) => {
                    field.onChange(e);
                    dispatch(getAllSubCategoriesByCategoryId(e));
                  }}
                />
              )}
            />
            {errors.categoryId && (
              <p className="text-red-600 text-sm">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Subcategory ID */}
          <div className="flex flex-col">
            <label className="mb-1">Subcategory</label>
            <Controller
              name="subcategoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  options={subCategoryList?.map((sc) => ({
                    label: sc.name,
                    value: sc.id,
                  }))}
                  onChange={(e) => {
                    field.onChange(e);
                    dispatch(getServiceListBySubCategoryId(e));
                  }}
                />
              )}
            />
            {errors.subcategoryId && (
              <p className="text-red-600 text-sm">
                {errors.subcategoryId.message}
              </p>
            )}
          </div>

          {/* Service IDs (MULTI SELECT) */}
          <div className="flex flex-col">
            <label className="mb-1">Services</label>
            <Controller
              name="serviceIds"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  multiple
                  options={serviceList?.map((s) => ({
                    label: s.title,
                    value: s.id,
                  }))}
                  onChange={(e) => field.onChange(e)}
                />
              )}
            />
          </div>

          {/* Meta Title */}
          <div className="flex flex-col">
            <label className="mb-1">Meta Title</label>
            <Controller
              name="metaTitle"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Meta title" />
              )}
            />
          </div>

          {/* Meta Keyword */}
          <div className="flex flex-col">
            <label className="mb-1">Meta Keyword</label>
            <Controller
              name="metaKeyword"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Meta keyword" />
              )}
            />
          </div>

          {/* Meta Description */}
          <div className="flex flex-col">
            <label className="mb-1">Meta Description</label>
            <Controller
              name="metaDescription"
              control={control}
              render={({ field }) => (
                <Input
                  as="textarea"
                  rows={3}
                  {...field}
                  placeholder="Meta description"
                />
              )}
            />
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

          {/* Search Keyword */}
          <div className="flex flex-col">
            <label className="mb-1">Search Keyword</label>
            <Controller
              name="searchKeyword"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Search keyword" />
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

export default Blogs;

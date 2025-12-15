import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Controller, useForm } from "react-hook-form";
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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Dropdown from "../../components/Dropdown";
import PopConfirm from "../../components/PopConfirm";
import { EllipsisVertical } from "lucide-react";
import FileUploader from "../../components/FileUploader";
import TextEditor from "../../components/TextEditor";

const serviceSchema = z.object({
  title: z.string().nonempty("Title is required"),
  slug: z.string().nonempty("Slug is required"),
  categoryId: z.number(),
  subcategoryId: z.number(),
  shortDescription: z.string().nonempty("Short description is required"),
  fullDescription: z.string().nonempty("Full description is required"),
  bannerImage: z.string().nonempty("Banner image is required"),
  thumbnail: z.string().nonempty("Thumbnail is required"),
  videoUrl: z.string().optional(),
  metaTitle: z.string().optional(),
  metaKeyword: z.string().optional(),
  metaDescription: z.string().optional(),
  displayStatus: z.number(),
  showHomeStatus: z.number(),
});

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

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
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
    },
  });

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
    reset({
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
      <h2 className="text-lg font-semibold">Service list</h2>
      <Table
        columns={dummyColumns}
        dataSource={filteredData}
        topContent={topContent}
        className="w-full"
        scroll={{ y: "78vh" }}
      />
      <Modal
        title={rowData ? "Update service" : "Create service"}
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

          {/* category */}
          <div className="flex flex-col">
            <label className="mb-1">Category</label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  options={
                    categoryList?.length > 0
                      ? categoryList?.map((item) => ({
                          label: item?.name,
                          value: item?.id,
                        }))
                      : []
                  }
                  placeholder="Select category"
                  onChange={(e) => {
                    dispatch(getAllSubCategoriesByCategoryId(e));
                    field.onChange(e);
                  }}
                />
              )}
            />
            {errors.slug && (
              <p className="text-red-600 text-sm">{errors.slug.message}</p>
            )}
          </div>

          {/* sub category */}
          <div className="flex flex-col">
            <label className="mb-1">Subcategory</label>
            <Controller
              name="subcategoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  options={
                    subcategoryList?.length > 0
                      ? subcategoryList?.map((item) => ({
                          label: item?.name,
                          value: item?.id,
                        }))
                      : []
                  }
                  placeholder="Select subcategory"
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
              )}
            />
            {errors.slug && (
              <p className="text-red-600 text-sm">{errors.slug.message}</p>
            )}
          </div>

          {/* Short Description */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Short Description</label>
            <Controller
              name="shortDescription"
              control={control}
              render={({ field }) => (
                <Input
                  as="textarea"
                  rows={3}
                  {...field}
                  placeholder="Short description"
                />
              )}
            />
            {errors.shortDescription && (
              <p className="text-red-600 text-sm">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          {/* Full Description */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Full Description</label>
            <Controller
              name="fullDescription"
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
            {errors.fullDescription && (
              <p className="text-red-600 text-sm">
                {errors.fullDescription.message}
              </p>
            )}
          </div>

          {/* Banner Image */}
          <div className="flex flex-col">
            <label className="mb-1">Banner Image</label>
            <Controller
              name="bannerImage"
              control={control}
              render={({ field }) => (
                <FileUploader
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                />
              )}
            />
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col">
            <label className="mb-1">Thumbnail</label>
            <Controller
              name="thumbnail"
              control={control}
              render={({ field }) => (
                <FileUploader
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                />
              )}
            />
          </div>

          {/* Video URL */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Video URL</label>
            <Controller
              name="videoUrl"
              control={control}
              render={({ field }) => (
                <FileUploader
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
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

          {/* Show Home Status */}
          <div className="flex flex-col">
            <label className="mb-1">Show on Home</label>
            <Controller
              name="showHomeStatus"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: "No", value: 0 },
                    { label: "Yes", value: 1 },
                  ]}
                />
              )}
            />
          </div>

          {/* Meta Title */}
          <div className="flex flex-col col-span-2">
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
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Meta Keyword</label>
            <Controller
              name="metaKeyword"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Meta keywords" />
              )}
            />
          </div>

          {/* Meta Description */}
          <div className="flex flex-col col-span-2">
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
            dangerouslySetInnerHTML={{ __html: rowData?.fullDescription }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default Services;

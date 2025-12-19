import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategoriesByCategoryId,
  updateSubCategory,
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

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  slug: z.string().nonempty("Slug is required"),
  displayStatus: z.number().min(0, "Display status is required"),
  showHomeStatus: z.number().min(0, "Show on home is required"),
  metaTitle: z.string().optional(),
  metaKeyword: z.string().optional(),
  metaDescription: z.string().optional(),
});

const Category = () => {
  const { userId, categoryId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.service.subcategoryList);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    dispatch(getAllSubCategoriesByCategoryId(categoryId));
  }, [dispatch, categoryId]);

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
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      displayStatus: 0,
      showHomeStatus: 0,
      metaTitle: "",
      metaKeyword: "",
      metaDescription: "",
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
          dispatch(getAllSubCategoriesByCategoryId(categoryId));
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

  const handleEdit = (rowItem) => {
    reset({
      name: rowItem?.name,
      slug: rowItem?.slug,
      displayStatus: rowItem?.displayStatus,
      showHomeStatus: rowItem?.showHomeStatus,
      metaTitle: rowItem?.metaTitle,
      metaKeyword: rowItem?.metaKeyword,
      metaDescription: rowItem?.metaDescription,
    });
    setRowData(rowItem);
    setOpenModal(true);
  };

  const onSubmit = (data) => {
    data.categoryId = categoryId;
    if (rowData) {
      dispatch(updateSubCategory({ id: rowData?.id, userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Subcategory has been updated successfully !.",
              status: "success",
            });
            reset()
            setOpenModal(false);
            setRowData(null);
            dispatch(getAllSubCategoriesByCategoryId(categoryId));
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
            description: "Failed to update subcategory.",
            status: "error",
          });
        });
    } else {
      dispatch(addSubCategory({ userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Subcategory has been added successfully.",
              status: "success",
            });
            reset()
            setOpenModal(false);
            dispatch(getAllSubCategoriesByCategoryId(categoryId));
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
            description: "Failed to add subcategory.",
            status: "error",
          });
        });
    }
  };

  const dummyColumns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (value, record) => (
        <p className="text-wrap">{value}</p>
      ),
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
      title: "Actions",
      dataIndex: "actions",
      render: (value, record, rowIndex) => {
        const isOpen = openDropdowns[record.id] || false;
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
        <Button onClick={() => setOpenModal(true)}>Add subcategory</Button>
      </div>
    );
  }, [search]);

  return (
    <>
      <h2 className="text-lg font-semibold">Subcategories list</h2>
      <Table
        columns={dummyColumns}
        dataSource={filteredData}
        topContent={topContent}
        className="w-full"
      />
      <Modal
        title={rowData ? "Update subcategory" : "Create subcategory"}
        open={openModal}
        width={"60%"}
        onCancel={() => setOpenModal(false)}
        onOk={handleSubmit(onSubmit)}
      >
        <form className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-auto px-2 py-2.5">
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1">Name</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input {...field} placeholder="Enter name" />
              )}
            />
            {errors.name && <p className="text-red-600 text-sm">Required</p>}
          </div>

          {/* Slug */}
          <div className="flex flex-col">
            <label className="mb-1">Slug</label>
            <Controller
              name="slug"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input {...field} placeholder="Enter slug" />
              )}
            />
            {errors.slug && <p className="text-red-600 text-sm">Required</p>}
          </div>

          {/* Display Status */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Display Status</label>
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
                  placeholder="Select status"
                />
              )}
            />
          </div>

          {/* Show on Home */}
          <div className="flex flex-col">
            <label className="mb-1">Show on Home</label>
            <Controller
              name="showHomeStatus"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: "No", value: 0 },
                    { label: "Yes", value: 1 },
                  ]}
                  placeholder="Select option"
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
                <Input {...field} placeholder="Meta Title" />
              )}
            />
          </div>

          {/* Meta Keywords */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Meta Keywords</label>
            <Controller
              name="metaKeyword"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Meta Keywords" />
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
                  {...field}
                  as="textarea"
                  rows={3}
                  placeholder="Meta Description"
                />
              )}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Category;

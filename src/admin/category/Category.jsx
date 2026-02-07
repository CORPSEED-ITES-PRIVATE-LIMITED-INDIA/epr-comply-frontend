import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategories,
  deleteCategories,
  getAllCategories,
  updateCategories,
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

/* =====================
   VALIDATION SCHEMA
===================== */
const categorySchema = z.object({
  name: z.string().nonempty("Name is required"),
  slug: z.string().nonempty("Slug is required"),
  icon: z.string().optional(),

  displayStatus: z.number(),
  showHomeStatus: z.number(),

  displayOrder: z
    .number({
      required_error: "Display order is required",
      invalid_type_error: "Display order must be a number",
    })
    .min(0, "Display order cannot be negative"),

  metaTitle: z.string().optional(),
  metaKeyword: z.string().optional(),
  metaDescription: z.string().optional(),
  searchKeywords: z.string().optional(),
});

const Category = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const data = useSelector((state) => state.service.categoryList);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [rowData, setRowData] = useState(null);

  /* =====================
     FETCH
  ===================== */
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  /* =====================
     SORT + SEARCH
  ===================== */
  const filteredData = useMemo(() => {
    const base = search
      ? data?.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : data;

    return [...(base || [])].sort(
      (a, b) =>
        (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
    );
  }, [search, data]);

  /* =====================
     FORM
  ===================== */
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
      displayStatus: 0,
      showHomeStatus: 0,
      displayOrder: "",
      metaTitle: "",
      metaKeyword: "",
      metaDescription: "",
      searchKeywords: "",
    },
  });

  /* =====================
     ACTIONS
  ===================== */
  const handleEdit = (row) => {
    reset({
      name: row.name,
      slug: row.slug,
      icon: row.icon,
      displayStatus: row.displayStatus,
      showHomeStatus: row.showHomeStatus,
      displayOrder:
      row.displayOrder === 0 || row.displayOrder == null
        ? ""
        : row.displayOrder,
      metaTitle: row.metaTitle,
      metaKeyword: row.metaKeyword,
      metaDescription: row.metaDescription,
      searchKeywords: row.searchKeywords,
    });
    setRowData(row);
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    dispatch(deleteCategories({ id: row.id, userId })).then((resp) => {
      if (resp.meta.requestStatus === "fulfilled") {
        showToast({
          title: "Success",
          description: "Category deleted successfully",
          status: "success",
        });
        dispatch(getAllCategories());
      }
    });
  };

  const onSubmit = (formData) => {
    const action = rowData
      ? updateCategories({ id: rowData.id, userId, data: formData })
      : addCategories({ userId, data: formData });

    dispatch(action).then((resp) => {
      if (resp.meta.requestStatus === "fulfilled") {
        showToast({
          title: "Success",
          description: rowData
            ? "Category updated successfully"
            : "Category added successfully",
          status: "success",
        });
        reset();
        setRowData(null);
        setOpenModal(false);
        dispatch(getAllCategories());
      }
    });
  };

  /* =====================
     TABLE COLUMNS
  ===================== */
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (v, r) => (
        <Link
          to={`${r.id}/subcategory`}
          className="font-medium text-blue-600"
        >
          {v}
        </Link>
      ),
    },
    {
      title: "Display Order",
      dataIndex: "displayOrder",
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Post Date",
      dataIndex: "postDate",
      render: (v) => dayjs(v).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Dropdown
          open={openDropdowns[record.id]}
          onOpenChange={(open) =>
            setOpenDropdowns((p) => ({ ...p, [record.id]: open }))
          }
          items={[
            { key: 1, label: "Edit", onClick: () => handleEdit(record) },
            {
              key: 2,
              label: (
                <PopConfirm
                  title="Are you sure?"
                  onConfirm={() => handleDelete(record)}
                >
                  <span className="text-red-600">Delete</span>
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
      ),
    },
  ];

  const topContent = (
    <div className="flex justify-between items-center">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        wrapperClassName="w-80"
      />
      <Button onClick={() => setOpenModal(true)}>Add Category</Button>
    </div>
  );

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Categories List</h2>

      <Table
        columns={columns}
        dataSource={filteredData}
        topContent={topContent}
      />

      <Modal
        title={rowData ? "Update Category" : "Create Category"}
        open={openModal}
        width="60%"
        onCancel={() => setOpenModal(false)}
        onOk={handleSubmit(onSubmit)}
      >
        <form className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-auto px-2 py-2.5">
          {/* Name */}
          <div>
            <label>Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.name && (
              <p className="text-red-600 text-sm">Required</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label>Slug</label>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>

          {/* Icon */}
          <div>
            <label>Icon</label>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>

          {/* Display Order – NO ARROWS */}
          <div>
            <label>Display Order</label>
            <Controller
              name="displayOrder"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter display order"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    field.onChange(v === "" ? "" : Number(v));
                  }}
                />
              )}
            />

            {errors.displayOrder && (
              <p className="text-red-600 text-sm">
                {errors.displayOrder.message}
              </p>
            )}
          </div>

          {/* Display Status */}
          <div>
            <label>Display Status</label>
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

          {/* Show Home */}
          <div>
            <label>Show on Home</label>
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

          {/* Meta fields */}
          <div className="col-span-2">
            <label>Meta Title</label>
            <Controller
              name="metaTitle"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>

          <div className="col-span-2">
            <label>Meta Keywords</label>
            <Controller
              name="metaKeyword"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>

          <div className="col-span-2">
            <label>Meta Description</label>
            <Controller
              name="metaDescription"
              control={control}
              render={({ field }) => (
                <Input as="textarea" rows={3} {...field} />
              )}
            />
          </div>

          <div className="col-span-2">
            <label>Search Keywords</label>
            <Controller
              name="searchKeywords"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Category;

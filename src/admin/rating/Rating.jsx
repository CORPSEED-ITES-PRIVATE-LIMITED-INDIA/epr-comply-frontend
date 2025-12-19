import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import Input from "../../components/Input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Dropdown from "../../components/Dropdown";
import PopConfirm from "../../components/PopConfirm";
import { EllipsisVertical } from "lucide-react";
import {
  addRating,
  deleteRating,
  getAllRating,
  updateRating,
} from "../../toolkit/slices/settingSlice";

const blogSchema = z.object({
  platform: z.string().nonempty("plateform name is required"),
  platformDisplayName: z.string().nonempty("display name is required"),
  reviewUrl: z.string().nonempty("Summary is required"),
  iconUrl: z.string().optional(),
  rating: z.number(),
  totalReviews: z.number(),
});

const Rating = () => {
  const { userId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.setting.ratingList);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    dispatch(getAllRating());
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
      platform: "",
      platformDisplayName: "",
      reviewUrl: "",
      iconUrl: "",
      rating: 0,
      totalReviews: 0,
    },
  });

  const handleDelete = (rowData) => {
    dispatch(deleteRating({ id: rowData?.id, userId }))
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "Blog has been deleted successfully !.",
            status: "success",
          });
          dispatch(getAllRating());
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
      platform: item.platform,
      platformDisplayName: item.platformDisplayName,
      reviewUrl: item.reviewUrl,
      iconUrl: item.iconUrl,
      rating: item.rating,
      totalReviews: item.totalReviews,
    });
    setRowData(item);
    setOpenModal(true);
  };

  const onSubmit = (data) => {
    if (rowData) {
      dispatch(updateRating({ id: rowData?.id, userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Service has been updated successfully !.",
              status: "success",
            });
            reset()
            setOpenModal(false);
            setRowData(null);
            dispatch(getAllRating());
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
      dispatch(addRating({ userId, data }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled") {
            showToast({
              title: "Success!",
              description: "Blog has been added successfully.",
              status: "success",
            });
            reset()
            setOpenModal(false);
            dispatch(getAllRating());
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
      title: "Plateform name",
      dataIndex: "platform",
      render: (value, record) => <p className="font-medium">{value}</p>,
    },
    {
      title: "Plateform display name",
      dataIndex: "platformDisplayName",
      render: (value, record) => <p className="font-medium">{value}</p>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (value) => <p className="text-wrap">{value}</p>,
    },
    {
      title: "Total review",
      dataIndex: "totalReviews",
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
        <Button onClick={() => setOpenModal(true)}>Add rating</Button>
      </div>
    );
  }, [search]);

  return (
    <>
      <h2 className="text-lg font-semibold">Rating list</h2>
      <Table
        columns={dummyColumns}
        dataSource={filteredData}
        topContent={topContent}
        className="w-full"
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
            <label className="mb-1">Plateform name</label>
            <Controller
              name="platform"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter name" />
              )}
            />
            {errors.platform && (
              <p className="text-red-600 text-sm">{errors.platform.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="flex flex-col">
            <label className="mb-1">Plateform display</label>
            <Controller
              name="platformDisplayName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter slug" />
              )}
            />
            {errors.platformDisplayName && (
              <p className="text-red-600 text-sm">
                {errors.platformDisplayName.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label className="mb-1">Review URL</label>
            <Controller
              name="reviewUrl"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter review URL" />
              )}
            />
            {errors.reviewUrl && (
              <p className="text-red-600 text-sm">{errors.reviewUrl.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Icon URL</label>
            <Controller
              name="iconUrl"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter review URL" />
              )}
            />
            {errors.iconUrl && (
              <p className="text-red-600 text-sm">{errors.iconUrl.message}</p>
            )}
          </div>

          {/* Summary */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1">Rating</label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  value={Number(field.value)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.rating && (
              <p className="text-red-600 text-sm">{errors.rating.message}</p>
            )}
          </div>

          <div className="flex flex-col col-span-2">
            <label className="mb-1">Total review</label>
            <Controller
              name="totalReviews"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  value={Number(field.value)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.totalReviews && (
              <p className="text-red-600 text-sm">
                {errors.totalReviews.message}
              </p>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Rating;

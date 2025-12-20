import { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import Input from "../../components/Input";
import Select from "../../components/Select";
import FileUploader from "../../components/FileUploader";
import TextEditor from "../../components/TextEditor";
import Dropdown from "../../components/Dropdown";
import PopConfirm from "../../components/PopConfirm";
import { EllipsisVertical, ArrowLeft } from "lucide-react";
import {
  addReview,
  getAllReviews,
  updateReview,
} from "../../toolkit/slices/settingSlice";
import { getAllServices } from "../../toolkit/slices/serviceSlice";

const Required = () => <span className="text-red-500 ml-1">*</span>;

const Reviews = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const reviewList = useSelector((state) => state.setting.reviewList);
  const serviceList = useSelector((state) => state.service.allServiceList);
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});

  const initialForm = {
    customerName: "",
    customerDesignation: "",
    customerCompany: "",
    customerPhoto: null,
    reviewMessage: "",
    rating: 5,
    serviceId: "",
    blogId: "",
    isFeatured: 0,
    displayStatus: 1,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    dispatch(getAllReviews());
    dispatch(getAllServices());
  }, [dispatch, userId]);

  const filteredData = useMemo(() => {
    if (!search) return reviewList;
    return reviewList?.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, reviewList]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = "Required";
    if (!formData.reviewMessage) newErrors.reviewMessage = "Required";
    if (!formData.serviceId) newErrors.serviceId = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = () => {
    if (!validateForm()) return;

    const action = rowData
      ? updateReview({ id: rowData.id, userId, data: formData })
      : addReview({ userId, data: formData });

    dispatch(action).then((resp) => {
      if (resp.meta.requestStatus === "fulfilled") {
        showToast({
          title: "Success",
          description: rowData
            ? "Review updated successfully"
            : "Review added successfully",
          status: "success",
        });
        setOpenModal(false);
        setRowData(null);
        setFormData(initialForm);
        dispatch(getAllReviews());
      }
    });
  };

  const columns = [
    { title: "Customer", dataIndex: "customerName" },
    { title: "Company", dataIndex: "customerCompany" },
    { title: "Rating", dataIndex: "rating" },
    {
      title: "Status",
      dataIndex: "displayStatus",
      render: (v) => (v ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Dropdown
          items={[
            {
              key: 1,
              label: "Edit",
              onClick: () => {
                setRowData(record);
                setFormData(record);
                setOpenModal(true);
              },
            },
            {
              key: 2,
              label: (
                <PopConfirm
                  title="Delete review?"
                  onConfirm={() =>
                    dispatch(deleteReview({ id: record.id, userId }))
                  }
                >
                  <span className="text-red-600">Delete</span>
                </PopConfirm>
              ),
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
        <Button onClick={() => setOpenModal(true)}>Add review</Button>
      </div>
    );
  }, [search]);

  return (
    <>
      {!openModal ? (
        <>
          <h2 className="text-lg font-semibold">Reviews</h2>
          <Table
            columns={columns}
            dataSource={filteredData}
            topContent={topContent}
          />
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Button
              icon={<ArrowLeft />}
              variant="text"
              size="small"
              onClick={() => setOpenModal(false)}
            />
            <h2>{rowData ? "Update Review" : "Create Review"}</h2>
          </div>

          <form className="grid grid-cols-2 gap-6 mt-4">
            <Input
              label="Customer Name"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
            />

            <Input
              label="Designation"
              value={formData.customerDesignation}
              onChange={(e) =>
                handleChange("customerDesignation", e.target.value)
              }
            />

            <Input
              label="Company"
              value={formData.customerCompany}
              onChange={(e) => handleChange("customerCompany", e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label>Service</label>
              <Select
                label="Service"
                value={formData.serviceId}
                options={serviceList?.map((s) => ({
                  label: s.title,
                  value: s.id,
                }))}
                onChange={(v) => handleChange("serviceId", v)}
              />
            </div>

            <FileUploader
              label="Customer Photo"
              value={formData.customerPhoto}
              onChange={(file) => handleChange("customerPhoto", file)}
            />

            <Input
              type="number"
              label="Rating"
              min={1}
              max={5}
              value={formData.rating}
              onChange={(e) => handleChange("rating", Number(e.target.value))}
            />

            <div className="col-span-2">
              <label className="mb-1 block">
                Review Message <Required />
              </label>
              <TextEditor
                data={formData.reviewMessage}
                onChange={(evt, editor) =>
                  handleChange("reviewMessage", editor.getData())
                }
              />
            </div>

            <Select
              label="Featured"
              options={[
                { label: "No", value: 0 },
                { label: "Yes", value: 1 },
              ]}
              value={formData.isFeatured}
              onChange={(v) => handleChange("isFeatured", v)}
            />

            <Select
              label="Display Status"
              options={[
                { label: "Inactive", value: 0 },
                { label: "Active", value: 1 },
              ]}
              value={formData.displayStatus}
              onChange={(v) => handleChange("displayStatus", v)}
            />

            <div className="col-span-2 flex justify-end gap-4">
              <Button variant="secondary" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button onClick={onSubmit}>Submit</Button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default Reviews;

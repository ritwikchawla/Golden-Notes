import React, { useRef, useState } from "react";
import { Image, Upload, Save, Trash2 } from "react-feather";

function InputArea({ onAdd }) {
  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
  });
  const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0]);
      // Handle file upload logic here
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      inputValue.title.trim() === "" ||
      inputValue.description.trim() === ""
    ) {
      alert("Please enter both title and description");
      return;
    }
    onAdd(inputValue);
    setInputValue({ title: "", description: "" });
  };

  const handleClear = () => {
    setInputValue({ title: "", description: "" });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Title Input */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter title (Eg. Buy groceries)"
              value={inputValue.title}
              name="title"
              onChange={handleChange}
            />
          </div>

          {/* Description Textarea with Media Button */}
          <div className="mb-3 position-relative">
            <textarea
              className="form-control"
              rows="5"
              placeholder="1. Buy eggs 2. Buy vegetables"
              value={inputValue.description}
              name="description"
              onChange={handleChange}
            ></textarea>
            <button
              className="btn btn-sm btn-outline-secondary position-absolute"
              style={{ bottom: "10px", right: "10px" }}
              onClick={handleImageUpload}
              title="Add media"
              type="button"
            >
              <Image size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*, video/*"
              className="d-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-danger"
              onClick={handleClear}
              disabled={!inputValue.title && !inputValue.description}
            >
              <Trash2 size={16} className="me-1" />
              Clear
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!inputValue.title || !inputValue.description}
            >
              <Save size={16} className="me-1" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputArea;

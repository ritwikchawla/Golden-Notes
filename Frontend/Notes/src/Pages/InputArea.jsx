import React, { useRef, useState } from "react";
import { Image, Upload, Save, Trash2, X } from "react-feather";
import { Button, Form, Alert, Spinner } from "react-bootstrap";

function InputArea({ onAdd }) {
  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.match("image.*")) {
        setError("Only image files are allowed");
        return;
      }

      setError(null);
      setInputValue((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const removeImage = () => {
    setInputValue((prev) => ({
      ...prev,
      image: null,
    }));
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (inputValue.title.trim() === "") {
      setError("Title is required");
      return;
    }

    if (inputValue.description.trim() === "") {
      setError("Description is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAdd(inputValue);
      // Reset form after successful submission
      setInputValue({
        title: "",
        description: "",
        image: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setInputValue({
      title: "",
      description: "",
      image: null,
    });
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {/* Title Input */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              size="lg"
              placeholder="Enter title (e.g., Buy groceries)"
              value={inputValue.title}
              name="title"
              onChange={handleChange}
              isInvalid={error && error.includes("Title")}
            />
          </Form.Group>

          {/* Description Textarea */}
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="1. Buy eggs\n2. Buy vegetables"
              value={inputValue.description}
              name="description"
              onChange={handleChange}
              isInvalid={error && error.includes("Description")}
            />
          </Form.Group>

          {/* Image Preview and Upload */}
          <div className="mb-3">
            {inputValue.image && (
              <div className="mb-2 position-relative">
                <div className="d-flex align-items-center bg-light p-2 rounded">
                  <Image size={16} className="text-muted me-2" />
                  <span className="text-truncate">{inputValue.image.name}</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="ms-auto text-danger p-0"
                    onClick={removeImage}
                    title="Remove image"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            )}

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleImageUpload}
              className="d-flex align-items-center"
            >
              <Image size={16} className="me-1" />
              {inputValue.image ? "Change Image" : "Add Image"}
            </Button>
            <Form.Control
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="d-none"
            />
            <Form.Text className="text-muted">
              Max file size: 5MB (JPEG, PNG)
            </Form.Text>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="outline-danger"
              onClick={handleClear}
              disabled={
                (!inputValue.title &&
                  !inputValue.description &&
                  !inputValue.image) ||
                isSubmitting
              }
            >
              <Trash2 size={16} className="me-1" />
              Clear
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={
                !inputValue.title || !inputValue.description || isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-1"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="me-1" />
                  Save Note
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputArea;

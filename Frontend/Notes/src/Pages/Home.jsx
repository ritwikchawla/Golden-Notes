import React, { useEffect, useState, useCallback } from "react";
import InputArea from "./InputArea";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  ListGroup,
  Button,
  Form,
  Image as BootstrapImage,
  Modal,
} from "react-bootstrap";
import { Image, Trash2, Edit, Check, X, Maximize2 } from "react-feather";
import moment from "moment";

function Home() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    image: null,
    currentImage: null,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const token = localStorage.getItem("token");

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${apiUrl}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.message) {
        const sortedNotes = (res.data.message.Notes || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotes(sortedNotes);
        setUser(res.data.message.User || null);
        setSuccess("Notes loaded successfully");
        console.log(res.data.message.Notes);
      }
    } catch (error) {
      console.error("Cannot fetch notes api", error);
      setError(
        error.response?.data?.message ||
          "Failed to load notes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  const handleAdd = async (inputValue) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append("email", user?.Email || "");
      formData.append("title", inputValue.title);
      formData.append("description", inputValue.description);

      if (inputValue.image) {
        if (inputValue.image.size > 5 * 1024 * 1024) {
          throw new Error("Image size should be less than 5MB");
        }
        formData.append("image", inputValue.image);
      }

      await axios.post(`${apiUrl}/api/profile/addnote`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Note added successfully!");
      setTimeout(() => setSuccess(null), 3000);
      fetchNotes();
    } catch (error) {
      console.error("Cannot add note", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to add the note. Please try again."
      );
    }
  };

  const handleDelete = async (noteId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this note?")) return;

      setError(null);
      await axios.delete(`${apiUrl}/api/profile/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Note deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
      fetchNotes();
    } catch (error) {
      console.error("Cannot delete note", error);
      setError(error.response?.data?.message || "Failed to delete note");
    }
  };

  const handleEditClick = (note) => {
    setEditingNoteId(note._id || note.id);
    setEditFormData({
      title: note.title || "",
      description: note.description || "",
      image: null,
      currentImage: note.image || null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setEditFormData({
        ...editFormData,
        image: e.target.files[0],
      });
    }
  };

  const handleRemoveImage = () => {
    setEditFormData({
      ...editFormData,
      image: null,
      currentImage: null,
    });
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
  };

  const handleUpdateNote = async (noteId) => {
    try {
      setError(null);
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("email", user?.Email || "");
      formData.append("title", editFormData.title);
      formData.append("description", editFormData.description);

      if (editFormData.image) {
        formData.append("image", editFormData.image);
      } else if (editFormData.currentImage === null) {
        formData.append("removeImage", "true");
      }

      await axios.put(`${apiUrl}/api/profile/${noteId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Note updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setEditingNoteId(null);
      fetchNotes();
    } catch (error) {
      console.error("Cannot update note", error);
      setError(error.response?.data?.message || "Failed to update note");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Success and Error Alerts */}
      {success && (
        <Row className="justify-content-center mb-3">
          <Col xs={12} md={10} lg={8}>
            <Alert
              variant="success"
              onClose={() => setSuccess(null)}
              dismissible
            >
              {success}
            </Alert>
          </Col>
        </Row>
      )}
      {error && (
        <Row className="justify-content-center mb-3">
          <Col xs={12} md={10} lg={8}>
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* User Greeting */}
      {user && user.Name && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={10} lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-3">
                <h2 className="mb-0">
                  Welcome back,{" "}
                  <span className="text-primary">{user.Name}</span>! 👋
                </h2>
                <p className="text-muted mb-0">
                  {notes.length} {notes.length === 1 ? "note" : "notes"} created
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Input Area */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <InputArea onAdd={handleAdd} />
        </Col>
      </Row>

      {/* Notes List */}
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          {notes.length > 0 ? (
            <ListGroup>
              {notes.map((note) => (
                <ListGroup.Item
                  key={note._id || note.id}
                  className="mb-3 border-0 p-0"
                >
                  <Card className="shadow-sm">
                    <Card.Body>
                      {editingNoteId === (note._id || note.id) ? (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="text"
                              name="title"
                              value={editFormData.title}
                              onChange={handleEditChange}
                              className="mb-2"
                              placeholder="Title"
                            />
                            <Form.Control
                              as="textarea"
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditChange}
                              rows={3}
                              placeholder="Description"
                            />

                            {/* Image preview and upload */}
                            <div className="mt-3">
                              {editFormData.currentImage &&
                                !editFormData.image && (
                                  <div className="mb-2 position-relative">
                                    <BootstrapImage
                                      src={editFormData.currentImage}
                                      alt="Current note attachment"
                                      thumbnail
                                      style={{ maxWidth: "200px" }}
                                    />
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="position-absolute top-0 start-0 translate-middle"
                                      onClick={handleRemoveImage}
                                    >
                                      <X size={12} />
                                    </Button>
                                  </div>
                                )}

                              {editFormData.image && (
                                <div className="mb-2">
                                  <p className="text-success mb-1">
                                    New image selected:{" "}
                                    {editFormData.image.name}
                                  </p>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={handleRemoveImage}
                                  >
                                    Remove Image
                                  </Button>
                                </div>
                              )}

                              <Form.Label className="d-block">
                                <Button
                                  variant="outline-secondary"
                                  as="span"
                                  size="sm"
                                  className="d-flex align-items-center"
                                >
                                  <Image size={16} className="me-1" />
                                  {editFormData.image ||
                                  editFormData.currentImage
                                    ? "Change Image"
                                    : "Add Image"}
                                </Button>
                                <Form.Control
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="d-none"
                                />
                              </Form.Label>
                            </div>
                          </Form.Group>
                          <div className="d-flex justify-content-end">
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2"
                              onClick={() =>
                                handleUpdateNote(note._id || note.id)
                              }
                              aria-label="Save changes"
                              disabled={
                                uploadingImage || !editFormData.title.trim()
                              }
                            >
                              {uploadingImage ? (
                                <Spinner size="sm" animation="border" />
                              ) : (
                                <>
                                  <Check size={16} className="me-1" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={handleCancelEdit}
                              aria-label="Cancel edit"
                            >
                              <X size={16} className="me-1" />
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1 me-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <Card.Title className="mb-1">
                                  {note.title}
                                </Card.Title>
                                <small className="text-muted">
                                  {moment(note.createdAt).fromNow()}
                                </small>
                              </div>
                              <Card.Text className="text-muted mb-2">
                                {note.description}
                              </Card.Text>
                              {note.image && (
                                <div className="mt-2 mb-3 position-relative">
                                  <div
                                    onClick={() => handleImageClick(note.image)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <BootstrapImage
                                      src={`${apiUrl}${note.image}`}
                                      alt="Note attachment"
                                      thumbnail
                                      style={{
                                        maxWidth: "100%",
                                        maxHeight: "300px",
                                      }}
                                    />
                                    <div className="position-absolute top-0 end-0 m-2 bg-white rounded p-1 opacity-75">
                                      <Maximize2 size={16} />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="d-flex flex-column">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="mb-2"
                                onClick={() => handleEditClick(note)}
                                aria-label="Edit note"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  handleDelete(note._id || note.id)
                                }
                                aria-label="Delete note"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Card className="text-center py-5 border-0 shadow-sm">
              <Card.Body>
                <Image size={48} className="text-muted mb-3" />
                <h4 className="text-muted mb-3">No notes yet</h4>
                <p className="text-muted mb-0">
                  Add your first note using the form above
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Image Modal */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Note Attachment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={selectedImage}
            alt="Full size attachment"
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
            className="img-fluid"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            as="a"
            href={selectedImage}
            target="_blank"
            download
          >
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Home;

import React, { useEffect, useState } from "react";
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
} from "react-bootstrap";
import { Image, Upload, Save, Trash2 } from "react-feather";

function Home() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(res.data.message.Notes || []);
      setUser(res.data.message.User || null);
      setSuccess("Notes loaded successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Cannot fetch notes api", error);
      setError(error.response?.data?.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (inputValue) => {
    try {
      setError(null);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/profile/addnote",
        {
          email: user.Email,
          title: inputValue.title,
          description: inputValue.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Note added successfully!");
      setTimeout(() => setSuccess(null), 3000);
      fetchNotes(); // Refresh the notes list
    } catch (error) {
      console.error("Cannot add note", error);
      setError(error.response?.data?.message || "Failed to add note");
    }
  };

  const handleDelete = async (noteId) => {
    try {
      setError(null);
      await axios.delete(`http://127.0.0.1:8000/api/profile/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Note deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
      fetchNotes(); // Refresh the notes list
    } catch (error) {
      console.error("Cannot delete note", error);
      setError(error.response?.data?.message || "Failed to delete note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading && notes.length === 0) {
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
      {user && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={10} lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-3">
                <h2 className="mb-0">
                  Welcome back,{" "}
                  <span className="text-primary">{user.Name}</span>! 👋
                </h2>
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
                  className="mb-3 shadow-sm p-0"
                >
                  <Card border="light">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title className="mb-1">{note.title}</Card.Title>
                          <Card.Text className="text-muted">
                            {note.description}
                          </Card.Text>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(note._id || note.id)}
                          aria-label="Delete note"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      {note.createdAt && (
                        <small className="text-muted">
                          Created: {new Date(note.createdAt).toLocaleString()}
                        </small>
                      )}
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Card className="text-center py-5 border-0 shadow-sm">
              <Card.Body>
                <h4 className="text-muted mb-4">No notes yet</h4>
                <p className="text-muted">
                  Add your first note using the form above
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

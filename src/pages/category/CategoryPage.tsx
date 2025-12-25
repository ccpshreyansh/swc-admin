import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../service/categoriesService";
import { fileToBase64 } from "../../utils/imageToBase64";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import "./Category.css";

export default function CategoryPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const base64 = await fileToBase64(e.target.files[0]);
    setImage(base64);
  };

  const submit = async () => {
    if (!title || !image) return alert("Fill all fields");

    editingId
      ? await updateCategory(editingId, title, image)
      : await addCategory(title, image);

    reset();
    load();
  };

  const reset = () => {
    setTitle("");
    setImage(null);
    setEditingId(null);
    setModalOpen(false);
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-top">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <h2>Categories</h2>

        <button className="add-btn" onClick={() => setModalOpen(true)}>
          <FaPlus /> Add
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="category-list">
          {categories.map((cat) => (
            <div className="category-row" key={cat.id}>
              <img
                src={`data:image/jpeg;base64,${cat.image}`}
                alt={cat.title}
              />

              <span className="cat-title">{cat.title}</span>

              <div className="row-actions">
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setTitle(cat.title);
                    setImage(cat.image);
                    setModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>

                <button
                  className="danger"
                  onClick={() => deleteCategory(cat.id).then(load)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingId ? "Update Category" : "Add Category"}</h3>

            <input
              placeholder="Category title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input type="file" accept="image/*" onChange={handleFile} />

            {image && (
              <img
                src={`data:image/jpeg;base64,${image}`}
                className="preview"
              />
            )}

            <div className="modal-actions">
              <button className="gold-btn" onClick={submit}>
                Save
              </button>
              <button className="outline-btn" onClick={reset}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

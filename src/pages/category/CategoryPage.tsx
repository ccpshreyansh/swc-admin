import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
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

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [modalOpen]);

  const load = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const base64 = await fileToBase64(e.target.files[0]);
    setImage(base64);
  };

  const submit = async () => {
    if (!title || !image) { alert("Fill all fields"); return; }

    if (editingId) {
      await updateCategory(editingId, title, image);
    } else {
      await addCategory(title, image);
    }

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
        {/* <div className="test"><h1>Hey</h1></div> */}
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
        <p>Loading...</p>
      ) : (
        <div className="category-list">
          {categories.map((cat) => (
            <div className="category-row" key={cat.id}>
              <img src={`data:image/jpeg;base64,${cat.image}`} alt={cat.title} />
              <span className="cat-title">{cat.title}</span>
              <div className="row-actions">
                <button onClick={() => { setEditingId(cat.id); setTitle(cat.title); setImage(cat.image); setModalOpen(true); }}>
                  <FaEdit />
                </button>
                <button className="danger" onClick={() => deleteCategory(cat.id).then(load)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
   {modalOpen && createPortal(
  <div className="modal-overlay" onClick={reset}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      
      {/* HEADER */}
      <div className="modal-header">
        <h3>{editingId ? "Update Category" : "Add Category"}</h3>
        <button className="close-btn" onClick={reset}>×</button>
      </div>

      {/* BODY */}
      <div className="modal-body">
        <label className="image-upload">
          {image ? (
            <img src={`data:image/jpeg;base64,${image}`} alt="Preview" />
          ) : (
            <div className="upload-placeholder">
              Upload Image
              <small>PNG / JPG</small>
            </div>
          )}
          <input type="file" accept="image/*" hidden onChange={handleFile} />
        </label>

        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            placeholder="e.g. Pendant Set"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="modal-footer">
        <button className="outline-btn" onClick={reset}>Cancel</button>
        <button className="gold-btn" onClick={submit}>{editingId ? "Update" : "Save"}</button>
      </div>

    </div>
  </div>,
  document.body
)}

    </div>
  );
}

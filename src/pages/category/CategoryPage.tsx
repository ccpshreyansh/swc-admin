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
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

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
    if (!title || !image) {
      alert("Fill all fields");
      return;
    }

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
    
    <div className="mx-auto max-w-6xl p-6">
      {/* HEADER */}
     
      <div className="mb-8 grid grid-cols-3 items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex w-fit items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-center text-2xl font-semibold">
          Categories
        </h2>

        <div className="flex justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm"
            >
              <img
                src={`data:image/jpeg;base64,${cat.image}`}
                alt={cat.title}
                className="h-16 w-16 rounded-lg object-cover"
              />

              <span className="flex-1 text-lg font-medium">
                {cat.title}
              </span>

              <div className="flex gap-2">
                <button
                  className="rounded-lg border p-2 hover:bg-gray-100"
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
                  className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
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
      {modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={reset}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between border-b p-5">
                <h3 className="text-lg font-semibold">
                  {editingId ? "Update Category" : "Add Category"}
                </h3>
                <button
                  onClick={reset}
                  className="text-xl text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </div>

              {/* BODY */}
              <div className="space-y-5 p-5">
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 hover:border-black">
                  {image ? (
                    <img
                      src={`data:image/jpeg;base64,${image}`}
                      className="h-32 w-32 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      Upload Image
                      <div className="text-xs">PNG / JPG</div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFile}
                  />
                </label>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pendant Set"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 border-t p-5">
                <button
                  onClick={reset}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={submit}
                  className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

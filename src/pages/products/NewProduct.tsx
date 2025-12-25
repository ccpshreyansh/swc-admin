import { useEffect, useState } from "react";
import {
  fetchProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../service/newProductsService";
import { fetchCategories } from "../../service/categoriesService";
import { fileToBase64 } from "../../utils/imageToBase64";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    title: "",
    weight: "",
    karat: "",
    making: "",
    description: "",
    image: "",
    stock: true,
    show: true,
    shop: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const loadProducts = async () => {
    if (!selectedCategory) return;
    const data = await fetchProductsByCategory(selectedCategory);
    setProducts(data);
  };

  const handleImage = async (e: any) => {
    if (!e.target.files?.[0]) return;
    const base64 = await fileToBase64(e.target.files[0]);
    setForm({ ...form, image: base64 });
  };

  const submit = async () => {
    if (!form.title || !form.image || !form.categoryId) {
      alert("Please fill required fields");
      return;
    }

    editingId
      ? await updateProduct(editingId, form)
      : await addProduct(form);

    reset();
    loadProducts();
  };

  const reset = () => {
    setModal(false);
    setEditingId(null);
    setForm({
      title: "",
      weight: "",
      karat: "",
      making: "",
      description: "",
      image: "",
      stock: true,
      show: true,
      shop: "",
      categoryId: selectedCategory,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">New Products</h2>
        <div />
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <button
          onClick={loadProducts}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
        >
          Fetch
        </button>

        <button
          onClick={() => {
            setForm({ ...form, categoryId: selectedCategory });
            setModal(true);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          + Add Product
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
          >
            <img
              src={`data:image/jpeg;base64,${p.image}`}
              alt={p.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col gap-2">
              <h4 className="text-lg font-semibold text-gray-800">{p.title}</h4>
              <p className="text-gray-500 text-sm">
                {p.weight}g · {p.karat}K
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditingId(p.id);
                    setForm(p);
                    setModal(true);
                  }}
                  className="flex-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    deleteProduct(p.id).then(() => loadProducts())
                  }
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Update Product" : "Add Product"}
              </h3>
              <button
                onClick={reset}
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                placeholder="Weight (g)"
                value={form.weight}
                onChange={(e) =>
                  setForm({ ...form, weight: e.target.value })
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                placeholder="Karat"
                value={form.karat}
                onChange={(e) =>
                  setForm({ ...form, karat: e.target.value })
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                placeholder="Making Charge"
                value={form.making}
                onChange={(e) =>
                  setForm({ ...form, making: e.target.value })
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none col-span-2"
              >
                <option value="">Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
            />

            <div className="flex gap-4 items-center mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                In Stock
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.show}
                  onChange={(e) =>
                    setForm({ ...form, show: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                Visible
              </label>
            </div>

            <input
              type="file"
              onChange={handleImage}
              className="mb-4"
            />

            {form.image && (
              <img
                src={`data:image/jpeg;base64,${form.image}`}
                alt="preview"
                className="mb-4 rounded-md border"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={submit}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              >
                Save
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

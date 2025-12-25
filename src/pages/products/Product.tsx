import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../service/productsService";
import { fetchCategories } from "../../service/categoriesService";
import { fileToBase64 } from "../../utils/imageToBase64";

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
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-semibold">Products</h2>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          className="border rounded-lg px-3 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          className="px-4 py-2 rounded-lg border hover:bg-gray-100"
        >
          Fetch
        </button>

        <button
          onClick={() => {
            setForm({ ...form, categoryId: selectedCategory });
            setModal(true);
          }}
          className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          + Add Product
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={`data:image/jpeg;base64,${p.image}`}
              className="w-full h-48 object-cover rounded-t-xl"
            />

            <div className="p-4">
              <h4 className="font-semibold">{p.title}</h4>
              <p className="text-sm text-gray-600">
                {p.weight}g · {p.karat}K
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setEditingId(p.id);
                    setForm(p);
                    setModal(true);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(p.id).then(loadProducts)}
                  className="text-sm text-red-600 hover:underline"
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
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-full max-w-2xl h-[90vh] rounded-xl shadow-lg flex flex-col"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h3 className="font-semibold text-lg">
          {editingId ? "Update Product" : "Add Product"}
        </h3>
        <button
          onClick={reset}
          className="text-2xl leading-none text-gray-500 hover:text-black"
        >
          ×
        </button>
      </div>

      {/* BODY (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Weight (g)"
            value={form.weight}
            onChange={(e) =>
              setForm({ ...form, weight: e.target.value })
            }
          />

          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Karat"
            value={form.karat}
            onChange={(e) =>
              setForm({ ...form, karat: e.target.value })
            }
          />

          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Making Charge"
            value={form.making}
            onChange={(e) =>
              setForm({ ...form, making: e.target.value })
            }
          />

          <select
            className="border rounded-lg px-3 py-2 sm:col-span-2"
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
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
          className="border rounded-lg px-3 py-2 w-full min-h-[80px]"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* SWITCHES */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.checked })
              }
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
            />
            Visible
          </label>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="space-y-2">
          <input type="file" onChange={handleImage} />

          {form.image && (
            <img
              src={`data:image/jpeg;base64,${form.image}`}
              className="w-full max-h-48 object-contain rounded-lg border"
            />
          )}
        </div>
      </div>

      {/* FOOTER (ALWAYS VISIBLE) */}
      <div className="border-t px-6 py-4 flex justify-end gap-3 bg-white">
        <button
          onClick={reset}
          className="px-5 py-2 rounded-lg border hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

import { useEffect, useState } from "react"; 
import {
  fetchProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../service/productsService";
import { fetchCategories } from "../../service/categoriesService";
import { fileToBase64 } from "../../utils/imageToBase64";
import "./Product.css";
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
    <div className="product-page">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>Products</h2>
      </div>

      <div className="controls">
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <button onClick={loadProducts}>Fetch</button>
        <button className="primary" onClick={() => { setForm({ ...form, categoryId: selectedCategory }); setModal(true); }}>
          + Add Product
        </button>
      </div>

      <div className="grid">
        {products.map(p => (
          <div className="card" key={p.id}>
            <img src={`data:image/jpeg;base64,${p.image}`} />
            <h4>{p.title}</h4>
            <p>{p.weight}g · {p.karat}K</p>
            <div className="actions">
              <button onClick={() => { setEditingId(p.id); setForm(p); setModal(true); }}>Edit</button>
              <button className="danger" onClick={() => deleteProduct(p.id).then(loadProducts)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-bg" onClick={reset}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "Update Product" : "Add Product"}</h3>
              <button className="close-btn" onClick={reset}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                {/* <input placeholder="Shop" value={form.shop} onChange={e => setForm({ ...form, shop: e.target.value })} /> */}
                <input placeholder="Weight (g)" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
                <input placeholder="Karat" value={form.karat} onChange={e => setForm({ ...form, karat: e.target.value })} />
                <input placeholder="Making Charge" value={form.making} onChange={e => setForm({ ...form, making: e.target.value })} />

                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

              <div className="switch-row">
                <label><input type="checkbox" checked={form.stock} onChange={e => setForm({ ...form, stock: e.target.checked })} /> In Stock</label>
                <label><input type="checkbox" checked={form.show} onChange={e => setForm({ ...form, show: e.target.checked })} /> Visible</label>
              </div>

              <input type="file" onChange={handleImage} />

              {form.image && <img className="preview" src={`data:image/jpeg;base64,${form.image}`} />}
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button className="primary" onClick={submit}>Save</button>
                <button onClick={reset}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

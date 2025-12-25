import React, { useEffect, useState } from "react";
import {
  fetchInvestments,
  addInvestment,
  updateInvestment,
  deleteInvestment,
} from "../../service/investmentPlan";
// import { type InvestmentPlan } from "../../service/investmentplan";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import "./Investments.css"; // We'll add CSS below
interface InvestmentPlan {
  id?: string;
  name: string;
  tenure: string;
  amount: string;
  details?: string;
  terms?: string;
}
const InvestmentScreen: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    name: "",
    tenure: "",
    amount: "",
    details: "",
    terms: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const data = await fetchInvestments();
    setPlans(data);
    setLoading(false);
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.tenure || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateInvestment(editingId, form);
        setEditingId(null);
      } else {
        await addInvestment(form);
      }
      setForm({ name: "", tenure: "", amount: "", details: "", terms: "" });
      loadPlans();
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (plan: InvestmentPlan) => {
    setForm(plan);
    setEditingId(plan.id!);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      await deleteInvestment(id);
      loadPlans();
    }
  };

  return (
    <div className="container">
      <h1>Investment Plans</h1>

      <button className="add-button" onClick={() => setModalVisible(true)}>
        <FiPlus /> Add Plan
      </button>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="plan-list">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.name}</h3>
              <p>Tenure: {plan.tenure}</p>
              <p>Amount: {plan.amount}</p>
              {plan.details && <p>Details: {plan.details}</p>}
              {plan.terms && <p>Terms: {plan.terms}</p>}
              <div className="action-row">
                <button onClick={() => handleEdit(plan)} className="edit-btn">
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id!)}
                  className="delete-btn"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId ? "Update Plan" : "Add Investment Plan"}</h2>
            <input
              type="text"
              placeholder="Investment Plan Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tenure"
              value={form.tenure}
              onChange={(e) => setForm({ ...form, tenure: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <input
              type="text"
              placeholder="Details"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
            />
            <input
              type="text"
              placeholder="Terms & Conditions"
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleAddOrUpdate} className="add-btn">
                {editingId ? "Update Plan" : "Add Plan"}
              </button>
              <button
                onClick={() => {
                  setModalVisible(false);
                  setForm({ name: "", tenure: "", amount: "", details: "", terms: "" });
                  setEditingId(null);
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentScreen;

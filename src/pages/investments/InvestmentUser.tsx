import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Firestore,
} from "firebase/firestore";
import { getShopDb } from "../../firebase/dynamicFirebase"; // dynamic DB
import "./AllInvestments.css";

export interface PaymentEntry {
  month: string;
  amount: string;
  date: string;
  accountName: string;
  remark?: string;
}

export interface Investment {
  id?: string;
  planName: string;
  userMobile: string;
  createdAt?: any;
  paymentHistory?: PaymentEntry[];
}

interface Props {
  shopId?: string;
}

const AllInvestments: React.FC<Props> = ({ shopId }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Payment form fields
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [accountName, setAccountName] = useState("");
  const [remark, setRemark] = useState("");

  // Get dynamic collection reference
  const getCollectionRef = (): ReturnType<typeof collection> => {
    const db: Firestore | null = getShopDb(shopId);
    if (!db) throw new Error("Shop DB not initialized");
    return collection(db, "investments");
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString();
    return timestamp;
  };

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const collectionRef = getCollectionRef();
      const snapshot = await getDocs(collectionRef);
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Investment[];
      setInvestments(data);
    } catch (err) {
      console.error("Error fetching investments:", err);
      alert("Failed to fetch investments");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!month || !amount || !date || !accountName) {
      alert("Please fill all required fields");
      return;
    }
    if (!selectedInvestment || !selectedInvestment.id) return;

    try {
      const updatedEntry: PaymentEntry = { month, amount, date, accountName, remark };
      const db = getShopDb(shopId);
      if (!db) throw new Error("Shop DB not initialized");
      const investmentRef = doc(db, "investments", selectedInvestment.id);
      const prevHistory = selectedInvestment.paymentHistory || [];
      const newHistory = [...prevHistory, updatedEntry];
      await updateDoc(investmentRef, { paymentHistory: newHistory });

      alert("✅ Payment history updated successfully");

      setModalVisible(false);
      setMonth(""); setAmount(""); setDate(""); setAccountName(""); setRemark("");
      fetchInvestments();
    } catch (err) {
      console.error("Error updating payment history:", err);
      alert("Failed to update payment history");
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <p>Loading all investments...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-header">📊 All Investments</h1>

      <div className="investment-list">
        {investments.map((item) => (
          <div key={item.id} className="card">
            <h3 className="plan-name">{item.planName}</h3>
            <p className="detail">User: {item.userMobile}</p>
            <p className="detail">Date: {formatDate(item.createdAt)}</p>

            <h4 className="history-header">Payment History:</h4>
            {item.paymentHistory && item.paymentHistory.length > 0 ? (
              item.paymentHistory.map((entry, index) => (
                <div key={index} className="history-item">
                  <p>{entry.month} - ₹{entry.amount}</p>
                  <p>{formatDate(entry.date)}</p>
                  <p>By: {entry.accountName}</p>
                  {entry.remark && <p>Note: {entry.remark}</p>}
                </div>
              ))
            ) : (
              <p className="no-payments">No payments yet</p>
            )}

            <button className="update-btn" onClick={() => { setSelectedInvestment(item); setModalVisible(true); }}>
              + Update Payment
            </button>
          </div>
        ))}
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Add Payment Entry</h2>
            <input placeholder="Month" value={month} onChange={e => setMonth(e.target.value)} />
            <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            <input placeholder="Date (DD/MM/YYYY)" value={date} onChange={e => setDate(e.target.value)} />
            <input placeholder="Account Name" value={accountName} onChange={e => setAccountName(e.target.value)} />
            <input placeholder="Remark" value={remark} onChange={e => setRemark(e.target.value)} />

            <div className="modal-actions">
              <button className="save-btn" onClick={handleUpdate}>Save</button>
              <button className="cancel-btn" onClick={() => setModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInvestments;

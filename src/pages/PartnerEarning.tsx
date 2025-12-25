import React, { useState } from "react";
import { doc, getDoc, updateDoc, setDoc, Firestore } from "firebase/firestore";
import { getShopDb } from "../firebase/dynamicFirebase";
import "./PartnerEarning.css";

interface EarningEntry {
  billAmount: number;
  earningAmount: number;
  date: string;
  remark?: string;
}

interface PartnerData {
  name?: string;
  mobile: string;
  totalEarning: number;
  history: EarningEntry[];
}

interface Props {
  shopId?: string;
}

const PartnerEarning: React.FC<Props> = ({ shopId }) => {
  const [mobile, setMobile] = useState("");
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [billAmount, setBillAmount] = useState("");
  const [earningAmount, setEarningAmount] = useState("");
  const [date, setDate] = useState("");
  const [remark, setRemark] = useState("");

  const getCollectionRef = (): Firestore => {
    const db = getShopDb(shopId);
    if (!db) throw new Error("Shop DB not initialized");
    return db;
  };

  /* ---------------- FETCH PARTNER ---------------- */
  const fetchPartner = async () => {
    if (!mobile) {
      alert("Enter mobile number");
      return;
    }
    try {
      setLoading(true);
      const ref = doc(getCollectionRef(), "partnerusers", mobile);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        let data = snap.data() as PartnerData;
        if (!data.history) data.history = [];
        // Sort latest first
        data.history.sort((a: any, b: any) => {
          const d1 = new Date(a.date.split("/").reverse().join("-"));
          const d2 = new Date(b.date.split("/").reverse().join("-"));
          return d2.getTime() - d1.getTime();
        });
        setPartnerData(data);
      } else {
        alert("Partner not found in database.");
        setPartnerData(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch partner");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SAVE EARNING ---------------- */
  const handleSave = async () => {
    if (!billAmount || !earningAmount || !date) {
      alert("Fill all required fields!");
      return;
    }

    const billAmtNum = Number(billAmount);
    const earnAmtNum = Number(earningAmount);

    if (isNaN(billAmtNum) || isNaN(earnAmtNum)) {
      alert("Amounts must be numbers");
      return;
    }

    const newEntry: EarningEntry = { billAmount: billAmtNum, earningAmount: earnAmtNum, date, remark };

    try {
      const ref = doc(getCollectionRef(), "partnerusers", mobile);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          name: "",
          mobile,
          totalEarning: earnAmtNum,
          history: [newEntry],
        });
      } else {
        const prev = snap.data().history || [];
        const total = (snap.data().totalEarning || 0) + earnAmtNum;

        await updateDoc(ref, {
          history: [...prev, newEntry],
          totalEarning: total,
        });
      }

      alert("Earning updated successfully!");
      setModalVisible(false);
      setBillAmount("");
      setEarningAmount("");
      setDate("");
      setRemark("");
      fetchPartner();
    } catch (err) {
      console.error(err);
      alert("Failed to update earnings");
    }
  };

  return (
    <div className="container">
      <h1 className="header">Partner Earnings</h1>

      <input
        type="text"
        placeholder="Enter Partner Mobile Number"
        className="search-input"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <button className="search-btn" onClick={fetchPartner}>
        Search
      </button>

      {loading && <p className="loading">Loading...</p>}

      {partnerData && (
        <div className="card">
          <h3 className="title">📌 Partner Details</h3>
          <p>Name: {partnerData.name || "Not Set"}</p>
          <p>Mobile: {partnerData.mobile}</p>
          <p className="total-earning">Total Earning: ₹{partnerData.totalEarning || 0}</p>

          <h4 className="history-title">Earning History</h4>
          {partnerData.history.length > 0 ? (
            partnerData.history.map((h, i) => (
              <div key={i} className="history-item">
                <p>Bill: ₹{h.billAmount}</p>
                <p>Earning: ₹{h.earningAmount}</p>
                <p>Date: {h.date}</p>
                {h.remark && <p>Note: {h.remark}</p>}
              </div>
            ))
          ) : (
            <p className="no-history">No earning entries yet.</p>
          )}

          <button className="update-btn" onClick={() => setModalVisible(true)}>
            + Add Earning
          </button>
        </div>
      )}

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Add Partner Earning</h3>

            <input
              type="number"
              placeholder="Bill Amount"
              className="input"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
            />
            <input
              type="number"
              placeholder="Earning Amount"
              className="input"
              value={earningAmount}
              onChange={(e) => setEarningAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Date (DD/MM/YYYY)"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Remark (optional)"
              className="input"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />

            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={() => setModalVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerEarning;

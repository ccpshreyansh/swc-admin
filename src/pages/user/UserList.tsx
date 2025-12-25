import React, { useEffect, useState } from "react";
import { collection, getDocs, Firestore } from "firebase/firestore";
import { getShopDb } from "../../firebase/dynamicFirebase"; // dynamic DB
import "./UserList.css";

export interface UserProfile {
  name?: string;
  city?: string;
}

export interface User {
  id: string;
  mobile?: string;
  gender?: string;
  pin?: string;
  createdAt?: any;
  profile?: UserProfile;
}

interface Props {
  shopId?: string;
}

const UserList: React.FC<Props> = ({ shopId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const getCollectionRef = (): ReturnType<typeof collection> => {
    const db: Firestore | null = getShopDb(shopId);
    if (!db) throw new Error("Shop DB not initialized");
    return collection(db, "users");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(getCollectionRef());
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
        setUsers(list);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const formatDate = (createdAt: any) => {
    if (!createdAt) return "-";
    if (createdAt.toDate) return new Date(createdAt.toDate()).toLocaleString();
    return new Date(createdAt).toLocaleString();
  };

  if (loading) {
    return (
      <div className="loader">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <button className="back-btn" onClick={() => window.history.back()}>
          &#8592;
        </button>
        <h1 className="header-title">All Users</h1>
      </div>

      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="card">
            <div className="header-row">
              <h3 className="name">{user.profile?.name || "No Name"}</h3>
              <span className="city">{user.profile?.city || "-"}</span>
            </div>
            <div className="info-row">
              <span className="icon">📞</span>
              <span className="info-text">{user.mobile}</span>
            </div>
            <div className="info-row">
              <span className="icon">⚥</span>
              <span className="info-text">{user.gender || "-"}</span>
            </div>
            <div className="info-row">
              <span className="icon">🔑</span>
              <span className="info-text">PIN: {user.pin}</span>
            </div>
            <div className="created-at">
              Created: {formatDate(user.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;

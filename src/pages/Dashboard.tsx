import { useNavigate } from "react-router-dom";
import {
  FaTags,
  FaBoxOpen,
  FaUser,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";
import "./Dashboard.css";

const cards = [
  {
    title: "Manage Categories",
    icon: <FaTags />,
    path: "/categories",
    desc: "Add, update & delete jewellery categories",
  },
  {
    title: "Products",
    icon: <FaBoxOpen />,
    path: "/products",
    desc: "Add products & map with categories",
  },
  {
    title: "New Products",
    icon: <FaBoxOpen />,
    path: "/newProduct",
    desc: "Add new products & map with categories",
  },
  {
    title: "Investment Plans",
    icon: <FaChartLine />,
    path: "/investment",
    desc: "Create & manage gold investment plans",
  },
  {
    title: "Investment Users",
    icon: <FaUsers />,
    path: "/investment-users",
    desc: "Manage investment plans payments",
  },
  {
    title: "Users",
    icon: <FaUser />,
    path: "/users",
    desc: "View all customers",
  },
  {
    title: "Partners",
    icon: <FaUsers />,
    path: "/partners",
    desc: "View all partners",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const shopConfig = { shopName: "Jewellery Shop" };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <GiDiamondRing />
        <h1>Jewellery App Admin</h1>
        <p>{shopConfig?.shopName}</p>
      </header>

      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.title}
            className="dash-card"
            onClick={() => navigate(card.path)}
          >
            <div className="icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { HomeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "./App.css";
import HomePage from "./pages/HomePage";
import StatusPage from "./pages/StatusPage";

const { Header, Content, Footer } = Layout;

function App() {
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">主页</Link>,
    },
    {
      key: "/status",
      icon: <InfoCircleOutlined />,
      label: <Link to="/status">状态</Link>,
    },
  ];

  return (
    <Router>
      <Layout className="layout" style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            color: "white",
            backgroundColor: "#001529",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: "bold", marginRight: "40px" }}>
            CodeSnip
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[window.location.pathname]}
            items={menuItems}
            style={{ flex: 1, minWidth: 0, backgroundColor: "transparent" }}
          />
        </Header>
        <Content style={{ padding: "0 50px", marginTop: "20px" }}>
          <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/status" element={<StatusPage />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;

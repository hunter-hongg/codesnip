import { useEffect, useState } from "react";
import { Layout, Table, Modal, Button, Typography } from "antd";
import axios from "axios";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [status, setStatus] = useState("");
  const [statusOk, setStatusOk] = useState(false);
  const description =
    "Store, organize, and share your code snippets with ease.";

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/health")
      .then((res) => {
        setStatus(res.data.status);
        setStatusOk(res.data.status === "ok");
      })
      .catch((_err) => {
        setStatus(`${_err.message}`);
        setStatusOk(false);
      });
  }, []);

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          color: "white",
          backgroundColor: "#111111aa",
        }}
      >
        <div style={{ fontSize: "22px", fontWeight: "bold" }}>CodeSnip</div>
        <div style={{ fontSize: "18px", marginLeft: "auto" }}>
          {description}
        </div>
      </Header>
      <Content style={{ padding: "30px" }}>
        <Title level={4} style={{ color: statusOk ? "green" : "red" }}>Server Status: {status}</Title>
      </Content>
    </Layout>
  );
}

export default App;

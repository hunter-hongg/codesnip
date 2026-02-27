import { useEffect, useState } from "react";
import { Layout, Typography, Card, Spin, Alert } from "antd";
import axios from "axios";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function StatusPage() {
  const [status, setStatus] = useState<string>("");
  const [statusOk, setStatusOk] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/health")
      .then((res) => {
        setStatus(res.data.status);
        setStatusOk(res.data.status === "ok");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setStatusOk(false);
        setLoading(false);
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
        <div style={{ fontSize: "22px", fontWeight: "bold" }}>CodeSnip - 状态页面</div>
      </Header>
      <Content style={{ padding: "50px" }}>
        <Card title="服务器状态" bordered={false} style={{ maxWidth: 800, margin: "0 auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <Alert
              message="连接错误"
              description={`无法连接到服务器: ${error}`}
              type="error"
              showIcon
            />
          ) : (
            <>
              <Title level={4} style={{ color: statusOk ? "green" : "red" }}>
                服务器状态: {status}
              </Title>
              <Paragraph>
                {statusOk
                  ? "服务器运行正常，所有服务可用。"
                  : "服务器可能存在问题，请检查服务器日志。"}
              </Paragraph>
            </>
          )}
        </Card>
      </Content>
    </Layout>
  );
}

export default StatusPage;

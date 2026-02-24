import { useEffect, useState } from "react";
import { Layout, Table, Typography } from "antd";
import axios from "axios";
import "./App.css";
import CodeBlock from "./CodeBlock";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [status, setStatus] = useState("");
  const [statusOk, setStatusOk] = useState(false);
  const [snips, setSnips] = useState(
    [] as { language: string; snip: string; key: number }[],
  );
  const snipTitle = [
    {
      title: "Snip",
      dataIndex: "snip",
      key: "snip",
      render: (text: string, record: { language: string }) => (
        <CodeBlock
          language={record.language.toLowerCase()}
          codeString={text}
        ></CodeBlock>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      render: (text: string) => <a>{text}</a>,
    },
  ];
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

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/snippets")
      .then((res) => {
        let snips = res.data.snips;
        let tmpS = [];
        for (let i = 0; i < snips.length; i++) {
          tmpS.push({
            key: i,
            snip: snips[i].snip,
            language: snips[i].lang,
          });
        }
        setSnips(tmpS);
      })
      .catch((_err) => {
        setSnips([]);
        console.log(_err);
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
        <Title level={4} style={{ color: statusOk ? "green" : "red" }}>
          Server Status: {status}
        </Title>
        <Table columns={snipTitle} dataSource={snips} bordered={true} />
      </Content>
    </Layout>
  );
}

export default App;

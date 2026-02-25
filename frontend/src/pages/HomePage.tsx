import { useEffect, useState } from "react";
import { Layout, Table, Typography, Button, message } from "antd";
import axios from "axios";
import CodeBlock from "../CodeBlock";

const { Header, Content } = Layout;
const { Title } = Typography;

function HomePage() {
  const [snips, setSnips] = useState(
    [] as { language: string; snip: string; key: number }[],
  );
  const [loading, setLoading] = useState<boolean>(false);

  const description = "Store, organize, and share your code snippets with ease.";

  const fetchSnippets = () => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((err) => {
        setSnips([]);
        console.log(err);
        message.error("获取代码片段失败");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

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
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={fetchSnippets} loading={loading}>
            刷新代码片段
          </Button>
        </div>
        <Table 
          columns={snipTitle} 
          dataSource={snips} 
          bordered={true}
          loading={loading}
        />
      </Content>
    </Layout>
  );
}

export default HomePage;

import { useEffect, useState } from "react";
import { Layout, Table, Button, message, Tag } from "antd";
import axios from "axios";
import CodeBlock from "../CodeBlock";

const { Header, Content } = Layout;

function HomePage() {
  const [snips, setSnips] = useState(
    [] as { language: string; snip: string; key: number }[],
  );
  const [loading, setLoading] = useState<boolean>(false);

  const description =
    "Store, organize, and share your code snippets with ease.";

  const fetchSnippets = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/api/snippets");
      const snips = res.data.snips;
      const tmpS = [];
      for (let i = 0; i < snips.length; i++) {
        tmpS.push({
          key: i,
          snip: snips[i].snip,
          language: snips[i].lang,
          tags: snips[i].tags,
        });
      }
      setSnips(tmpS);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSnips([]);
        console.log(err);
        message.error("获取代码片段失败");
      }
    } finally {
      setLoading(false);
    }
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
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (text: string[]) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {text.map((tag, index) => {
            const colors = [
              "magenta",
              "red",
              "volcano",
              "orange",
              "gold",
              "lime",
              "green",
              "cyan",
              "blue",
              "geekblue",
              "purple",
            ];
            const color = colors[index % colors.length];
            return (
              <Tag
                key={tag}
                color={color}
                style={{
                  borderRadius: "4px",
                  padding: "4px 12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  margin: 0,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  cursor: "default",
                  transition: "all 0.3s ease",
                }}
              >
                {tag}
              </Tag>
            );
          })}
        </div>
      ),
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
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
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

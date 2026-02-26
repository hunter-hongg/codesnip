import { Alert, Button, Input, Layout, Select, Tag } from "antd";
import CodeEditor from "../CodeEditor";
import { useState } from "react";
import axios from "axios";

const { Header, Content } = Layout;

function AddPage() {
  const [addResult, setAddResult] = useState<boolean | null>(null);
  const [addResultMsg, setAddResultMsg] = useState<string>("");
  const [codeSnippet, setCodeSnippet] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState<string>("");
  const options = [
    "Python",
    "TypeScript",
    "C",
    "Cpp",
    "Java",
    "JavaScript",
    "HTML",
    "CSS",
    "JSON",
    "Lua",
    "Dart",
    "Rust",
    "Go",
    "Kotlin",
    "PHP",
    "Perl",
    "R",
    "Fortran",
    "OCaml",
    "Haskell",
    "Vue",
    "XML",
    "Markdown",
  ];
  let options_real = [];
  for (let i = 0; i < options.length; i++) {
    options_real.push({
      label: options[i],
      value: options[i].toLowerCase(),
    });
  }
  let [currentLanguage, setCurrentLanguage] = useState<string>("python");

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
        <div style={{ fontSize: "22px", fontWeight: "bold" }}>
          CodeSnip - 添加片段
        </div>
      </Header>
      <Content style={{ padding: "50px" }}>
        {addResult === true ? (
          <Alert message={addResultMsg} type="success" />
        ) : (
          addResult === false && (
            <Alert message={addResultMsg} type="error" />
          )
        )}
        <div style={{ height: "20px" }}></div>
        <Select
          style={{
            minWidth: "200px",
            fontSize: "18px",
          }}
          placeholder="请选择语言"
          options={options_real}
          onChange={(val) => {
            setCurrentLanguage(val);
          }}
          allowClear
        />
        <div style={{ height: "20px" }}></div>
        <div style={{
          backgroundColor: "#f5f5f5",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #e8e8e8",
          marginBottom: "20px"
        }}>
          <div style={{ 
            marginBottom: "12px", 
            fontSize: "16px", 
            fontWeight: 500,
            color: "#333"
          }}>
            添加标签
          </div>
          <div style={{
            display: "flex", 
            flexWrap: "wrap", 
            gap: "10px",
            alignItems: "center"
          }}>
            {tags.map((tag, index) => (
              <Tag
                key={index}
                closable
                onClose={() => {
                  const newTags = [...tags];
                  newTags.splice(index, 1);
                  setTags(newTags);
                }}
                style={{
                  fontSize: "14px",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  background: "#1890ff",
                  color: "white",
                  border: "none"
                }}
              >
                {tag}
              </Tag>
            ))}
            <Input
              style={{ 
                width: 200,
                borderRadius: "4px",
                fontSize: "14px"
              }}
              placeholder="输入标签后按回车添加"
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onPressEnter={(e) => {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value && !tags.includes(value)) {
                  setTags([...tags, value]);
                  setInputTag("");
                }
              }}
            />
          </div>
          <div style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#999"
          }}>
            提示：按回车键添加标签，点击标签上的×删除标签
          </div>
        </div>
        <div style={{ height: "20px" }}></div>
        <CodeEditor language={currentLanguage} value={codeSnippet} onChange={(value) => setCodeSnippet(value || "")} />
        <div style={{ height: "20px" }}></div>
        <Button
          style={{ fontSize: "18px" }}
          onClick={async () => {
            try {
              let res = await axios.post("http://localhost:8081/api/add_snippets", {
                id: 0,
                snip: codeSnippet,
                lang: currentLanguage,
                tags: tags,
              });
              if ((res.status == 200) || (res.status == 201)) {
                setAddResult(true);
                setAddResultMsg("添加成功");
              } else {
                setAddResult(false);
                setAddResultMsg(`添加失败，状态码：${res.status}，响应数据：${JSON.stringify(res.data.error)}`);
              }
            } catch (err: any) {
              setAddResult(false);
              setAddResultMsg(`添加失败，错误信息：${err.message}`);
            }
          }}
        >
          添加片段
        </Button>
      </Content>
    </Layout>
  );
}

export default AddPage;

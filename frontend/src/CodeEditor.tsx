import React from 'react';
import Editor from '@monaco-editor/react';

// 定义 Props 类型
interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string; // 如 'typescript', 'javascript', 'json', 'html'
  height?: string | number;
  theme?: 'light' | 'vs-dark';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'typescript',
  height = '300px',
  theme = 'vs-light',
}) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false }, // 关闭右侧小地图
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true, // 自适应容器大小
          scrollBeyondLastLine: false,
          padding: { top: 10, bottom: 10 },
        }}
      />
    </div>
  );
};

export default CodeEditor;
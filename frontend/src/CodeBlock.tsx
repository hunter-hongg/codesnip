import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  codeString: string;
}

const CodeBlock = ({language, codeString}: CodeBlockProps) => {
  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
      <SyntaxHighlighter
        language={language} // 指定语言，例如 'javascript', 'python', 'java' 等
        style={materialLight} // 指定主题样式
        showLineNumbers={true} // 显示行号
        startingLineNumber={1} // 起始行号
        wrapLines={true} // 自动换行
        customStyle={{ fontSize: '14px' }} // 自定义样式
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

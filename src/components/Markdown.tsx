import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// react-markdown은 기본적으로 HTML 태그를 그대로 실행하지 않아 안전합니다.
export default function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

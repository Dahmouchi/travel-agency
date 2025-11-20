"use client";

import { useEffect, useState } from "react";
import createDOMPurify from "dompurify";

interface SafeHTMLProps {
  html: string;
  className?: string;
}

const SafeHTML = ({ html, className }: SafeHTMLProps) => {
  const [cleanHTML, setCleanHTML] = useState("");

  useEffect(() => {
    const DOMPurify = createDOMPurify(window);

    // Replace empty paragraphs with <br />
    const htmlWithBreaks = html.replace(/<p>\s*<\/p>/g, "<br />");

    setCleanHTML(DOMPurify.sanitize(htmlWithBreaks));
  }, [html]);

  return (
    <div
      className={`text-black whitespace-pre-line ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};

export default SafeHTML;

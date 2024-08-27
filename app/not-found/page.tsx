export default function Custom404() {
  return (
    <div>
      <h1>404 - 頁面未找到</h1>
      <p>抱歉，您請求的頁面不存在。</p>
      <p>
        請求的 URL:{" "}
        {typeof window !== "undefined" ? window.location.pathname : "未知"}
      </p>
    </div>
  );
}

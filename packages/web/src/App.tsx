import { Routes, Route, Navigate } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import PreviewPage from "./pages/PreviewPage";

export default function App() {
  return (
    <Routes>
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="*" element={<Navigate to="/editor" replace />} />
    </Routes>
  );
}

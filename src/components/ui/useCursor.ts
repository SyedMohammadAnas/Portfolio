import { useContext } from "react";
import { CursorContext, CursorType } from "./CursorContext";

// useCursor hook for easy cursor state management
export function useCursor() {
  const { setCursorType } = useContext(CursorContext);
  return setCursorType;
}

// Optionally, a hook to get the current cursor type
export function useCursorType(): CursorType {
  const { cursorType } = useContext(CursorContext);
  return cursorType;
}

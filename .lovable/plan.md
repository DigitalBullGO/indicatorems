

## Bug Analysis: AI Prompt Templates Not Displaying Pre-filled Prompts

### Root Cause

The `AIPromptModal` component has a state initialization bug. The `handleOpenChange` function sets `setPrompt(template.prompt)` only when `isOpen` is `true`, but this function is the Dialog's `onOpenChange` callback — it only fires when the dialog state changes **internally** (e.g., clicking the close button or overlay). When the modal first opens via `setSelectedAI(t)` (which sets `open={!!selectedAI}` to `true`), the `onOpenChange` callback is **not** triggered by Radix Dialog for the initial controlled open. The prompt remains as the initial empty string `""`.

Additionally, the **Copy** and **Eye** buttons on AI prompt cards have **no click handlers** — they are purely decorative and do nothing.

### Fix Plan

**File: `src/components/templates/AIPromptModal.tsx`**

- Add a `useEffect` that watches `template` and `open` — when both are truthy, set `prompt` to `template.prompt` and reset other state fields. This ensures the prompt is populated regardless of how the dialog opens.

```
useEffect(() => {
  if (open && template) {
    setPrompt(template.prompt);
    setOutput("");
    setFile(null);
    setDateFilter("");
  }
}, [open, template]);
```

- Simplify `handleOpenChange` to just pass through to `onOpenChange` (no state setting needed there anymore).

**File: `src/pages/Templates.tsx`**

- **Copy button**: Add an `onClick` handler that copies the template's prompt text to the clipboard using `navigator.clipboard.writeText()` and shows a success toast.
- **Eye button**: For AI prompt cards, add an `onClick` that opens the `AIPromptModal` in a read-only or preview fashion (same as "Use Template" — open the modal so the user can see the prompt).

### Changes Summary

| File | Change |
|------|--------|
| `src/components/templates/AIPromptModal.tsx` | Add `useEffect` to sync prompt state when `open`/`template` change |
| `src/pages/Templates.tsx` | Add `onCopy` and `onPreview` callbacks to `TemplateCard` for AI prompt cards; wire Copy button to clipboard + toast; wire Eye button to open the modal |


import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

// Тёмной темы у Lantern пока нет (решение 2026-06-11) — когда появится
// дизайн, вернуть withThemeByClassName из @storybook/addon-themes.
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;

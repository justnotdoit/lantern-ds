export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background text-foreground">
      <h1 className="text-2xl font-semibold">Lantern Design System</h1>
      <p className="text-muted-foreground">
        Browse components in Storybook · install via{" "}
        <code>npx shadcn add @lantern/&lt;name&gt;</code>
      </p>
    </main>
  );
}

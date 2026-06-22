/**
 * ПРИНЯТЫЕ РЕШЕНИЯ ПО САЙДБАРУ (дизайн-ревью с Alex, 2026-06-12).
 * Перед любой правкой сверяйся со списком; после правки — прогони
 * регрессионный замер (getBoundingClientRect) в обоих состояниях.
 *
 * 1. Типографика пунктов и агентов: paragraph small regular (text-sm/20, 400).
 * 2. Цвет текста пунктов и агентов: --foreground. Иконки: --muted-foreground.
 * 3. Цвета текста/иконок НЕ меняются на hover/active — меняется только фон.
 * 4. Активный пункт один; ellipsis у активного агента виден постоянно, у остальных —
 *    по hover (справа). Статус-иконка агента — СЛЕВА от названия (п.8); chip-иконок
 *    слева больше нет (обновление 2026-06-17, Figma node 9342:1399).
 *    Подсветка строки — на group-hover/menu-item (не на :hover кнопки): ellipsis —
 *    absolute-сосед, поэтому при наведении на него :hover кнопки спадал и подсветка
 *    пропадала. Теперь строка подсвечена, пока курсор где угодно в строке.
 * 5. Колонка иконок: x=22 (центр 30) в ОБОИХ состояниях — иконки не двигаются
 *    при сворачивании; контент px-2.5 + кнопка px-3; rail 60px.
 * 6. Логотип absolute (не толкает триггер), центр по колонке иконок; триггер
 *    по правой колонке (троеточия/статусы, cx=234), shrink-0.
 * 7. Сворачивание плавное: текст и группы агентов фейдятся (200ms), без
 *    display:none и мгновенных перестроек.
 * 8. Статус-иконки агентов 16px, СЛЕВА от названия внутри pill-кнопки (gap-2): обёртка
 *    задаёт [&>svg]:size-4, цвет — на самой иконке. in-progress=muted-foreground (loader,
 *    spin), failed=destructive, needs-attention=yellow-600. Recent-агенты без статуса.
 */
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  AccountsIcon,
  AdLibraryIcon,
  AgentsIcon,
  CircleQuestionMark,
  ContactsIcon,
  Ellipsis,
  IdeasIcon,
  LanternLogoIcon,
  LoaderCircle,
  NewAgentIcon,
  SequencingIcon,
  SkillsLibraryIcon,
  TriangleAlert,
} from "@/registry/default/icons";

const NAV_ITEMS = [
  { id: "nav-agents", label: "Agents", icon: AgentsIcon },
  { id: "nav-ideas", label: "Ideas", icon: IdeasIcon },
  { id: "nav-skills", label: "Skills Library", icon: SkillsLibraryIcon },
  { id: "nav-sequencing", label: "Sequencing", icon: SequencingIcon },
  { id: "nav-accounts", label: "Accounts", icon: AccountsIcon },
  { id: "nav-contacts", label: "Contacts", icon: ContactsIcon },
  { id: "nav-ad-library", label: "Ad Library", icon: AdLibraryIcon },
];

interface AgentRowProps {
  label: string;
  status?: React.ReactNode;
  isActive: boolean;
  onSelect: () => void;
}

function AgentRow({ label, status, isActive, onSelect }: AgentRowProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        variant="pill"
        isActive={isActive}
        tooltip={label}
        onClick={onSelect}
        // group-hover/menu-item: keep the row highlighted while hovering the
        // ellipsis too (it's an absolute sibling, so the button's own :hover drops).
        className="gap-2 group-hover/menu-item:bg-sidebar-accent"
      >
        {status && (
          <span className="flex shrink-0 items-center justify-center [&>svg]:size-4 [&>svg]:shrink-0">
            {status}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">{label}</span>
      </SidebarMenuButton>
      <SidebarMenuAction showOnHover={!isActive} className="right-3 w-4 rounded-full">
        <Ellipsis />
        <span className="sr-only">More</span>
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}

interface AgentConfig {
  id: string;
  label: string;
  status?: React.ReactNode;
}

const BUILDING_AGENTS: AgentConfig[] = [
  {
    id: "agent-retail",
    label: "Retail champions",
    status: <LoaderCircle className="animate-spin text-muted-foreground" />,
  },
  {
    id: "agent-hggt-1",
    label: "High Growth Global 2000",
    status: <TriangleAlert className="text-destructive" />,
  },
  {
    id: "agent-hggt-2",
    label: "High Growth Global 2000",
    status: <CircleQuestionMark className="text-yellow-600" />,
  },
];

const RECENT_AGENTS: AgentConfig[] = [
  {
    id: "agent-pipeline",
    label: "Pipeline Enrichment with a very long name",
  },
  {
    id: "agent-weekly",
    label: "Weekly Agentic AI",
  },
  {
    id: "agent-inbound",
    label: "Real-Time Inbound",
  },
];

function DemoSidebar({ defaultOpen }: { defaultOpen: boolean }) {
  const [activeId, setActiveId] = useState("agent-pipeline");

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="relative justify-end">
          {/* absolute: невидимый логотип не должен занимать место и толкать
              триггер; left-5 центрирует 20px-глиф по колонке иконок (x=30) */}
          <LanternLogoIcon
            size={20}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-primary transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0"
          />
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {/* New Agent and the nav live in separate menus so the separator is
                a child of the group, not of a <ul> (a <ul> may only contain <li>;
                a role=none separator inside it fails the a11y "list" rule).
                Both group and menu are flex-col gap-1, so spacing is unchanged. */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton variant="pill" tooltip="New Agent">
                  <NewAgentIcon />
                  <span>New Agent</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator />
            <SidebarMenu>
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    tooltip={label}
                    isActive={activeId === id}
                    onClick={() => setActiveId(id)}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="transition-opacity duration-200 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0">
            <SidebarGroupLabel>Building</SidebarGroupLabel>
            <SidebarMenu>
              {BUILDING_AGENTS.map((agent) => (
                <AgentRow
                  key={agent.id}
                  label={agent.label}
                  status={agent.status}
                  isActive={activeId === agent.id}
                  onSelect={() => setActiveId(agent.id)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="transition-opacity duration-200 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0">
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            <SidebarMenu>
              {RECENT_AGENTS.map((agent) => (
                <AgentRow
                  key={agent.id}
                  label={agent.label}
                  status={agent.status}
                  isActive={activeId === agent.id}
                  onSelect={() => setActiveId(agent.id)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
          Application content. Toggle the sidebar with the header button or ⌘B. Click items to move
          the active state.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const meta = {
  title: "UI/Sidebar",
  component: DemoSidebar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DemoSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: { defaultOpen: true },
};

export const CollapsedIconRail: Story = {
  args: { defaultOpen: false },
};

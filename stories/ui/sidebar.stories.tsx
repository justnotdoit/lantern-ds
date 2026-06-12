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
  Goal,
  IdeasIcon,
  LanternLogoIcon,
  Leaf,
  LoaderCircle,
  NewAgentIcon,
  Send,
  SequencingIcon,
  Settings2,
  SkillsLibraryIcon,
  TriangleAlert,
  UserRoundSearch,
  WandSparkles,
} from "@/registry/default/icons";

const NAV_ITEMS = [
  { label: "Agents", icon: AgentsIcon },
  { label: "Ideas", icon: IdeasIcon },
  { label: "Skills Library", icon: SkillsLibraryIcon },
  { label: "Sequencing", icon: SequencingIcon },
  { label: "Accounts", icon: AccountsIcon },
  { label: "Contacts", icon: ContactsIcon },
  { label: "Ad Library", icon: AdLibraryIcon },
];

function CategoryChip({
  icon: Icon,
  className,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  className: string;
}) {
  return (
    <span className={`flex size-5 shrink-0 items-center justify-center rounded-xl ${className}`}>
      <Icon size={12} />
    </span>
  );
}

function AgentRow({
  label,
  chip,
  chipClassName,
  status,
  isActive,
}: {
  label: string;
  chip: React.ComponentType<{ size?: number | string; className?: string }>;
  chipClassName: string;
  status?: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton variant="pill" isActive={isActive} tooltip={label} className="text-foreground">
        <CategoryChip icon={chip} className={chipClassName} />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {status}
      </SidebarMenuButton>
      <SidebarMenuAction showOnHover className="rounded-full">
        <Ellipsis />
        <span className="sr-only">More</span>
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}

function DemoSidebar({ defaultOpen }: { defaultOpen: boolean }) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
          <LanternLogoIcon size={20} className="text-primary group-data-[collapsible=icon]:hidden" />
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton variant="pill" tooltip="New Agent" className="text-foreground">
                  <NewAgentIcon />
                  <span>New Agent</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator />
              {NAV_ITEMS.map(({ label, icon: Icon }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton tooltip={label}>
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Building</SidebarGroupLabel>
            <SidebarMenu>
              <AgentRow
                label="Retail champions"
                chip={Leaf}
                chipClassName="bg-lime-100 text-foreground"
                status={<LoaderCircle className="ml-auto shrink-0 animate-spin text-muted-foreground" />}
              />
              <AgentRow
                label="High Growth Global 2000"
                chip={Settings2}
                chipClassName="bg-cyan-100 text-foreground"
                status={<TriangleAlert className="ml-auto shrink-0 text-destructive" />}
              />
              <AgentRow
                label="High Growth Global 2000"
                chip={Goal}
                chipClassName="bg-orange-100 text-foreground"
                status={<CircleQuestionMark className="ml-auto shrink-0 text-amber-500" />}
              />
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            <SidebarMenu>
              <AgentRow
                label="Pipeline Enrichment with a very long name"
                chip={WandSparkles}
                chipClassName="bg-blue-100 text-foreground"
                isActive
              />
              <AgentRow
                label="Weekly Agentic AI"
                chip={Send}
                chipClassName="bg-yellow-100 text-foreground"
              />
              <AgentRow
                label="Real-Time Inbound"
                chip={UserRoundSearch}
                chipClassName="bg-gray-100 text-foreground"
              />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
          Application content. Toggle the sidebar with the header button or ⌘B.
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

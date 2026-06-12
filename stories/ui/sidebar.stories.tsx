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

function LanternLogo() {
  return (
    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      L
    </span>
  );
}

function DemoSidebar({ defaultOpen }: { defaultOpen: boolean }) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
          <span className="group-data-[collapsible=icon]:hidden">
            <LanternLogo />
          </span>
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

          <SidebarGroup>
            <SidebarGroupLabel>Building</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton variant="pill" tooltip="Retail champions" className="text-foreground">
                  <CategoryChip icon={Leaf} className="bg-lime-100 text-foreground" />
                  <span>Retail champions</span>
                  <LoaderCircle className="ml-auto shrink-0 animate-spin text-muted-foreground" />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  variant="pill"
                  tooltip="High Growth Global 2000"
                  className="text-foreground"
                >
                  <CategoryChip icon={Settings2} className="bg-cyan-100 text-foreground" />
                  <span>High Growth Global 2000</span>
                  <TriangleAlert className="ml-auto shrink-0 text-destructive" />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  variant="pill"
                  tooltip="High Growth Global 2000"
                  className="text-foreground"
                >
                  <CategoryChip icon={Goal} className="bg-orange-100 text-foreground" />
                  <span>High Growth Global 2000</span>
                  <CircleQuestionMark className="ml-auto shrink-0 text-amber-500" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton variant="pill" isActive tooltip="Pipeline Enrichment" className="text-foreground">
                  <CategoryChip icon={WandSparkles} className="bg-blue-100 text-foreground" />
                  <span>Pipeline Enrichment with a very long name</span>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover className="rounded-full">
                  <Ellipsis />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton variant="pill" tooltip="Weekly Agentic AI" className="text-foreground">
                  <CategoryChip icon={Send} className="bg-yellow-100 text-foreground" />
                  <span>Weekly Agentic AI</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton variant="pill" tooltip="Real-Time Inbound" className="text-foreground">
                  <CategoryChip icon={UserRoundSearch} className="bg-gray-100 text-foreground" />
                  <span>Real-Time Inbound</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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

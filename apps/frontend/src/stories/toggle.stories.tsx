// [build] library: 'shadcn'
import { Toggle } from "../components/ui/toggle";
import { Bold, Italic } from "lucide-react";


const meta = {
  title: "ui/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {},
};
export default meta;

export const Default = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
  args: {},
};

export const Outline = {
  render: () => (
    <Toggle aria-label="Toggle italic" variant="outline">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
  args: {},
};

export const WithText = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
      Italic
    </Toggle>
  ),
  args: {},
};

export const Small = {
  render: () => (
    <Toggle size="sm" aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
  args: {},
};

export const Large = {
  render: () => (
    <Toggle size="lg" aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
  args: {},
};

export const Destructive = {
  render: () => (
    <Toggle aria-label="Toggle bold" disabled>
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
  args: {
    variant: "destructive",
  },
};

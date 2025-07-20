

import { useState } from "react"
import { Combobox } from "@/components/ui/combobox"

export function ComboboxDemo() {
  const [value, setValue] = useState("")

  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ]

  return (
    <div className="w-[400px] p-4">
      <h2 className="text-xl font-semibold mb-4">Framework Selector</h2>
      <Combobox
        options={frameworks}
        value={value}
        onChange={setValue}
        placeholder="Select a framework..."
        searchPlaceholder="Search frameworks..."
      />
      <div className="mt-4 text-sm text-gray-600">
        Selected: {value ? frameworks.find(f => f.value === value)?.label : "None"}
      </div>
    </div>
  )
}

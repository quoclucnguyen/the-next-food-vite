type OverviewCardProps = Readonly<{
  title: string
  value: number
}>

export function OverviewCard({ title, value }: OverviewCardProps) {
  return (
    <div className='rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm'>
      <p className='text-xs uppercase text-gray-500'>{title}</p>
      <p className='mt-1 text-2xl font-semibold text-gray-900'>{value}</p>
    </div>
  )
}

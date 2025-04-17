export default function DashboardSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md p-4 space-y-4">
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-2/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4 animate-pulse"></div>
      </div>
    </div>
  )
}

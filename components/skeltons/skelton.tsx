export function BlogSkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-56 bg-gray-200" />

          <div className="p-5 space-y-3">
            {/* Date */}
            <div className="h-4 w-32 bg-gray-200 rounded" />

            {/* Title */}
            <div className="h-5 w-3/4 bg-gray-300 rounded" />

            {/* Description lines */}
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlogDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 md:py-14 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-48 bg-gray-200 rounded mb-6" />

      <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
        {/* Main Blog Skeleton */}
        <div>
          {/* Title */}
          <div className="h-8 w-3/4 bg-gray-300 rounded mb-3" />

          {/* Meta */}
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-6" />

          {/* Course badge */}
          <div className="h-6 w-28 bg-gray-300 rounded mb-4" />

          {/* Image */}
          <div className="w-full h-[380px] bg-gray-200 rounded-lg mb-6" />

          {/* Content lines */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
            <div className="h-4 w-10/12 bg-gray-200 rounded" />
            <div className="h-4 w-9/12 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
          </div>
        </div>

        {/* Recent Blogs Skeleton */}
        <div>
          <div className="h-6 w-40 bg-gray-300 rounded mb-5" />

          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg"
              >
                <div className="w-20 h-16 bg-gray-200 rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-300 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CourseSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-4"
        >
          {/* Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full" />

          {/* Title */}
          <div className="h-5 w-3/4 bg-gray-300 rounded" />

          {/* Description */}
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function CourseCategorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-64 bg-gray-200 rounded mb-6" />

      {/* Title */}
      <div className="h-8 w-1/3 bg-gray-300 rounded mx-auto mb-2" />

      {/* Subtitle */}
      <div className="h-4 w-40 bg-gray-200 rounded mx-auto mb-10" />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-2xl overflow-hidden shadow-md flex flex-col"
          >
            {/* Image */}
            <div className="w-full h-44 bg-gray-200" />

            {/* Content */}
            <div className="flex flex-col justify-between flex-grow p-5 space-y-3">
              <div className="h-5 w-3/4 bg-gray-300 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />

              <div className="flex justify-between items-center pt-5">
                <div className="h-4 w-20 bg-gray-300 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseDetailsSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Hero Section */}
      <div className="relative md:py-16 py-8 px-6 md:px-12 bg-gray-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          <div className="md:w-[60%] space-y-4">
            {/* Breadcrumb */}
            <div className="h-4 w-72 bg-gray-400 rounded" />

            {/* Rating */}
            <div className="h-4 w-20 bg-gray-400 rounded" />

            {/* Title */}
            <div className="h-10 w-3/4 bg-gray-200 rounded" />

            {/* Description */}
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />

            {/* Info Box */}
            <div className="bg-white rounded-3xl px-10 py-6 w-full md:w-[60%] space-y-4">
              <div className="flex gap-8">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-300 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-300 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-10 bg-gray-300 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Button */}
              <div className="h-10 w-40 bg-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-32 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-11/12 bg-gray-200 rounded" />
          <div className="h-4 w-10/12 bg-gray-200 rounded" />

          <div className="h-6 w-32 bg-gray-300 rounded mt-6" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-4/6 bg-gray-200 rounded" />
        </div>

        {/* Right */}
        <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
          <div className="h-6 w-40 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />

          <div className="h-6 w-32 bg-gray-300 rounded mt-4" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}


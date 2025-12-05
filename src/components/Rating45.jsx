export default function Rating45() {
  return (
    <div className="flex items-center gap-1">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 1.5l2.9 5.8 6.4.9-4.6 4.5 1.1 6.4L10 15.8l-5.8 3 1.1-6.4L.7 8.2l6.4-.9L10 1.5z" />
          </svg>
        ))}

      {/* Half star */}
      <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="lightgray" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half)"
          d="M10 1.5l2.9 5.8 6.4.9-4.6 4.5 1.1 6.4L10 15.8l-5.8 3 1.1-6.4L.7 8.2l6.4-.9L10 1.5z"
        />
      </svg>
    </div>
  );
}

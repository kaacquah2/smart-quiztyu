import { ExternalLink } from "lucide-react"

export function RecommendedResources() {
  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <p className="font-medium">Python Data Structures</p>
        <p className="text-sm text-muted-foreground mt-1">
          A comprehensive guide to data structures in Python with examples.
        </p>
        <a href="#" className="text-sm text-primary inline-flex items-center gap-1 mt-1 hover:underline">
          View Resource <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="border-b pb-2">
        <p className="font-medium">Linear Algebra for Computer Science</p>
        <p className="text-sm text-muted-foreground mt-1">
          Learn the fundamentals of linear algebra applied to computer science problems.
        </p>
        <a href="#" className="text-sm text-primary inline-flex items-center gap-1 mt-1 hover:underline">
          View Resource <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div>
        <p className="font-medium">Introduction to Algorithms</p>
        <p className="text-sm text-muted-foreground mt-1">
          A video course covering fundamental algorithms and their implementations.
        </p>
        <a href="#" className="text-sm text-primary inline-flex items-center gap-1 mt-1 hover:underline">
          View Resource <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

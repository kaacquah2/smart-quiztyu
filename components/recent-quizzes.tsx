export function RecentQuizzes() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div>
          <p className="font-medium">Introduction to Programming (Python)</p>
          <p className="text-sm text-muted-foreground">Completed 2 days ago</p>
        </div>
        <div className="text-right">
          <p className="font-medium">85%</p>
          <p className="text-xs text-muted-foreground">8/10 correct</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-b pb-2">
        <div>
          <p className="font-medium">Mathematics for Computer Science</p>
          <p className="text-sm text-muted-foreground">Completed 5 days ago</p>
        </div>
        <div className="text-right">
          <p className="font-medium">70%</p>
          <p className="text-xs text-muted-foreground">7/10 correct</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Fundamentals of Computing</p>
          <p className="text-sm text-muted-foreground">Completed 1 week ago</p>
        </div>
        <div className="text-right">
          <p className="font-medium">90%</p>
          <p className="text-xs text-muted-foreground">9/10 correct</p>
        </div>
      </div>
    </div>
  )
}

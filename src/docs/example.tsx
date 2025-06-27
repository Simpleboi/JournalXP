// This is for example purposes

// export const Example = () => {
//     return()
// }

{/* <Card>
  <CardHeader>
    <CardTitle className="text-lg text-indigo-700">
      {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
    </CardTitle>
    <CardDescription>
      {selectedDate && calendarEntries[selectedDayKey]
        ? `${calendarEntries[selectedDayKey].length} entries found`
        : "No entries for this date"}
    </CardDescription>
  </CardHeader>
  <CardContent className="max-h-[400px] overflow-y-auto">
    {selectedDate && calendarEntries[selectedDayKey] ? (
      <div className="space-y-4">
        {calendarEntries[selectedDayKey].map((entry) => (
          <Card key={entry.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="capitalize">
                      {entry.type.replace("-", " ")}
                    </Badge>
                    <Badge className={getSentimentColor(entry.sentiment)}>
                      {entry.sentiment?.label || "No sentiment"}
                    </Badge>
                    <span className="text-lg">{getMoodIcon(entry.mood)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    entry.isFavorite ? "text-yellow-500" : "text-gray-400"
                  }
                  onClick={() => onToggleFavorite(entry.id)}
                >
                  <Star className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-3">
                <p className="text-gray-800">
                  {entry.content.length > 100
                    ? `${entry.content.substring(0, 100)}...`
                    : entry.content}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {entry.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 bg-blue-50"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    ) : (
      <div className="text-center py-10 text-gray-500">
        <p>No entries found for this date.</p>
        <p className="mt-2 text-sm">
          Select a different date or create a new entry.
        </p>
      </div>
    )}
  </CardContent>
</Card>; */}

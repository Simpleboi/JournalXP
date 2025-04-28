import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchFilterControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterMood: string;
  setFilterMood: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  filterTag: string;
  setFilterTag: (value: string) => void;
  allTags: string[];
}

const SearchFilterControls = ({
  searchTerm,
  setSearchTerm,
  filterMood,
  setFilterMood,
  filterType,
  setFilterType,
  filterTag,
  setFilterTag,
  allTags,
}: SearchFilterControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search journal entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <Select value={filterMood} onValueChange={setFilterMood}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Filter by mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Moods</SelectItem>
            <SelectItem value="happy">Happy</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="sad">Sad</SelectItem>
            <SelectItem value="anxious">Anxious</SelectItem>
            <SelectItem value="calm">Calm</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="free-writing">Free Writing</SelectItem>
            <SelectItem value="guided">Guided</SelectItem>
            <SelectItem value="gratitude">Gratitude</SelectItem>
          </SelectContent>
        </Select>

        {allTags.length > 0 && (
          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default SearchFilterControls;

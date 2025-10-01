
// a function that returns the color of the category
export const GetCategoryColor = (category: string) => {
    switch (category) {
      case "mindfulness":
        return "bg-blue-100 text-blue-800";
      case "journaling":
        return "bg-purple-100 text-purple-800";
      case "streak":
        return "bg-orange-100 text-orange-800";
      case "community":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
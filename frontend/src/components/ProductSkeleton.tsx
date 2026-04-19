import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const ProductSkeleton = () => {
  return (
    <Card className="border-none">
      <CardContent>
        <Skeleton className="bg-primary/10 rounded w-full h-72" />
      </CardContent>

      <div className="px-2 space-y-2">
        <Skeleton className="bg-primary/10 h-5 w-3/4" /> {/* productName */}
        <Skeleton className="bg-primary/10 h-4 w-full" /> {/* description line 1 */}
        <Skeleton className="bg-primary/10 h-4 w-5/6" /> {/* description line 2 */}
      </div>

      <CardFooter className="flex gap-2 p-2 items-center">
        <Skeleton className="bg-primary/10 h-10 w-10 rounded-md" /> {/* minus btn */}
        <Skeleton className="bg-primary/10 h-6 w-6" /> {/* quantity */}
        <Skeleton className="bg-primary/10 h-10 w-10 rounded-md" /> {/* plus btn */}
        <Skeleton className="bg-primary/10 h-6 w-16 ml-auto" /> {/* price */}
      </CardFooter>
    </Card>
  );
};

export default ProductSkeleton;
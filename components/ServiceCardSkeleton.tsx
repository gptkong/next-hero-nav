import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function ServiceCardSkeleton() {
  return (
    <Card className="w-full" shadow="sm">
      <CardBody className="p-4 sm:p-6 text-center">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center w-full">
            <Skeleton className="w-3/4 h-5 sm:h-6 rounded-lg">
              <div className="h-5 sm:h-6 rounded-lg bg-default-300"></div>
            </Skeleton>
            <Skeleton className="w-12 h-5 rounded-lg ml-2 shrink-0">
              <div className="h-5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-center">
            <Skeleton className="w-16 h-5 rounded-lg">
              <div className="h-5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-16 h-5 rounded-lg">
              <div className="h-5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
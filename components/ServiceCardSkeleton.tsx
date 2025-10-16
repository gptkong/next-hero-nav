import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function ServiceCardSkeleton() {
  return (
    <Card className="w-full" shadow="sm">
      {/* 卡片头部骨架 */}
      <CardHeader className="pb-3 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Skeleton className="w-3/4 h-5 sm:h-6 rounded-lg">
              <div className="h-5 sm:h-6 rounded-lg bg-default-300"></div>
            </Skeleton>
            <Skeleton className="w-12 h-5 rounded-lg shrink-0">
              <div className="h-5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
          <Skeleton className="w-20 h-5 rounded-lg shrink-0">
            <div className="h-5 rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>
      </CardHeader>

      <CardBody className="pt-0 pb-4 px-4 sm:px-6 sm:pb-6">
        <div className="flex flex-col gap-3">
          {/* 网络信息区域骨架 */}
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-10 rounded-lg">
              <div className="h-10 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>

          {/* 系统信息区域骨架 */}
          <div className="flex gap-2 items-center">
            <Skeleton className="w-16 h-5 rounded-lg">
              <div className="h-5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-16 h-5 rounded-lg">
              <div className="h-5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>

          {/* 操作按钮区域骨架 - 桌面端显示 */}
          <div className="hidden sm:flex gap-2 mt-2">
            <Skeleton className="flex-1 h-8 rounded-lg">
              <div className="h-8 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-8 h-8 rounded-lg shrink-0">
              <div className="h-8 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>

          {/* 移动端提示骨架 */}
          <div className="sm:hidden text-center mt-2">
            <Skeleton className="w-24 h-4 rounded-lg mx-auto">
              <div className="h-4 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
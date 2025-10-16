"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ButtonGroup } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { Badge } from "@heroui/badge";
import { Skeleton } from "@heroui/skeleton";
import { Input } from "@heroui/input";
import { LayoutGrid, List, RefreshCw, Search, Wifi, WifiOff } from "lucide-react";
import type { HomeGatewayItem } from "@/types/homegateway";
import { title } from "@/components/primitives";
import { useNetwork } from "@/contexts/NetworkContext";

type LayoutType = "card" | "list";

export default function Home() {
  const [data, setData] = useState<HomeGatewayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutType>("card");
  const [filterValue, setFilterValue] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof HomeGatewayItem;
    direction: "ascending" | "descending";
  }>({
    column: "Name",
    direction: "ascending",
  });
  const { networkType } = useNetwork();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/notion");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch data");
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 过滤和排序数据
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // 过滤
    if (filterValue) {
      filtered = filtered.filter((item) =>
        item.Name.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.IP.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.Hardware.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // 排序
    if (sortDescriptor.column) {
      filtered.sort((a, b) => {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    }

    return filtered;
  }, [data, filterValue, sortDescriptor]);

  const columns = [
    { key: "Name", label: "名称", sortable: true },
    { key: "IP", label: "IP地址", sortable: true },
    { key: "Internet", label: "互联网访问", sortable: false },
    { key: "localAddr", label: "本地地址", sortable: false },
    { key: "BasicAuth", label: "基础认证", sortable: false },
    { key: "Status", label: "状态", sortable: true },
    { key: "Virtualization", label: "虚拟化", sortable: true },
    { key: "Hardware", label: "硬件", sortable: true },
  ];

  const renderCell = (item: HomeGatewayItem, columnKey: keyof HomeGatewayItem) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "Name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{cellValue as string}</p>
          </div>
        );
      case "Internet":
      case "localAddr":
        return cellValue ? (
          <Link
            href={cellValue as string}
            isExternal
            showAnchorIcon
            size="sm"
            className="text-xs"
          >
            访问
          </Link>
        ) : (
          <span className="text-default-400 text-xs">-</span>
        );
      case "BasicAuth":
        return (
          <Chip
            color={cellValue ? "warning" : "success"}
            size="sm"
            variant="flat"
          >
            {cellValue ? "需要" : "不需要"}
          </Chip>
        );
      case "Status":
        return (
          <Chip
            color={cellValue === "启用" ? "success" : "danger"}
            size="sm"
            variant="dot"
          >
            {cellValue as string}
          </Chip>
        );
      case "Virtualization":
        return (
          <Chip color="secondary" size="sm" variant="flat">
            {cellValue as string || "-"}
          </Chip>
        );
      case "Hardware":
        return (
          <Chip color="primary" size="sm" variant="flat">
            {cellValue as string}
          </Chip>
        );
      default:
        return <span className="text-xs">{cellValue as string}</span>;
    }
  };

  const getCardUrl = (item: HomeGatewayItem) => {
    return networkType === "internet" ? item.Internet : item.localAddr;
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredAndSortedData.map((item) => {
        const url = getCardUrl(item);
        return (
          <Card
            key={item.Name}
            isPressable={!!url}
            isHoverable
            shadow="sm"
            className="w-full transition-all hover:shadow-md"
            onPress={() => {
              if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <CardHeader className="flex justify-between items-start pb-3">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">{item.Name}</h3>
                  <Chip
                    color={item.Status === "启用" ? "success" : "danger"}
                    size="sm"
                    variant="dot"
                  >
                    {item.Status}
                  </Chip>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  {item.BasicAuth && (
                    <Chip color="warning" size="sm" variant="flat">
                      需认证
                    </Chip>
                  )}
                  {item.Virtualization && (
                    <Chip color="secondary" size="sm" variant="flat">
                      {item.Virtualization}
                    </Chip>
                  )}
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="py-4 gap-3">
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-default-500 font-medium">IP:</span>
                  <code className="text-xs bg-default-100 px-2 py-1 rounded">{item.IP}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-500 font-medium">硬件:</span>
                  <Chip color="primary" size="sm" variant="bordered">
                    {item.Hardware}
                  </Chip>
                </div>
              </div>
            </CardBody>
            <Divider />
            <CardFooter className="py-3">
              <div className="flex items-center gap-2 text-xs text-default-500">
                {url ? (
                  <Wifi className="w-4 h-4 text-success" />
                ) : (
                  <WifiOff className="w-4 h-4 text-danger" />
                )}
                <span>
                  {networkType === "internet" ? "外网" : "内网"}
                  {url ? "可访问" : "不可用"}
                </span>
                </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <Table
      aria-label="Home Gateway 服务列表"
      sortDescriptor={sortDescriptor}
      onSortChange={(descriptor: any) => setSortDescriptor(descriptor)}
      classNames={{
        wrapper: "shadow-sm",
        th: "bg-default-100 text-default-700 font-semibold",
        td: "text-default-600",
      }}
      selectionMode="none"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align="start"
            allowsSorting={column.sortable}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={filteredAndSortedData} emptyContent="暂无数据">
        {(item) => (
          <TableRow key={item.Name}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as keyof HomeGatewayItem)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card className="max-w-2xl" shadow="md">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-danger">加载失败</h1>
              <p className="text-small text-default-500">请检查网络连接或稍后重试</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-4">
              <div className="bg-danger-50 dark:bg-danger-100/10 p-4 rounded-lg">
                <p className="text-danger text-sm">{error}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  color="primary"
                  startContent={<RefreshCw className="w-4 h-4" />}
                  onClick={fetchData}
                >
                  重新加载
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    );
  }

  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <Card key={index} className="w-full" shadow="sm">
          <CardHeader className="flex justify-between items-start pb-2">
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="w-3/4 rounded-lg">
                <div className="h-5 rounded-lg bg-default-300"></div>
              </Skeleton>
              <div className="flex gap-2">
                <Skeleton className="w-16 rounded-lg">
                  <div className="h-5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-16 rounded-lg">
                  <div className="h-5 rounded-lg bg-default-200"></div>
                </Skeleton>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="py-3 gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-full rounded-lg">
                <div className="h-4 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-full rounded-lg">
                <div className="h-4 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-full rounded-lg">
                <div className="h-4 rounded-lg bg-default-200"></div>
              </Skeleton>
            </div>
          </CardBody>
          <Divider />
          <CardFooter className="pt-2">
            <Skeleton className="w-24 rounded-lg">
              <div className="h-4 rounded-lg bg-default-200"></div>
            </Skeleton>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="flex flex-col gap-4 py-2 md:py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Badge
            content={filteredAndSortedData.length}
            color="primary"
            size="md"
            showOutline={false}
            shape="rectangle"
          >
            <div className="text-sm text-default-600 font-medium px-3 py-1.5 bg-default-100 rounded-lg">
              服务总数
            </div>
          </Badge>
          {filterValue && (
            <Chip
              size="sm"
              variant="flat"
              onClose={() => setFilterValue("")}
              color="secondary"
            >
              已过滤 {filteredAndSortedData.length}/{data.length}
            </Chip>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            isClearable
            placeholder="搜索服务..."
            value={filterValue}
            onValueChange={setFilterValue}
            startContent={<Search className="w-4 h-4 text-default-400" />}
            size="sm"
            variant="bordered"
            className="max-w-xs"
            classNames={{
              input: "text-sm",
              inputWrapper: "h-10"
            }}
          />
          <ButtonGroup size="sm" variant="bordered">
            <Button
              color={layout === "card" ? "primary" : "default"}
              variant={layout === "card" ? "solid" : "bordered"}
              onClick={() => setLayout("card")}
              isIconOnly
              aria-label="卡片视图"
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              color={layout === "list" ? "primary" : "default"}
              variant={layout === "list" ? "solid" : "bordered"}
              onClick={() => setLayout("list")}
              isIconOnly
              aria-label="列表视图"
            >
              <List size={16} />
            </Button>
          </ButtonGroup>
          <Button
            isIconOnly
            size="sm"
            variant="bordered"
            onClick={fetchData}
            isLoading={loading}
            aria-label="刷新数据"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        layout === "card" ? (
          renderSkeletonCards()
        ) : (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" label="加载中..." color="primary" />
          </div>
        )
      ) : filteredAndSortedData.length === 0 ? (
        <Card className="w-full" shadow="sm">
          <CardBody className="py-10">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="text-default-400">
                <Search className="w-12 h-12" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-default-600">未找到匹配的服务</p>
                <p className="text-sm text-default-400 mt-1">
                  {filterValue ? '尝试使用不同的搜索词' : '暂无服务数据'}
                </p>
              </div>
              {filterValue && (
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onClick={() => setFilterValue("")}
                >
                  清除搜索
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      ) : layout === "card" ? (
        renderCardView()
      ) : (
        <Card className="w-full" shadow="sm">
          <CardBody className="p-0 overflow-x-auto">{renderListView()}</CardBody>
        </Card>
      )}
    </section>
  );
}

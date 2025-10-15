"use client";

import { useEffect, useState } from "react";
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
import { LayoutGrid, List } from "lucide-react";
import type { HomeGatewayItem } from "@/types/homegateway";
import { title } from "@/components/primitives";
import { useNetwork } from "@/contexts/NetworkContext";

type LayoutType = "card" | "list";

export default function Home() {
  const [data, setData] = useState<HomeGatewayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutType>("card");
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

  const columns = [
    { key: "Name", label: "名称" },
    { key: "IP", label: "IP地址" },
    { key: "Internet", label: "互联网访问" },
    { key: "localAddr", label: "本地地址" },
    { key: "BasicAuth", label: "基础认证" },
    { key: "Status", label: "状态" },
    { key: "Virtualization", label: "虚拟化" },
    { key: "Hardware", label: "硬件" },
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
      {data.map((item) => {
        const url = getCardUrl(item);
        return (
          <Card
            key={item.Name}
            isPressable
            isHoverable
            className="w-full transition-all hover:scale-105"
            as={url ? "a" : "div"}
            href={url || undefined}
            target={url ? "_blank" : undefined}
            rel={url ? "noopener noreferrer" : undefined}
          >
            <CardHeader className="flex justify-between items-start pb-2">
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-lg font-bold">{item.Name}</h3>
                <div className="flex gap-2 items-center flex-wrap">
                  <Chip
                    color={item.Status === "启用" ? "success" : "danger"}
                    size="sm"
                    variant="dot"
                  >
                    {item.Status}
                  </Chip>
                  {item.BasicAuth && (
                    <Chip
                      color="warning"
                      size="sm"
                      variant="flat"
                    >
                      需认证
                    </Chip>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardBody className="py-3 gap-3">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-default-500">IP:</span>
                  <span className="font-medium text-xs">{item.IP}</span>
                </div>
                {item.Virtualization && (
                  <div className="flex justify-between items-center">
                    <span className="text-default-500">虚拟化:</span>
                    <Chip color="secondary" size="sm" variant="flat">
                      {item.Virtualization}
                    </Chip>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-default-500">硬件:</span>
                  <Chip color="primary" size="sm" variant="flat">
                    {item.Hardware}
                  </Chip>
                </div>
              </div>
            </CardBody>
            <CardFooter className="pt-2 border-t border-divider">
              <div className="flex items-center gap-2 text-xs text-default-500">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${url ? 'bg-success' : 'bg-danger'}`} />
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
      classNames={{
        wrapper: "shadow-none",
        th: "bg-default-100 text-default-600",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} align="start">
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data} emptyContent="暂无数据">
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
        <Card className="max-w-2xl">
          <CardHeader>
            <h1 className={title({ color: "red" })}>错误</h1>
          </CardHeader>
          <CardBody>
            <p className="text-danger mb-4">{error}</p>
            <Button color="primary" onClick={fetchData}>
              重试
            </Button>
          </CardBody>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 py-2 md:py-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-default-500">
          共 {data.length} 条记录
        </div>
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
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" label="加载中..." />
        </div>
      ) : layout === "card" ? (
        renderCardView()
      ) : (
        <Card className="w-full">
          <CardBody className="p-0">{renderListView()}</CardBody>
        </Card>
      )}
    </section>
  );
}

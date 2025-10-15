"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import type { HomeGatewayItem } from "@/types/homegateway";
import { title } from "@/components/primitives";

export default function GatewayPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<HomeGatewayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageId, setPageId] = useState(searchParams.get("pageId") || "");

  const fetchData = async (customPageId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const id = customPageId || pageId;
      const url = id ? `/api/notion?pageId=${encodeURIComponent(id)}` : "/api/notion";
      const response = await fetch(url);
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
    <section className="flex flex-col gap-4 py-8 md:py-10">
      <div className="flex justify-between items-center">
        <h1 className={title()}>Home Gateway 管理</h1>
        <div className="flex gap-2 items-center">
          <Input
            size="sm"
            placeholder="输入 Page ID（可选）"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            className="w-64"
          />
          <Button
            color="primary"
            onClick={() => fetchData()}
            isLoading={loading}
            size="sm"
          >
            加载数据
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" label="加载中..." />
            </div>
          ) : (
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
          )}
        </CardBody>
      </Card>

      <div className="text-sm text-default-500">
        共 {data.length} 条记录
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Copy, ExternalLink, Shield, Server } from "lucide-react";
import type { HomeGatewayItem } from "@/types/homegateway";
import { useCustomToast } from "./Toast";
import { useHaptic } from "./useHaptic";

interface ServiceCardProps {
  item: HomeGatewayItem;
  url: string | null;
  onPress: (url: string) => void;
  onCopyIP?: (ip: string) => void;
  onCopyUrl?: (url: string) => void;
}

export default function ServiceCard({
  item,
  url,
  onPress,
  onCopyIP,
  onCopyUrl
}: ServiceCardProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const { showSuccess, showError } = useCustomToast();
  const { triggerSuccess, triggerError, triggerHaptic } = useHaptic();

  const handleCopyIP = async () => {
    triggerHaptic('light');
    try {
      await navigator.clipboard.writeText(item.IP);
      setCopySuccess("IP");
      onCopyIP?.(item.IP);
      showSuccess("IP地址已复制到剪贴板");
      triggerSuccess();
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error("Failed to copy IP:", error);
      showError("复制IP地址失败");
      triggerError();
    }
  };

  const handleCopyUrl = async () => {
    if (!url) return;
    triggerHaptic('light');
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess("URL");
      onCopyUrl?.(url);
      showSuccess("访问链接已复制到剪贴板");
      triggerSuccess();
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      showError("复制访问链接失败");
      triggerError();
    }
  };

  const handleCardPress = () => {
    triggerHaptic('medium');
    if (url) onPress(url);
  };

  return (
    <Card
      isPressable={!!url}
      isHoverable
      shadow="sm"
      className="w-full transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
      onPress={handleCardPress}
    >
      {/* 卡片头部 - 主要信息 */}
      <CardHeader className="pb-3 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
              {item.Name}
            </h3>
            <Chip
              color={item.Status === "启用" ? "success" : "danger"}
              size="sm"
              variant="dot"
              className="shrink-0"
            >
              {item.Status}
            </Chip>
          </div>

          {/* 认证状态指示器 */}
          {item.BasicAuth && (
            <Chip
              color="warning"
              size="sm"
              variant="flat"
              startContent={<Shield className="w-3 h-3" />}
              className="shrink-0"
            >
              需要认证
            </Chip>
          )}
        </div>
      </CardHeader>

      <CardBody className="pt-0 pb-4 px-4 sm:px-6 sm:pb-6">
        <div className="flex flex-col gap-3">
          {/* 网络信息区域 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 p-2 bg-default-50 dark:bg-default-100/10 rounded-lg">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Server className="w-4 h-4 text-default-400 shrink-0" />
                <span className="text-sm font-mono text-default-600 truncate">
                  {item.IP}
                </span>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handleCopyIP}
                className="shrink-0 min-w-unit-8 h-unit-8"
                aria-label="复制IP地址"
              >
                <Copy className={`w-3 h-3 transition-colors ${
                  copySuccess === "IP" ? "text-success" : "text-default-400"
                }`} />
              </Button>
            </div>
          </div>

          {/* 系统信息区域 */}
          <div className="flex flex-wrap gap-2">
            {item.Virtualization && (
              <Chip
                color="secondary"
                size="sm"
                variant="flat"
                className="text-xs"
              >
                {item.Virtualization}
              </Chip>
            )}
            <Chip
              color="primary"
              size="sm"
              variant="flat"
              className="text-xs"
            >
              {item.Hardware}
            </Chip>
          </div>

          {/* 操作按钮区域 - 桌面端显示 */}
          <div className="hidden sm:flex gap-2 mt-2">
            {url && (
              <Button
                size="sm"
                color="primary"
                variant="solid"
                startContent={<ExternalLink className="w-3 h-3" />}
                onPress={() => onPress(url)}
                className="flex-1"
              >
                访问服务
              </Button>
            )}
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={handleCopyUrl}
              disabled={!url}
              className="shrink-0 min-w-unit-8 h-unit-8"
              aria-label="复制访问链接"
            >
              <Copy className={`w-3 h-3 transition-colors ${
                copySuccess === "URL" ? "text-success" : "text-default-400"
              }`} />
            </Button>
          </div>

          {/* 移动端提示 */}
          <div className="sm:hidden text-center mt-2">
            {url && (
              <p className="text-xs text-default-400">
                点击卡片访问服务
              </p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
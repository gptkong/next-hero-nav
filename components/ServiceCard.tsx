import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import type { HomeGatewayItem } from "@/types/homegateway";

interface ServiceCardProps {
  item: HomeGatewayItem;
  url: string | null;
  onPress: (url: string) => void;
}

export default function ServiceCard({ item, url, onPress }: ServiceCardProps) {
  return (
    <Card
      isPressable={!!url}
      isHoverable
      shadow="sm"
      className="w-full transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      onPress={() => {
        if (url) onPress(url);
      }}
    >
      <CardBody className="p-4 sm:p-6 text-center">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center w-full">
            <h3 className="text-lg sm:text-xl font-bold text-foreground text-center flex-1">
              {item.Name}
            </h3>
            <Chip
              color={item.Status === "启用" ? "success" : "danger"}
              size="sm"
              variant="dot"
              className="ml-2 shrink-0"
            >
              {item.Status}
            </Chip>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-center">
            {item.Virtualization && (
              <Chip color="secondary" size="sm" variant="flat">
                {item.Virtualization}
              </Chip>
            )}
            <Chip color="primary" size="sm" variant="bordered">
              {item.Hardware}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
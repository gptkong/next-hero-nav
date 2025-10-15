"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@heroui/navbar";
import { ButtonGroup, Button } from "@heroui/button";
import { Globe, Network } from "lucide-react";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { useNetwork } from "@/contexts/NetworkContext";

export const Navbar = () => {
  const { networkType, setNetworkType } = useNetwork();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <ButtonGroup size="sm" variant="bordered">
          <Button
            color={networkType === "internet" ? "primary" : "default"}
            variant={networkType === "internet" ? "solid" : "bordered"}
            onClick={() => setNetworkType("internet")}
            startContent={<Globe size={16} />}
          >
            外网
          </Button>
          <Button
            color={networkType === "local" ? "primary" : "default"}
            variant={networkType === "local" ? "solid" : "bordered"}
            onClick={() => setNetworkType("local")}
            startContent={<Network size={16} />}
          >
            内网
          </Button>
        </ButtonGroup>
        <ThemeSwitch />
      </NavbarContent>
    </HeroUINavbar>
  );
};

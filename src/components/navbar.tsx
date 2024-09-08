"use client";
import { formatHash } from "@/lib/utils";
import { usePrivy, WalletWithMetadata } from "@privy-io/react-auth";
import {CircleUser, LogOut, Menu, Package2, Search} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Input} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user, logout, login } = usePrivy();

  const wallets = user?.linkedAccounts as WalletWithMetadata[];
  return (
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <nav
              className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm w-full md:justify-between">
              <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold md:text-base"
              >
                  <h2 className="font-bold text-xl">Stacked</h2>
              </Link>
              <Link
                  href="/"
                  className="text-foreground transition-colors hover:text-foreground"
              >
                  Dashboard
              </Link>
              <Link
                  href="/nft"
                  className="text-muted-foreground transition-colors hover:text-foreground"
              >
                  Create NFT
              </Link>
          </nav>
          <Sheet>
              <SheetTrigger asChild>
                  <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 md:hidden"
                  >
                      <Menu className="h-5 w-5"/>
                      <span className="sr-only">Toggle navigation menu</span>
                  </Button>
              </SheetTrigger>
              <SheetContent side="left">
                  <nav className="grid gap-6 text-lg font-medium">
                      <Link
                          href="/"
                          className="flex items-center gap-2 text-lg font-semibold"
                      >
                          <h2 className="font-bold text-xl">Stacked</h2>

                      </Link>
                      <Link href="/" className="hover:text-foreground">
                          Dashboard
                      </Link>
                      <Link
                          href="/nft"
                          className="text-muted-foreground hover:text-foreground"
                      >
                          Create NFT
                      </Link>

                  </nav>
              </SheetContent>
          </Sheet>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="rounded-full">
                          <CircleUser className="h-5 w-5"/>
                          <span className="sr-only">Toggle user menu</span>
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator/>
                      {!!wallets?.length ? (
                          <>
                          {wallets.map((a) => (
                              <DropdownMenuItem key={a.connectorType}>
                                  <b>{a.connectorType}</b>: {formatHash(a.address)}
                              </DropdownMenuItem>
                          ))}
                          </>
                      ) : (
                          <></>
                      )}
                      <DropdownMenuSeparator/>
                      {!!wallets?.length ? (
                          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>

                      ) : (
                          <DropdownMenuItem onClick={login}>Connect</DropdownMenuItem>
                      )}
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>
      </header>
  );
};

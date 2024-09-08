"use client";
import {Activity, CreditCard, DollarSign, Users,} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {useEffect, useState} from "react";
import {useFundWallet, usePrivy, useWallets} from "@privy-io/react-auth";
import {ethers} from "ethers";
import {getState} from "@/api/api";
import {sepolia} from "viem/chains";
import {encodeFunctionData} from "viem";

import abi from "@/abi/abi.json"
import {useAction} from "@/hooks/useAction";

interface Auctions {
  tokenId: number;
  price: string;
  floorPrice: string;
  endsOn: string;
}

export default function Dashboard() {
  const [embBalance, setEmbBalance] = useState("0");
  const [mruBalance, setMruBalance] = useState("0");
  const [activeAuctions, setActiveAuctions] = useState(0);
  const [activeBids, setActiveBids] = useState(0);
  const { wallets } = useWallets();
  const [ auctions, setAuctions ] = useState<Auctions[]>([]);
  const [ userBids, setUserBids ] = useState<any[]>([]);
  const [ emb ,setEMB ] = useState("");
  const { fundWallet } = useFundWallet()
  const { sendTransaction } = usePrivy()
  const { submit } = useAction();


  const addBalance = async () => {
    const data = encodeFunctionData({
      abi: abi,
      functionName: 'bridgeETH',
      args: [emb]
    })
    const transactionRequest = {
      to: '0x448559B5839F7c06E5C090F61C3B37dC3B242722',
      data: data,
      value: (ethers.utils.parseEther("0.001")).toBigInt()
    };
    await sendTransaction(transactionRequest);
  }

  const createBid = async (tokenId: number, price: string) => {
    await submit("createOrder", { price: (ethers.utils.parseEther("0.001").toBigInt() + BigInt(price)).toString(), tokenId, timestamp: Math.floor(Date.now() / 1000) })
  }

  useEffect(() => {
    (async () => {
      const state = await getState();

      if (wallets.length >= 2) {
        console.log(wallets)
        const wallet = wallets.filter(w => w.connectorType === "embedded")[0]
        const provider = await wallet.getEthersProvider();
        setEMB(wallet.address)
        console.log((await provider.getBalance(wallet.address)))
        setEmbBalance(ethers.utils.formatEther(await provider.getBalance(wallet.address)).toString());
        if (state.state.users[wallet.address]) {
          setMruBalance(ethers.utils.formatEther(state.state.users[wallet.address].ETH))
        }

        const userBidsObj = Object.entries(state.state.bids).flatMap(([tokenId, orders]: any) => {
              console.log(orders)
              const userOrders = orders.filter((order: any) => order.user === wallet.address);
              console.log(userOrders)
              if (userOrders.length > 0) {
                const { price } = userOrders[0];
                const highestBid = orders[0].price;

                const isHighest = BigInt(price) >= BigInt(highestBid);

                return {
                  price,
                  tokenId,
                  isHighest: isHighest,
                  highestBid
                }
              }
            }
        );
        setUserBids(userBidsObj.filter(bid => bid !== undefined))
        console.log(userBidsObj)
      }

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      const filledTokenIds = new Set(state.state.filledOrders.map((order: any) => order.tokenId));

      const activeBidTokenIds = new Set(
          Object.values(state.state.bids).flat().map((order: any) => order.tokenId)
      );
      const tempAuctions: Auctions[] = [];
      const unfilledNFTs = state.state.NFTs.filter((nftDetail: any) => {
        const { NFT, createdAt, floorPrice } = nftDetail;
        const isFilled = filledTokenIds.has(NFT.tokenId);
        const isOlderThan24Hours = (currentTime - createdAt) > 24 * 60 * 60;
        if (!isFilled && !isOlderThan24Hours) {
          tempAuctions.push({
            tokenId: parseInt(NFT.tokenId),
            price: state.state.bids[NFT.tokenId] ? state.state.bids[NFT.tokenId][0].price : floorPrice,
            floorPrice,
            endsOn: new Date(nftDetail.createdAt*1000).toUTCString()
          })
          return true;
        }
        return false;
      });
      setAuctions(tempAuctions)
      setActiveAuctions(unfilledNFTs.length);
      let bids = 0;
      unfilledNFTs.forEach((nft: any) => {
        if (state.state.bids[nft.NFT.tokenId]) bids+=state.state.bids[nft.NFT.tokenId].length;
      })
      setActiveBids(bids);

    })()
  }, [wallets]);
  return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card x-chunk="dashboard-01-chunk-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Embedded Account Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-center justify-between">
                  <div className="text-2xl font-bold">{embBalance.slice(0, 5)} ETH</div>
                  <Button size="sm" variant="secondary" onClick={() => fundWallet(emb, {
                    chain: sepolia,
                    amount: "0.01"
                  })}>Add</Button>

                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  MRU Account Balance
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-center justify-between">
                  <div className="text-2xl font-bold">{mruBalance.slice(0, 5)} ETH</div>
                  <Button size="sm" variant="secondary" onClick={() => addBalance()}>Add</Button>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeAuctions}</div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Active Bids</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeBids}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card
                className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
            >
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Open Auctions</CardTitle>
                  <CardDescription>
                    These auctions are accepting new bids.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NFT</TableHead>
                      <TableHead>
                        Current Price(in ETH)
                      </TableHead>
                      <TableHead>Ends At</TableHead>
                      <TableHead className="text-right">Bid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auctions.map(auction => (
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Token Auction # {auction.tokenId}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              Floor Price: {ethers.utils.formatEther(auction.floorPrice)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {ethers.utils.formatEther(auction.price)}
                          </TableCell>
                          <TableCell>
                            {auction.endsOn}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => createBid(auction.tokenId, auction.price)}>
                              Bid +0.001 ETH
                            </Button>
                          </TableCell>
                        </TableRow>

                    ))}

                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader>
                <CardTitle>Your Bids</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8">
                {userBids.map(bid => (
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          Token # {bid.tokenId}
                        </p>
                        <p className={"text-sm " + (bid.isHighest ? "text-green-500" : "text-red-500")}>
                          {bid.isHighest ? "Leading" : "Trailing"}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">Your Bid - {ethers.utils.formatEther(bid.price)} ETH</div>
                    </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  )
}

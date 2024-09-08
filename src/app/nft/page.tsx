"use client";
import Image from "next/image"
import {ChevronLeft, Upload,} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Textarea} from "@/components/ui/textarea"
import {useState} from "react";
import {encodeFunctionData} from "viem";
import {usePrivy, useWallets} from "@privy-io/react-auth";
import {useRouter} from "next/navigation";
import abi from "@/abi/abi.json";


export default function Dashboard() {
    const [dynamic, setDynamic] = useState<boolean>(false);
    const router = useRouter()
    const { wallets } = useWallets()
    const { sendTransaction } = usePrivy()
    const create = async () => {
        const tokenId = parseInt(prompt("Enter the token id")!)
        const data = encodeFunctionData({
            abi: abi,
            functionName: 'createNFT',
            args: [wallets[1].address, tokenId, 10000000]
        })
        const transactionRequest = {
            to: '0x448559B5839F7c06E5C090F61C3B37dC3B242722',
            data: data,
        };
        await sendTransaction(transactionRequest);
        router.push("/")
    }
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">

            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.push("/")}>
                                <ChevronLeft className="h-4 w-4"/>
                                <span className="sr-only">Back</span>
                            </Button>
                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0" >
                                Create NFT
                            </h1>
                            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                                <Button variant="outline" size="sm">
                                    Discard
                                </Button>
                                <Button size="sm" onClick={create}>Create</Button>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                <Card x-chunk="dashboard-07-chunk-0">
                                    <CardHeader>
                                        <CardTitle>NFT Details</CardTitle>
                                        <CardDescription>
                                            Fill the following details to create an NFT.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    className="min-h-32"
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="image">Image</Label>
                                                <Input
                                                    id="image"
                                                    type="text"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                {dynamic && (
                                    <Card x-chunk="dashboard-07-chunk-1">
                                        <CardHeader>
                                            <CardTitle>Image Order</CardTitle>
                                            <CardDescription>
                                                Select the duration for each image.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[100px]">Name</TableHead>
                                                        <TableHead>Duration(in Days)</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-semibold">
                                                            Image-1
                                                        </TableCell>
                                                        <TableCell>
                                                            <Label htmlFor="stock-1" className="sr-only">
                                                                Stock
                                                            </Label>
                                                            <Input
                                                                id="stock-1"
                                                                type="number"
                                                                defaultValue="100"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-semibold">
                                                            Image-2
                                                        </TableCell>
                                                        <TableCell>
                                                            <Label htmlFor="stock-2" className="sr-only">
                                                                Stock
                                                            </Label>
                                                            <Input
                                                                id="stock-2"
                                                                type="number"
                                                                defaultValue="143"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-semibold">
                                                            Image-3
                                                        </TableCell>
                                                        <TableCell>
                                                            <Label htmlFor="stock-3" className="sr-only">
                                                                Stock
                                                            </Label>
                                                            <Input
                                                                id="stock-3"
                                                                type="number"
                                                                defaultValue="32"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>

                                )}
                            </div>
                            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                                <Card x-chunk="dashboard-07-chunk-5">
                                    <CardHeader>
                                        <CardTitle>NFT Type</CardTitle>
                                        <CardDescription>
                                            Toggle to create dynamic NFT.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div></div>
                                        <Button size="sm" variant={dynamic ? "secondary" : "default" } onClick={() => setDynamic(!dynamic)}>
                                            {dynamic ? "Switch to Static" : "Switch to Dynamic"}
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card x-chunk="dashboard-07-chunk-3">
                                    <CardHeader>
                                        <CardTitle>Additional Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <Label htmlFor="chain">Chain</Label>
                                                <Select>
                                                    <SelectTrigger id="chain" aria-label="Select status">
                                                        <SelectValue placeholder="Select status"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Active</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="floor">Floor Price(in ETH)</Label>
                                                <Input
                                                    id="floor"
                                                    type="number"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                {dynamic && (
                                    <Card
                                        className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
                                    >
                                        <CardHeader>
                                            <CardTitle>NFT Images</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-2">
                                                <Image
                                                    alt="Product image"
                                                    className="aspect-square w-full rounded-md object-cover"
                                                    height="300"
                                                    src="/placeholder.svg"
                                                    width="300"
                                                />
                                                <div className="grid grid-cols-3 gap-2">
                                                    <button>
                                                        <Image
                                                            alt="Product image"
                                                            className="aspect-square w-full rounded-md object-cover"
                                                            height="84"
                                                            src="/placeholder.svg"
                                                            width="84"
                                                        />
                                                    </button>
                                                    <button>
                                                        <Image
                                                            alt="Product image"
                                                            className="aspect-square w-full rounded-md object-cover"
                                                            height="84"
                                                            src="/placeholder.svg"
                                                            width="84"
                                                        />
                                                    </button>
                                                    <button
                                                        className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                                        <Upload className="h-4 w-4 text-muted-foreground"/>
                                                        <span className="sr-only">Upload</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 md:hidden">
                            <Button variant="outline" size="sm">
                                Discard
                            </Button>
                            <Button onClick={create} size="sm">Create NFT</Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

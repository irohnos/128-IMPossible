"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Pagination from "./pagination";

export default function PaginationController(props: any){
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return <Pagination {...props} onPageChange={handlePageChange} />;
}
"use client";

import { api } from "@workspace/backend/_generated/api";
import { PublicFile } from "@workspace/backend/private/files";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  LOAD_SIZE,
  useInfiniteScroll,
} from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import {
  FileIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { DeleteFileDialog } from "../../components/delete-file-dialog";
import { UploadDialog } from "../../components/upload-dialog";

export const FilesView = () => {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    {
      initialNumItems: LOAD_SIZE,
    },
  );

  const {
    topElementRef,
    handleLoadMore,
    isLoadingMore,
    canLoadMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: files.status,
    loadMore: files.loadMore,
    loadSize: LOAD_SIZE,
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);

  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
  };

  const handleFileDeleted = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <DeleteFileDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        file={selectedFile}
        onDelete={handleFileDeleted}
      />
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Tài liệu đào tạo AI</h1>
            <p className="text-muted-foreground">
              Tải lên và quản lý dữ liệu cho trợ lý AI của bạn
            </p>

            <div className="mt-8 rounded-lg border bg-background">
              <div className="flex items-center justify-end border-b px-6 py-4">
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <PlusIcon />
                  Thêm mới
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4 font-medium">
                      Tên file
                    </TableHead>
                    <TableHead className="px-6 py-4 font-medium">
                      Định dạng
                    </TableHead>
                    <TableHead className="px-6 py-4 font-medium">
                      Kích thước
                    </TableHead>
                    <TableHead className="px-6 py-4 font-medium">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(() => {
                    if (isLoadingFirstPage) {
                      return (
                        <TableRow>
                          <TableCell className="h-24 text-center" colSpan={4}>
                            Đang tải tài liệu...
                          </TableCell>
                        </TableRow>
                      );
                    }

                    if (files.results.length === 0) {
                      return (
                        <TableRow>
                          <TableCell className="h-24 text-center" colSpan={4}>
                            Không tìm thấy tài liệu nào
                          </TableCell>
                        </TableRow>
                      );
                    }

                    return files.results.map((file) => (
                      <TableRow className="hover:bg-muted/50" key={file.id}>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileIcon />
                            {file.name}
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Badge className="uppercase" variant={"outline"}>
                              {file.type}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4 text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <Badge className="uppercase" variant={"outline"}>
                              {file.size}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="size-8 p-0"
                                size={"sm"}
                                variant={"ghost"}
                              >
                                <MoreHorizontalIcon />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteClick(file)}
                              >
                                <TrashIcon className="size-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ));
                  })()}
                </TableBody>
              </Table>

              {!isLoadingFirstPage && files.results.length > 0 && (
                <div className="border-t">
                  <InfiniteScrollTrigger
                    canLoadMore={canLoadMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}
                    ref={topElementRef}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

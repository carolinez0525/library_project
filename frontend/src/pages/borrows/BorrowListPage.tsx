import React from "react";
import { Card, Table, Tag, Space, Button, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBorrowings, markReturned } from "@/api/borrows";
import type { Borrowing } from "@/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const BorrowListPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "Librarian";
  const queryClient = useQueryClient();

  const { data: borrowings, isLoading } = useQuery<Borrowing[]>({
    queryKey: ["borrowings"],
    queryFn: () => getBorrowings(),
  });

  // Filter out returned borrowings
  const activeBorrowings =
    borrowings?.filter((borrowing) => {
      if (!borrowing.return_date) return true;
      const returnDate = new Date(borrowing.return_date);
      const borrowDate = new Date(borrowing.borrow_date);
      return returnDate <= borrowDate;
    }) || [];

  const handleReturn = async (borrowId: number) => {
    try {
      await markReturned(borrowId);
      message.success("Book returned successfully");
      // Refresh the borrowings list
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
    } catch (error) {
      message.error("Failed to return book");
    }
  };

  const columns = [
    {
      title: "Book Title",
      dataIndex: ["book", "title"],
      key: "title",
    },
    {
      title: "Author",
      dataIndex: ["book", "author"],
      key: "author",
    },
    {
      title: "Borrower",
      dataIndex: ["user", "email"],
      key: "user",
      hidden: !isAdmin,
    },
    {
      title: "Borrow Date",
      dataIndex: "borrow_date",
      key: "borrow_date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Borrowing) => {
        const dueDate = new Date(record.due_date);
        const currentDate = new Date();
        const isOverdue = dueDate < currentDate;

        return (
          <Tag color={isOverdue ? "error" : "success"}>
            {isOverdue ? "Overdue" : "Normal"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Borrowing) =>
        record.return_date ? null : (
          <Button type="primary" onClick={() => handleReturn(record.borrow_id)}>
            Return Book
          </Button>
        ),
    },
  ];

  return (
    <div className="p-6">
      <Card title="Borrowing Records">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Table
            columns={columns.filter((col) => !col.hidden)}
            dataSource={activeBorrowings}
            rowKey="borrow_id"
            loading={isLoading}
            pagination={{
              total: activeBorrowings.length,
              pageSize: 10,
              showTotal: (total) => `Total ${total} records`,
            }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default BorrowListPage;

import React, { useState } from "react";
import { Table, Button, Space, Select, Modal, Form, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFeedback } from "../../hooks/useFeedback";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
} from "../../api/books";
import type { Book, BookResponse } from "../../api/books";
import { useAppSelector } from "../../store/hooks";

const { Option } = Select;

const BookListPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchText, setSearchText] = useState("");
  const [queryParams, setQueryParams] = useState({
    page: 1,
    page_size: 10,
  });

  const { message: messageApi, modal } = useFeedback();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "Librarian";

  const { data: booksData, isLoading: isLoadingBooks } = useQuery<BookResponse>(
    {
      queryKey: ["books", queryParams],
      queryFn: () => getBooks(queryParams),
    }
  );

  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      messageApi.success("Book added successfully");
      setIsModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: Error) => {
      messageApi.error(error.message || "Operation failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ book_id, ...data }: Book) => updateBook(book_id, data),
    onSuccess: () => {
      messageApi.success("Book updated successfully");
      setIsModalVisible(false);
      form.resetFields();
      setEditingBook(null);
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: Error) => {
      messageApi.error(error.message || "Operation failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      messageApi.success("Book deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: Error) => {
      messageApi.error(error.message || "Operation failed");
    },
  });

  const borrowMutation = useMutation({
    mutationFn: ({ bookId, dueDate }: { bookId: number; dueDate: string }) =>
      borrowBook(bookId, dueDate),
    onSuccess: () => {
      messageApi.success("Book borrowed successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: Error) => {
      messageApi.error(error.message || "Operation failed");
    },
  });

  const handleAdd = () => {
    if (!isAdmin) {
      messageApi.error("You do not have permission to perform this action");
      return;
    }
    setEditingBook(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Book) => {
    if (!isAdmin) {
      messageApi.error("You do not have permission to perform this action");
      return;
    }
    setEditingBook(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (bookId: number) => {
    if (!isAdmin) {
      messageApi.error("You do not have permission to perform this action");
      return;
    }
    modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this book?",
      onOk: () => {
        deleteMutation.mutate(bookId);
      },
    });
  };

  const handleBorrow = (bookId: number) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const formattedDueDate = dueDate.toISOString().split("T")[0];
    borrowMutation.mutate({ bookId, dueDate: formattedDueDate });
  };

  const handleReturn = () => {
    messageApi.info("Book returned successfully");
  };

  const handleSubmit = async (values: Omit<Book, "book_id">) => {
    if (!isAdmin) {
      messageApi.error("You do not have permission to perform this action");
      return;
    }
    if (editingBook) {
      updateMutation.mutate({ ...values, book_id: editingBook.book_id });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: "Book Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Shelf Location",
      dataIndex: "shelf_loc",
      key: "shelf_loc",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => status,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Book) => (
        <Space>
          {isAdmin && (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.book_id)}
              />
            </>
          )}
          {!isAdmin && record.status === "Available" && (
            <Button type="primary" onClick={() => handleBorrow(record.book_id)}>
              Borrow
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredBooks = booksData?.results.filter((book) => {
    const searchLower = searchText.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space>
          {isAdmin && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Book
            </Button>
          )}
        </Space>
        <Input.Search
          placeholder="Search by book name or author"
          allowClear
          enterButton
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredBooks}
        rowKey="book_id"
        loading={isLoadingBooks}
      />

      <Modal
        title={editingBook ? "Edit Book" : "Add Book"}
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingBook(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editingBook || {}}
        >
          <Form.Item
            name="title"
            label="Book Name"
            rules={[{ required: true, message: "Please enter book name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: "Please enter author" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isbn"
            label="ISBN"
            rules={[{ required: true, message: "Please enter ISBN" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please enter category" }]}
          >
            <Select>
              <Option value="fiction">Fiction</Option>
              <Option value="non-fiction">Non-Fiction</Option>
              <Option value="science">Science</Option>
              <Option value="technology">Technology</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Option value="Available">Available</Option>
              <Option value="Borrowed">Borrowed</Option>
              <Option value="Reserved">Reserved</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="shelf_loc"
            label="Shelf Location"
            rules={[{ required: true, message: "Please enter shelf location" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookListPage;

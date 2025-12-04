import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBooks, createBook, updateBook, deleteBook } from '../../api/books';
import type { Book, BookResponse } from '../../api/books';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

const BookManagement: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: booksData, isLoading } = useQuery<BookResponse>({
    queryKey: ['books'],
    queryFn: () => getBooks({ page: 1, page_size: 100 }),
  });

  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      message.success('Book added successfully!');
      setModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      message.error(error.message || 'Add failed, please try again!');
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Book> }) => updateBook(id, data),
    onSuccess: () => {
      message.success('Book updated successfully!');
      setModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      message.error(error.message || 'Update failed, please try again!');
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      message.success('Book deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      message.error(error.message || 'Delete failed, please try again!');
    },
  });

  const handleAdd = () => {
    setEditingBook(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    form.setFieldsValue(book);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this book?',
      onOk: () => deleteBookMutation.mutate(id),
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingBook) {
        updateBookMutation.mutate({ id: editingBook.book_id, data: values });
      } else {
        createBookMutation.mutate(values);
      }
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns: ColumnsType<Book> = [
    {
      title: 'Book Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Book) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.book_id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Book Management"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Book
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={booksData?.results}
          rowKey="book_id"
          loading={isLoading}
        />
      </Card>

      <Modal
        title={editingBook ? 'Edit Book' : 'Add Book'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingBook || {}}
        >
          <Form.Item
            name="title"
            label="Book Name"
            rules={[{ required: true, message: 'Please enter book name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: 'Please enter author' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isbn"
            label="ISBN"
            rules={[{ required: true, message: 'Please enter ISBN' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please enter category' }]}
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
            rules={[{ required: true, message: 'Please select status' }]}
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
            rules={[{ required: true, message: 'Please enter shelf location' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookManagement; 
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export default function App() {
  const [products, setProducts] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      alert("Ошибка запроса");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setPrice("");
    setStock("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (
      !trimmedTitle ||
      !trimmedCategory ||
      !trimmedDescription ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      alert("Заполни все поля корректно");
      return;
    }

    const payload = {
      title: trimmedTitle,
      category: trimmedCategory,
      description: trimmedDescription,
      price: parsedPrice,
      stock: parsedStock,
    };

    try {
      if (editingId) {
        await apiClient.patch(`/products/${editingId}`, payload);
      } else {
        await apiClient.post("/products", payload);
      }
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Ошибка запроса");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setCategory(product.category);
    setDescription(product.description);
    setPrice(String(product.price));
    setStock(String(product.stock));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить товар?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Ошибка запроса");
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Товары</h1>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Название товара"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="Категория"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
          required
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input textarea"
          rows={3}
          required
        />
        <div className="row">
          <input
            type="number"
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className="input"
            required
          />
          <input
            type="number"
            placeholder="Количество на складе"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            step="1"
            className="input"
            required
          />
        </div>
        <div className="row buttons">
          <button type="submit" className="btn primary">
            {editingId ? "Обновить товар" : "Создать товар"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="btn secondary"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="products">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <h3>{product.title}</h3>
              <div className="meta">
                <span className="category">{product.category}</span>
                <span className="stock">{product.stock} шт. на складе</span>
              </div>
              <p className="description">{product.description}</p>
            </div>
            <div className="right">
              <div className="price">
                {product.price.toLocaleString("ru-RU")} ₽
              </div>
              <div className="actions">
                <button
                  onClick={() => handleEdit(product)}
                  className="btn edit"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="btn delete"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

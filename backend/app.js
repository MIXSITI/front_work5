const express = require('express');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`
    );
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      console.log('Body:', req.body);
    }
  });
  next();
});

let products = [
  {
    id: nanoid(6),
    title: 'iPhone 15 Pro',
    category: 'Смартфоны',
    description: 'Флагманский смартфон с OLED‑дисплеем и камерой Pro.',
    price: 99999,
    stock: 5
  },
  {
    id: nanoid(6),
    title: 'Samsung Galaxy S24',
    category: 'Смартфоны',
    description: 'Мощный Android‑смартфон с отличной камерой.',
    price: 89999,
    stock: 8
  },
  {
    id: nanoid(6),
    title: 'MacBook Air M2',
    category: 'Ноутбуки',
    description: 'Лёгкий ноутбук на чипе M2 для работы и учёбы.',
    price: 129999,
    stock: 3
  },
  {
    id: nanoid(6),
    title: 'AirPods Pro 2',
    category: 'Аксессуары',
    description: 'Беспроводные наушники с активным шумоподавлением.',
    price: 24999,
    stock: 15
  },
  {
    id: nanoid(6),
    title: 'Sony WH‑1000XM5',
    category: 'Наушники',
    description: 'Полноразмерные наушники с лучшим шумоподавлением.',
    price: 39999,
    stock: 7
  },
  {
    id: nanoid(6),
    title: 'iPad Pro 12.9"',
    category: 'Планшеты',
    description: 'Планшет с большим дисплеем для творчества и работы.',
    price: 119999,
    stock: 4
  },
  {
    id: nanoid(6),
    title: 'Apple Watch Ultra',
    category: 'Часы',
    description: 'Продвинутые смарт‑часы для спорта и путешествий.',
    price: 79999,
    stock: 6
  },
  {
    id: nanoid(6),
    title: 'Dell XPS 13',
    category: 'Ноутбуки',
    description: 'Компактный ультрабук с тонкими рамками.',
    price: 109999,
    stock: 2
  },
  {
    id: nanoid(6),
    title: 'Nintendo Switch OLED',
    category: 'Приставки',
    description: 'Игровая консоль с ярким OLED‑экраном.',
    price: 34999,
    stock: 10
  },
  {
    id: nanoid(6),
    title: 'PlayStation 5 Slim',
    category: 'Приставки',
    description: 'Игровая приставка нового поколения.',
    price: 59999,
    stock: 1
  }
];

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API магазина электроники',
      version: '1.0.0',
      description: 'Простое API для управления товарами (Product)'
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер'
      }
    ]
  },
  apis: ['./app.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *         title:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *       example:
 *         id: "abc123"
 *         title: "iPhone 15 Pro"
 *         category: "Смартфоны"
 *         description: "Флагманский смартфон с OLED‑дисплеем и камерой Pro."
 *         price: 99999
 *         stock: 5
 */

function findProductOr404(id, res) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return null;
  }
  return product;
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в теле запроса
 */
app.post('/api/products', (req, res) => {
  const { title, category, description, price, stock } = req.body;

  if (
    !title ||
    !category ||
    !description ||
    typeof price !== 'number' ||
    price <= 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    return res.status(400).json({ error: 'Invalid product data' });
  }

  const newProduct = {
    id: nanoid(6),
    title: String(title).trim(),
    category: String(category).trim(),
    description: String(description).trim(),
    price: Number(price),
    stock: Number(stock)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления или неверные данные
 *       404:
 *         description: Товар не найден
 */
app.patch('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;

  const { title, category, description, price, stock } = req.body;

  if (
    title === undefined &&
    category === undefined &&
    description === undefined &&
    price === undefined &&
    stock === undefined
  ) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  if (title !== undefined) product.title = String(title).trim();
  if (category !== undefined) product.category = String(category).trim();
  if (description !== undefined) product.description = String(description).trim();

  if (price !== undefined) {
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }
    product.price = Number(price);
  }

  if (stock !== undefined) {
    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ error: 'Invalid stock' });
    }
    product.stock = Number(stock);
  }

  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар удалён
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const exists = products.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ error: 'Product not found' });

  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});

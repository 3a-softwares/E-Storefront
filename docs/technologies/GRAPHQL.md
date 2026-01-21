# GraphQL & Apollo

**Versions:** GraphQL 16.0, Apollo Server 4.0, Apollo Client 3.8.8  
**Category:** API Query Language & Client

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     GraphQL Architecture                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend Apps          GraphQL Gateway        Microservices  │
│  ┌─────────────┐       ┌─────────────┐       ┌────────────┐  │
│  │ Shell App   │       │             │       │ Auth       │  │
│  │ Admin App   │──────▶│   Apollo    │──────▶│ Product    │  │
│  │ Seller App  │       │   Server    │       │ Order      │  │
│  │ Web App     │       │             │       │ Category   │  │
│  └─────────────┘       └─────────────┘       └────────────┘  │
│   Apollo Client            Port 4000          REST Services  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Server Setup (Apollo Server)

```typescript
// graphql-gateway/src/index.ts
import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors({ origin: ['http://localhost:3000'], credentials: true }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      token: req.headers.authorization?.replace('Bearer ', ''),
      user: await verifyToken(req.headers.authorization),
      dataSources: createDataSources(),
    }),
  })
);

httpServer.listen(4000);
```

---

## Schema Definition

### Types

```graphql
type Product {
  id: ID!
  name: String!
  slug: String!
  price: Float!
  images: [String!]!
  category: Category!
  seller: User!
  stock: Int!
  status: ProductStatus!
}

type Order {
  id: ID!
  orderNumber: String!
  user: User!
  items: [OrderItem!]!
  total: Float!
  status: OrderStatus!
}

enum ProductStatus {
  ACTIVE
  DRAFT
  ARCHIVED
}
enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### Queries

```graphql
type Query {
  products(filter: ProductFilter, pagination: PaginationInput): ProductConnection!
  product(id: ID!): Product
  categories: [Category!]!
  orders: [Order!]!
  me: User
}

input ProductFilter {
  category: ID
  minPrice: Float
  maxPrice: Float
  search: String
}

input PaginationInput {
  page: Int = 1
  limit: Int = 10
}
```

### Mutations

```graphql
type Mutation {
  # Auth
  login(input: LoginInput!): AuthPayload!
  register(input: RegisterInput!): AuthPayload!

  # Products
  createProduct(input: CreateProductInput!): Product!
  updateProduct(id: ID!, input: UpdateProductInput!): Product!

  # Cart & Orders
  addToCart(input: CartItemInput!): Cart!
  createOrder(input: CreateOrderInput!): Order!
}

type AuthPayload {
  token: String!
  refreshToken: String!
  user: User!
}
```

### Subscriptions

```graphql
type Subscription {
  orderStatusChanged(orderId: ID!): Order!
  newOrder(sellerId: ID!): Order!
  lowStockAlert(sellerId: ID!): Product!
}
```

---

## Client Setup (Apollo Client)

```typescript
// lib/apollo/client.ts
import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: 'include',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();
  operation.setContext({
    headers: { ...(token && { authorization: `Bearer ${token}` }) },
  });
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: ['search', 'category'],
            merge(existing, incoming, { args }) {
              if (!args?.page || args.page === 1) return incoming;
              return {
                ...incoming,
                products: [...(existing?.products || []), ...incoming.products],
              };
            },
          },
        },
      },
    },
  }),
});
```

### Provider

```tsx
// app/providers.tsx
'use client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo/client';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
```

---

## Usage Patterns

### useQuery

```tsx
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/apollo/queries';

function ProductList({ category }: { category?: string }) {
  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { page: 1, limit: 12, category },
  });

  if (loading) return <Skeleton />;
  if (error) return <Error message={error.message} />;

  return <ProductGrid products={data.products.products} />;
}
```

### useMutation

```tsx
import { useMutation } from '@apollo/client';
import { CREATE_ORDER, GET_ORDERS } from '@/lib/apollo/queries';

function CheckoutForm() {
  const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
    onCompleted: (data) => router.push(`/orders/${data.createOrder.id}`),
  });

  const handleSubmit = () => {
    createOrder({ variables: { input: orderData } });
  };
}
```

### Custom Hooks

```typescript
// hooks/useProducts.ts
export function useProducts(variables: ProductsVariables) {
  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCTS, { variables });

  const loadMore = () => {
    if (data?.products.page < data?.products.totalPages) {
      fetchMore({ variables: { page: data.products.page + 1 } });
    }
  };

  return { products: data?.products.products, loading, error, loadMore };
}
```

---

## Resolvers

```typescript
// resolvers/product.ts
export const productResolvers = {
  Query: {
    products: async (_, args, { dataSources }) => dataSources.productAPI.getProducts(args),
    product: async (_, { id }, { dataSources }) => dataSources.productAPI.getProduct(id),
  },
  Mutation: {
    createProduct: async (_, { input }, { dataSources, user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return dataSources.productAPI.createProduct(input, user.id);
    },
  },
  Product: {
    category: async (product, _, { dataSources }) =>
      dataSources.categoryAPI.getCategory(product.categoryId),
    seller: async (product, _, { dataSources }) => dataSources.userAPI.getUser(product.sellerId),
  },
};
```

---

## DataSources

```typescript
// datasources/ProductAPI.ts
import { RESTDataSource } from '@apollo/datasource-rest';

export class ProductAPI extends RESTDataSource {
  override baseURL = process.env.PRODUCT_SERVICE_URL;

  async getProducts(args: ProductsArgs) {
    return this.get('/products', { params: args });
  }

  async getProduct(id: string) {
    return this.get(`/products/${id}`);
  }

  async createProduct(input: CreateProductInput, userId: string) {
    return this.post('/products', { body: { ...input, sellerId: userId } });
  }
}
```

---

## Fetch Policies

| Policy              | Use Case                          |
| ------------------- | --------------------------------- |
| `cache-first`       | Default, returns cached data      |
| `cache-and-network` | Shows cache, updates from network |
| `network-only`      | Always fetch, update cache        |
| `no-cache`          | Always fetch, skip cache          |

```tsx
useQuery(QUERY, { fetchPolicy: 'cache-and-network' });
```

---

## Error Handling

```typescript
// Server-side
import { GraphQLError } from 'graphql';

throw new GraphQLError('Not authorized', {
  extensions: { code: 'UNAUTHORIZED' },
});

// Client-side
const { error } = useQuery(QUERY);
if (error?.graphQLErrors) {
  error.graphQLErrors.forEach(({ message, extensions }) => {
    console.error(`[${extensions.code}]: ${message}`);
  });
}
```

---

## Related

- [TYPESCRIPT.md](TYPESCRIPT.md) - Type generation
- [JWT.md](JWT.md) - Authentication
- [REDIS.md](REDIS.md) - Caching

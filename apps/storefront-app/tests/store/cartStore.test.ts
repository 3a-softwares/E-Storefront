import { getCurrentUser } from '3a-ecommerce-utils';

// Mock store implementation for testing
describe('Cart Store', () => {
  // Create a mock store for each test
  const createMockStore = () => {
    let state = {
      items: [] as Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl?: string;
      }>,
      wishlist: [] as Array<{
        productId: string;
        name: string;
        price: number;
        imageUrl?: string;
        addedAt: number;
      }>,
      recentlyViewed: [] as Array<{
        productId: string;
        name: string;
        price: number;
        imageUrl?: string;
      }>,
      userProfile: null as any,
    };

    const listeners = new Set<() => void>();

    const setState = (partial: Partial<typeof state>) => {
      state = { ...state, ...partial };
      listeners.forEach((listener) => listener());
    };

    return {
      getState: () => state,
      setState,
      subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },

      addItem: (item: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl?: string;
      }) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          setState({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          setState({ items: [...state.items, item] });
        }
      },

      removeItem: (id: string) => {
        setState({ items: state.items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity > 0) {
          setState({
            items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
          });
        } else {
          setState({ items: state.items.filter((item) => item.id !== id) });
        }
      },

      clearCart: () => {
        setState({ items: [] });
      },

      getTotalItems: () => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      addToWishlist: (item: {
        productId: string;
        name: string;
        price: number;
        imageUrl?: string;
      }) => {
        const exists = state.wishlist.find((w) => w.productId === item.productId);
        if (!exists) {
          setState({
            wishlist: [...state.wishlist, { ...item, addedAt: Date.now() }],
          });
        }
      },

      removeFromWishlist: (productId: string) => {
        setState({
          wishlist: state.wishlist.filter((w) => w.productId !== productId),
        });
      },

      isInWishlist: (productId: string) => {
        return state.wishlist.some((w) => w.productId === productId);
      },

      addRecentlyViewed: (item: {
        productId: string;
        name: string;
        price: number;
        imageUrl?: string;
      }) => {
        const filtered = state.recentlyViewed.filter((i) => i.productId !== item.productId);
        setState({ recentlyViewed: [item, ...filtered].slice(0, 12) });
      },

      clearRecentlyViewed: () => {
        setState({ recentlyViewed: [] });
      },

      setUserProfile: (profile: any) => {
        setState({ userProfile: profile });
      },

      loadUserFromStorage: () => {
        const user = getCurrentUser();
        if (user) {
          setState({
            userProfile: {
              id: user.id,
              email: user.email,
              name: user.name || user.email.split('@')[0],
              addresses: user.addresses || [],
              defaultAddressId: user.defaultAddressId,
              phone: user.phone,
            },
          });
        }
      },
    };
  };

  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createMockStore();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState();
      expect(state.items).toEqual([]);
      expect(state.wishlist).toEqual([]);
      expect(state.recentlyViewed).toEqual([]);
      expect(state.userProfile).toBeNull();
    });
  });

  describe('Cart Items', () => {
    describe('addItem', () => {
      it('should add a new item to the cart', () => {
        const item = { id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 };

        store.addItem(item);

        expect(store.getState().items).toHaveLength(1);
        expect(store.getState().items[0]).toEqual(item);
      });

      it('should increase quantity if item already exists', () => {
        const item = { id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 };

        store.addItem(item);
        store.addItem({ ...item, quantity: 2 });

        expect(store.getState().items).toHaveLength(1);
        expect(store.getState().items[0].quantity).toBe(3);
      });

      it('should add multiple different items', () => {
        store.addItem({ id: 'prod1', name: 'Product 1', price: 10, quantity: 1 });
        store.addItem({ id: 'prod2', name: 'Product 2', price: 20, quantity: 1 });

        expect(store.getState().items).toHaveLength(2);
      });
    });

    describe('removeItem', () => {
      it('should remove an item from the cart', () => {
        store.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });

        store.removeItem('prod1');

        expect(store.getState().items).toHaveLength(0);
      });

      it('should only remove the specified item', () => {
        store.addItem({ id: 'prod1', name: 'Product 1', price: 10, quantity: 1 });
        store.addItem({ id: 'prod2', name: 'Product 2', price: 20, quantity: 1 });

        store.removeItem('prod1');

        expect(store.getState().items).toHaveLength(1);
        expect(store.getState().items[0].id).toBe('prod2');
      });

      it('should handle removing non-existent item gracefully', () => {
        store.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });

        store.removeItem('nonexistent');

        expect(store.getState().items).toHaveLength(1);
      });
    });

    describe('updateQuantity', () => {
      it('should update the quantity of an item', () => {
        store.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });

        store.updateQuantity('prod1', 5);

        expect(store.getState().items[0].quantity).toBe(5);
      });

      it('should remove item if quantity is set to 0', () => {
        store.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });

        store.updateQuantity('prod1', 0);

        expect(store.getState().items).toHaveLength(0);
      });

      it('should remove item if quantity is negative', () => {
        store.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });

        store.updateQuantity('prod1', -1);

        expect(store.getState().items).toHaveLength(0);
      });
    });

    describe('clearCart', () => {
      it('should remove all items from the cart', () => {
        store.addItem({ id: 'prod1', name: 'Product 1', price: 10, quantity: 1 });
        store.addItem({ id: 'prod2', name: 'Product 2', price: 20, quantity: 2 });

        store.clearCart();

        expect(store.getState().items).toHaveLength(0);
      });
    });

    describe('getTotalItems', () => {
      it('should return 0 for empty cart', () => {
        expect(store.getTotalItems()).toBe(0);
      });

      it('should return correct total items count', () => {
        store.addItem({ id: 'prod1', name: 'Product 1', price: 10, quantity: 2 });
        store.addItem({ id: 'prod2', name: 'Product 2', price: 20, quantity: 3 });

        expect(store.getTotalItems()).toBe(5);
      });
    });

    describe('getTotalPrice', () => {
      it('should return 0 for empty cart', () => {
        expect(store.getTotalPrice()).toBe(0);
      });

      it('should return correct total price', () => {
        store.addItem({ id: 'prod1', name: 'Product 1', price: 10, quantity: 2 }); // 20
        store.addItem({ id: 'prod2', name: 'Product 2', price: 15, quantity: 3 }); // 45

        expect(store.getTotalPrice()).toBe(65);
      });
    });
  });

  describe('Wishlist', () => {
    describe('addToWishlist', () => {
      it('should add item to wishlist', () => {
        const item = { productId: 'prod1', name: 'Test Product', price: 29.99 };

        store.addToWishlist(item);

        expect(store.getState().wishlist).toHaveLength(1);
        expect(store.getState().wishlist[0].productId).toBe('prod1');
        expect(store.getState().wishlist[0].addedAt).toBeDefined();
      });

      it('should not add duplicate items to wishlist', () => {
        const item = { productId: 'prod1', name: 'Test Product', price: 29.99 };

        store.addToWishlist(item);
        store.addToWishlist(item);

        expect(store.getState().wishlist).toHaveLength(1);
      });
    });

    describe('removeFromWishlist', () => {
      it('should remove item from wishlist', () => {
        store.addToWishlist({ productId: 'prod1', name: 'Test Product', price: 29.99 });

        store.removeFromWishlist('prod1');

        expect(store.getState().wishlist).toHaveLength(0);
      });
    });

    describe('isInWishlist', () => {
      it('should return true if item is in wishlist', () => {
        store.addToWishlist({ productId: 'prod1', name: 'Test Product', price: 29.99 });

        expect(store.isInWishlist('prod1')).toBe(true);
      });

      it('should return false if item is not in wishlist', () => {
        expect(store.isInWishlist('prod1')).toBe(false);
      });
    });
  });

  describe('Recently Viewed', () => {
    describe('addRecentlyViewed', () => {
      it('should add item to recently viewed', () => {
        const item = { productId: 'prod1', name: 'Test Product', price: 29.99 };

        store.addRecentlyViewed(item);

        expect(store.getState().recentlyViewed).toHaveLength(1);
        expect(store.getState().recentlyViewed[0].productId).toBe('prod1');
      });

      it('should move item to front if already viewed', () => {
        store.addRecentlyViewed({ productId: 'prod1', name: 'Product 1', price: 10 });
        store.addRecentlyViewed({ productId: 'prod2', name: 'Product 2', price: 20 });
        store.addRecentlyViewed({ productId: 'prod1', name: 'Product 1', price: 10 });

        expect(store.getState().recentlyViewed).toHaveLength(2);
        expect(store.getState().recentlyViewed[0].productId).toBe('prod1');
      });

      it('should limit recently viewed to 12 items', () => {
        for (let i = 1; i <= 15; i++) {
          store.addRecentlyViewed({ productId: `prod${i}`, name: `Product ${i}`, price: i * 10 });
        }

        expect(store.getState().recentlyViewed).toHaveLength(12);
        expect(store.getState().recentlyViewed[0].productId).toBe('prod15');
      });
    });

    describe('clearRecentlyViewed', () => {
      it('should clear all recently viewed items', () => {
        store.addRecentlyViewed({ productId: 'prod1', name: 'Product 1', price: 10 });
        store.addRecentlyViewed({ productId: 'prod2', name: 'Product 2', price: 20 });

        store.clearRecentlyViewed();

        expect(store.getState().recentlyViewed).toHaveLength(0);
      });
    });
  });

  describe('User Profile', () => {
    describe('setUserProfile', () => {
      it('should set user profile', () => {
        const profile = {
          id: 'user1',
          email: 'test@test.com',
          name: 'Test User',
          addresses: [],
        };

        store.setUserProfile(profile);

        expect(store.getState().userProfile).toEqual(profile);
      });

      it('should clear user profile when set to null', () => {
        store.setUserProfile({ id: 'user1', email: 'test@test.com', name: 'Test', addresses: [] });

        store.setUserProfile(null);

        expect(store.getState().userProfile).toBeNull();
      });
    });

    describe('loadUserFromStorage', () => {
      it('should load user from storage', () => {
        const mockUser = {
          id: 'user1',
          email: 'test@test.com',
          name: 'Test User',
          addresses: [
            {
              id: 'addr1',
              street: '123 Main St',
              city: 'Test City',
              state: 'TS',
              zipCode: '12345',
              country: 'USA',
            },
          ],
          defaultAddressId: 'addr1',
          phone: '1234567890',
        };
        (getCurrentUser as jest.Mock).mockReturnValue(mockUser);

        store.loadUserFromStorage();

        expect(store.getState().userProfile).toEqual({
          id: 'user1',
          email: 'test@test.com',
          name: 'Test User',
          addresses: mockUser.addresses,
          defaultAddressId: 'addr1',
          phone: '1234567890',
        });
      });

      it('should not update profile if no user in storage', () => {
        (getCurrentUser as jest.Mock).mockReturnValue(null);

        store.loadUserFromStorage();

        expect(store.getState().userProfile).toBeNull();
      });
    });
  });
});

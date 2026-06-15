import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../services/api_service.dart';

class CartItem {
  final ProductModel product;
  final int quantity;
  final String? notes;

  const CartItem({
    required this.product,
    required this.quantity,
    this.notes,
  });

  CartItem copyWith({int? quantity, String? notes}) => CartItem(
    product: product,
    quantity: quantity ?? this.quantity,
    notes: notes ?? this.notes,
  );
}

class MenuProvider extends ChangeNotifier {
  List<ProductModel> _products = [];
  final Map<String, CartItem> _cart = {};
  bool _loading = false;

  List<ProductModel> get products => _products;
  List<ProductModel> get drinks =>
      _products.where((p) => p.category == 'BEBIDA' && p.active).toList();
  List<ProductModel> get foods =>
      _products.where((p) => p.category == 'COMIDA' && p.active).toList();

  List<CartItem> get cartItems => _cart.values.toList();
  int get cartCount => _cart.values.fold(0, (sum, i) => sum + i.quantity);
  bool get cartIsEmpty => _cart.isEmpty;
  bool get loading => _loading;

  Future<void> loadProducts() async {
    _loading = true;
    notifyListeners();

    try {
      final response = await ApiService().dio.get('/products');
      _products = (response.data as List)
          .map((p) => ProductModel.fromJson(p))
          .toList();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void setQuantity(ProductModel product, int quantity) {
    if (quantity <= 0) {
      _cart.remove(product.id);
    } else {
      final existing = _cart[product.id];
      _cart[product.id] = existing != null
          ? existing.copyWith(quantity: quantity)
          : CartItem(product: product, quantity: quantity);
    }
    notifyListeners();
  }

  void setNotes(String productId, String notes) {
    final existing = _cart[productId];
    if (existing != null) {
      _cart[productId] = existing.copyWith(notes: notes.isEmpty ? null : notes);
      notifyListeners();
    }
  }

  int quantityOf(String productId) => _cart[productId]?.quantity ?? 0;
  String? notesOf(String productId) => _cart[productId]?.notes;

  void clearCart() {
    _cart.clear();
    notifyListeners();
  }
}

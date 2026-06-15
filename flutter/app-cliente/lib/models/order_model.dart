import 'product_model.dart';

class OrderItemModel {
  final String id;
  final int quantity;
  final String? notes;
  final String status;
  final ProductModel product;

  const OrderItemModel({
    required this.id,
    required this.quantity,
    required this.status,
    required this.product,
    this.notes,
  });

  OrderItemModel copyWith({String? status}) => OrderItemModel(
    id: id, quantity: quantity, notes: notes, product: product,
    status: status ?? this.status,
  );

  factory OrderItemModel.fromJson(Map<String, dynamic> json) => OrderItemModel(
    id:       json['id'],
    quantity: json['quantity'],
    notes:    json['notes'],
    status:   json['status'],
    product:  ProductModel.fromJson(json['product']),
  );
}

class OrderModel {
  final String id;
  final String sessionId;
  final String status;
  final DateTime createdAt;
  final List<OrderItemModel> items;

  const OrderModel({
    required this.id,
    required this.sessionId,
    required this.status,
    required this.createdAt,
    required this.items,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) => OrderModel(
    id:        json['id'],
    sessionId: json['sessionId'],
    status:    json['status'],
    createdAt: DateTime.parse(json['createdAt']),
    items:     (json['items'] as List<dynamic>? ?? [])
                 .map((i) => OrderItemModel.fromJson(i))
                 .toList(),
  );

  OrderModel copyWithItemStatus(String itemId, String newStatus) => OrderModel(
    id: id, sessionId: sessionId, status: status, createdAt: createdAt,
    items: items.map((i) => i.id == itemId ? i.copyWith(status: newStatus) : i).toList(),
  );
}
